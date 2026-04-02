import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
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
    return <Typography>正在加载对账数据...</Typography>
  }

  if (error) {
    return <Typography color="error">{error}</Typography>
  }

  if (!summary) {
    return <Typography>暂无对账数据</Typography>
  }

  return (
    <Box sx={{ display: 'grid', gap: 4 }}>
      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' } }}>
        <Card sx={{ borderRadius: 4, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">
              累计充值
            </Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ mt: 2 }}>
              {summary.totalRecharge} 金币
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ borderRadius: 4, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">
              累计消费
            </Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ mt: 2 }}>
              {summary.totalConsumption} 金币
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <Card sx={{ borderRadius: 4, boxShadow: 2 }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            本页面展示系统内所有充值和购买流水的汇总信息。
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}
