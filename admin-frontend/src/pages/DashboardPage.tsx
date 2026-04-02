import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { apiClient } from '../api/apiClient'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'

interface FinanceSummary {
  todayRecharge: number
  todayWithdrawal: number
  purchaseCount: number
  purchaseAmount: number
}

export function DashboardPage() {
  const [summary, setSummary] = useState<FinanceSummary | null>(null)
  const [trend, setTrend] = useState<Array<{ date: string; recharge: number; withdrawal: number }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    Promise.all([
      apiClient.get('/transactions/finance-summary'),
      apiClient.get('/transactions/finance-trend'),
    ])
      .then(([summaryRes, trendRes]) => {
        setSummary(summaryRes.data)
        setTrend(trendRes.data)
      })
      .catch(() => {
        setError('无法加载统计数据，请稍后重试。')
      })
      .finally(() => setLoading(false))
  }, [])

  const stats = [
    { label: '今日充值', value: `¥${summary?.todayRecharge.toFixed(2) ?? '0.00'}` },
    { label: '今日提现', value: `¥${summary?.todayWithdrawal.toFixed(2) ?? '0.00'}` },
    { label: '已购数量', value: `${summary?.purchaseCount ?? 0}` },
    { label: '已购金额', value: `¥${summary?.purchaseAmount.toFixed(2) ?? '0.00'}` },
  ]

  if (loading) {
    return (
      <Box sx={{ p: 4, borderRadius: 4, bgcolor: '#ffffff', boxShadow: 2 }}>
        <Typography>加载统计数据中...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'grid', gap: 4 }}>
      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', xl: 'repeat(4, minmax(0, 1fr))' } }}>
        {stats.map((item) => (
          <Card key={item.label} sx={{ borderRadius: 4, boxShadow: 2, height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                {item.label}
              </Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ mt: 2 }}>
                {item.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Card sx={{ borderRadius: 4, boxShadow: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, mb: 3 }}>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                近七天财务走势
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                展示每日充值与提现趋势，帮助快速把握运营节奏。
              </Typography>
            </Box>
            {error ? (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            ) : null}
          </Box>

          <Box sx={{ minHeight: 340 }}>
            <ResponsiveContainer width="100%" height={340}>
              <LineChart data={trend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="rgba(15,23,42,0.08)" strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fill: '#475569' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#475569' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, borderColor: 'rgba(15,23,42,0.12)' }} />
                <Line type="monotone" dataKey="recharge" stroke="#1D4ED8" strokeWidth={3} dot={{ r: 4, fill: '#1D4ED8' }} />
                <Line type="monotone" dataKey="withdrawal" stroke="#0F766E" strokeWidth={3} dot={{ r: 4, fill: '#0F766E' }} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
