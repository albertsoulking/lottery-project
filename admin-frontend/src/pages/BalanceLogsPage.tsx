import { useEffect, useState } from 'react'
import { apiClient } from '../api/apiClient'

interface BalanceLogItem {
  id: number
  amount: number
  type: string
  balanceAfter: number
  remark?: string
  createdAt: string
  user: {
    id: number
    username: string
  }
}

export function BalanceLogsPage() {
  const [logs, setLogs] = useState<BalanceLogItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    apiClient
      .get('/transactions/logs?limit=100')
      .then((response) => {
        setLogs(response.data.items ?? [])
      })
      .catch(() => {
        setError('无法加载财务日志，请检查登录状态或后端服务。')
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">财务日志</h2>
        <p className="mt-2 text-slate-500">展示用户余额变动记录与调账明细。</p>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center text-slate-500 shadow-sm">加载财务日志中...</div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-700 shadow-sm">{error}</div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">用户</th>
                <th className="px-6 py-4">金额</th>
                <th className="px-6 py-4">类型</th>
                <th className="px-6 py-4">余额</th>
                <th className="px-6 py-4">备注</th>
                <th className="px-6 py-4">时间</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((item) => (
                <tr key={item.id} className="border-t border-slate-200">
                  <td className="px-6 py-4 text-slate-700">{item.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{item.user?.username ?? '未知'}</td>
                  <td className={`px-6 py-4 font-semibold ${item.amount >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {item.amount >= 0 ? `+${item.amount}` : item.amount}
                  </td>
                  <td className="px-6 py-4 text-slate-700">{item.type}</td>
                  <td className="px-6 py-4 text-slate-700">{item.balanceAfter}</td>
                  <td className="px-6 py-4 text-slate-700">{item.remark ?? '—'}</td>
                  <td className="px-6 py-4 text-slate-700">{new Date(item.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
