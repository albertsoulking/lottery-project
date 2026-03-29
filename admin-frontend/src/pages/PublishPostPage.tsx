import { type FormEvent, useState } from 'react'
import { apiClient } from '../api/apiClient'

export function PublishPostPage() {
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [contentHidden, setContentHidden] = useState('')
  const [type, setType] = useState<'FREE' | 'PAID'>('PAID')
  const [price, setPrice] = useState(0)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [saving, setSaving] = useState(false)

  const adminId = Number(localStorage.getItem('admin_user_id') ?? 0)
  const isPaid = type === 'PAID'

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!adminId) {
      setError('未获取管理员 ID，请重新登录。')
      return
    }

    if (isPaid && price <= 0) {
      setError('付费帖子必须填写大于 0 的价格。')
      return
    }

    setSaving(true)
    try {
      await apiClient.post('/posts', {
        title,
        summary,
        contentHidden: isPaid ? contentHidden : '',
        type,
        price: isPaid ? price : 0,
        publisherId: adminId,
      })
      setSuccess('帖子发布成功。')
      setTitle('')
      setSummary('')
      setContentHidden('')
      setPrice(0)
    } catch {
      setError('发布失败，请检查输入并确认登录状态。')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">发帖管理</h2>
        <p className="mt-2 text-slate-500">发布公开摘要或付费隐藏内容帖子。</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700">标题</label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              placeholder="请输入帖子标题"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">摘要</label>
            <textarea
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              placeholder="请输入帖子公开摘要"
              rows={4}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">帖子类型</label>
              <select
                value={type}
                onChange={(event) => setType(event.target.value as 'FREE' | 'PAID')}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              >
                <option value="PAID">付费帖子</option>
                <option value="FREE">公开帖子</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">价格 (金币)</label>
              <input
                type="number"
                min={0}
                value={price}
                disabled={!isPaid}
                onChange={(event) => setPrice(Number(event.target.value))}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100"
                placeholder="付费时填写"
              />
            </div>
          </div>

          {isPaid ? (
            <div>
              <label className="block text-sm font-medium text-slate-700">隐藏内容</label>
              <textarea
                value={contentHidden}
                onChange={(event) => setContentHidden(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                placeholder="请输入付费可见内容"
                rows={6}
                required
              />
            </div>
          ) : null}

          {error ? <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
          {success ? <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div> : null}

          <button
            type="submit"
            disabled={saving}
            className="rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? '发布中...' : '发布帖子'}
          </button>
        </form>
      </div>
    </div>
  )
}
