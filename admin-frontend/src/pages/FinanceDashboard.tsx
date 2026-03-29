import { useEffect, useState } from 'react'
import { apiClient } from '../api/apiClient'

interface FinanceSummary {
  totalRecharge: number
  totalConsumption: number
}

export function FinanceDashboard() {
  const [summary, setSummary] = useState<FinanceSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    apiClient
      .get('/admin/finance-summary')
      .then((response) => setSummary(response.data))
      .catch(() => setError('读取对账数据失败'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p>正在加载对账数据...</p>
  }

  if (error) {
    return <p className="text-red-600">{error}</p>
  }

  if (!summary) {
    return <p>暂无对账数据</p>
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <p className="text-sm text-slate-500">Total Recharge</p>
          <p className="mt-4 text-4xl font-semibold text-slate-900">{summary.totalRecharge} 金币</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <p className="text-sm text-slate-500">Total Consumption</p>
          <p className="mt-4 text-4xl font-semibold text-slate-900">{summary.totalConsumption} 金币</p>
        </div>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-slate-600">本页面展示系统内所有充值和购买流水的汇总信息。</p>
      </div>
    </div>
  )
}
