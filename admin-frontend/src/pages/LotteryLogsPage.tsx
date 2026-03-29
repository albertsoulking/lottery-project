import { useEffect, useMemo, useState } from 'react'
import { apiClient } from '../api/apiClient'

interface LotteryItem {
  id: number
  phase: string
  numbers: string
  status: string
  drawAt: string
}

export function LotteryLogsPage() {
  const [status, setStatus] = useState<'all' | 'won' | 'lost'>('all')
  const [logs, setLogs] = useState<LotteryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    apiClient
      .get('/lottery')
      .then((response) => {
        setLogs(response.data.items ?? [])
      })
      .catch(() => {
        setError('无法加载抽奖记录，请检查后端服务或登录状态。')
      })
      .finally(() => setLoading(false))
  }, [])

  const rows = useMemo(
    () =>
      logs.filter((item) => {
        if (status === 'all') return true
        return status === 'won' ? item.status === 'DRAWN' : item.status === 'PENDING'
      }),
    [logs, status],
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">抽奖记录</h2>
          <p className="mt-2 text-slate-500">筛选中奖与未中奖记录。</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setStatus('all')}
            className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
              status === 'all' ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            全部
          </button>
          <button
            type="button"
            onClick={() => setStatus('won')}
            className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
              status === 'won' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            中奖
          </button>
          <button
            type="button"
            onClick={() => setStatus('lost')}
            className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
              status === 'lost' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            未中奖
          </button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center text-slate-500 shadow-sm">加载抽奖记录中...</div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-700 shadow-sm">{error}</div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="px-6 py-4">记录 ID</th>
                <th className="px-6 py-4">期号</th>
                <th className="px-6 py-4">开奖号码</th>
                <th className="px-6 py-4">状态</th>
                <th className="px-6 py-4">开奖时间</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => (
                <tr key={item.id} className="border-t border-slate-200">
                  <td className="px-6 py-4 text-slate-700">{item.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{item.phase}</td>
                  <td className="px-6 py-4 text-slate-700">{item.numbers}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        item.status === 'DRAWN' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-700">{new Date(item.drawAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
