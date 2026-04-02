import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
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
    <Box sx={{ display: 'grid', gap: 4 }}>
      <Box>
        <Typography variant="h5" fontWeight="bold">
          财务日志
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          展示用户余额变动记录与调账明细。
        </Typography>
      </Box>

      {loading ? (
        <Card sx={{ borderRadius: 4, boxShadow: 2 }}>
          <CardContent>
            <Typography>加载财务日志中...</Typography>
          </CardContent>
        </Card>
      ) : error ? (
        <Card sx={{ borderRadius: 4, boxShadow: 2 }}>
          <CardContent>
            <Typography color="error">{error}</Typography>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>记录 ID</TableCell>
                <TableCell>用户</TableCell>
                <TableCell>金额</TableCell>
                <TableCell>类型</TableCell>
                <TableCell>余额</TableCell>
                <TableCell>备注</TableCell>
                <TableCell>时间</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.user?.username ?? '未知'}</TableCell>
                  <TableCell sx={{ color: item.amount >= 0 ? 'success.main' : 'error.main', fontWeight: 600 }}>
                    {item.amount >= 0 ? `+${item.amount}` : item.amount}
                  </TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.balanceAfter}</TableCell>
                  <TableCell>{item.remark ?? '—'}</TableCell>
                  <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )
}
