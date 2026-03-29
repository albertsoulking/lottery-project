import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { apiClient } from '../api/apiClient'

interface UserItem {
  id: number
  username: string
  phone?: string
  role: string
  active: boolean
  balance: number
  createdAt: string
}

export function UsersPage() {
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState<UserItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null)
  const [adjustAmount, setAdjustAmount] = useState(0)
  const [remark, setRemark] = useState('')
  const [modalError, setModalError] = useState('')
  const [modalSuccess, setModalSuccess] = useState('')
  const [modalSaving, setModalSaving] = useState(false)

  const fetchUsers = () => {
    setLoading(true)
    setError('')
    apiClient
      .get('/users')
      .then((response) => {
        setUsers(response.data)
      })
      .catch(() => {
        setError('无法加载用户列表，请检查登录状态或后端服务。')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = useMemo(
    () => users.filter((user) => user.username.includes(query) || (user.phone ?? '').includes(query)),
    [query, users],
  )

  const openAdjustModal = (user: UserItem) => {
    setSelectedUser(user)
    setAdjustAmount(0)
    setRemark('')
    setModalError('')
    setModalSuccess('')
  }

  const closeModal = () => {
    setSelectedUser(null)
    setModalError('')
    setModalSuccess('')
  }

  const handleAdjust = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedUser) return

    setModalError('')
    setModalSuccess('')
    setModalSaving(true)

    try {
      await apiClient.post('/admin/adjust-balance', {
        userId: selectedUser.id,
        amount: adjustAmount,
        remark,
      })
      setModalSuccess('调账成功，已刷新用户数据。')
      fetchUsers()
    } catch {
      setModalError('调账失败，请检查输入或登录状态。')
    } finally {
      setModalSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">用户管理</h2>
          <p className="mt-2 text-slate-500">搜索、查看和手动调账用户余额。</p>
        </div>
        <label className="w-full max-w-sm">
          <span className="sr-only">搜索用户</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="按用户名或手机号搜索"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </label>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center text-slate-500 shadow-sm">加载用户数据中...</div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-700 shadow-sm">{error}</div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">用户名</th>
                <th className="px-6 py-4">手机号</th>
                <th className="px-6 py-4">余额</th>
                <th className="px-6 py-4">角色</th>
                <th className="px-6 py-4">状态</th>
                <th className="px-6 py-4">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t border-slate-200">
                  <td className="px-6 py-4 text-slate-700">{user.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{user.username}</td>
                  <td className="px-6 py-4 text-slate-700">{user.phone ?? '—'}</td>
                  <td className="px-6 py-4 text-slate-900">{user.balance}</td>
                  <td className="px-6 py-4 text-slate-700">{user.role}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        user.active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {user.active ? '正常' : '冻结'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => openAdjustModal(user)}
                      className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                    >
                      手动调账
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedUser ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-8">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">手动调账</h3>
                <p className="mt-1 text-sm text-slate-500">对用户 {selectedUser.username} 进行余额调节。</p>
              </div>
              <button type="button" onClick={closeModal} className="text-slate-500 hover:text-slate-900">
                关闭
              </button>
            </div>
            <form className="mt-6 space-y-4" onSubmit={handleAdjust}>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">目标用户</label>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
                  {selectedUser.username} (ID: {selectedUser.id})
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">调整金额</label>
                <input
                  type="number"
                  value={adjustAmount}
                  onChange={(event) => setAdjustAmount(Number(event.target.value))}
                  placeholder="输入正数为充值，负数为扣减"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">备注</label>
                <input
                  type="text"
                  value={remark}
                  onChange={(event) => setRemark(event.target.value)}
                  placeholder="例如：后台充值、手动扣费"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </div>
              {modalError ? <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{modalError}</div> : null}
              {modalSuccess ? <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{modalSuccess}</div> : null}
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={modalSaving}
                  className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {modalSaving ? '保存中...' : '提交调账'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}
