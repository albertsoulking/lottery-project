import { useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'
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
      logs
        .filter((item) => {
          if (status === 'all') return true
          return status === 'won' ? item.status === 'DRAWN' : item.status !== 'DRAWN'
        })
        .map((item) => ({
          ...item,
          statusLabel: item.status === 'DRAWN' ? '已开奖' : '未开奖',
          drawAtText: new Date(item.drawAt).toLocaleString(),
        })),
    [logs, status],
  )

  const columns = [
    { field: 'phase', headerName: '期数', flex: 1, minWidth: 120 },
    { field: 'numbers', headerName: '开奖结果', flex: 1.6, minWidth: 180 },
    { field: 'statusLabel', headerName: '状态', flex: 0.8, minWidth: 100 },
    { field: 'drawAtText', headerName: '开奖时间', flex: 1.2, minWidth: 180 },
  ]

  return (
    <Box sx={{ display: 'grid', gap: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h5" fontWeight="bold">
            彩票管理
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            使用可排序表格查看历史开奖数据。
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {[
            { value: 'all', label: '全部' },
            { value: 'won', label: '已开奖' },
            { value: 'lost', label: '未开奖' },
          ].map((item) => (
            <Button key={item.value} variant={status === item.value ? 'contained' : 'outlined'} onClick={() => setStatus(item.value as 'all' | 'won' | 'lost')}>
              {item.label}
            </Button>
          ))}
        </Box>
      </Box>

      {error ? (
        <Card sx={{ borderRadius: 4, boxShadow: 2 }}>
          <CardContent>
            <Typography color="error">{error}</Typography>
          </CardContent>
        </Card>
      ) : (
        <Card sx={{ borderRadius: 4, boxShadow: 2, p: 2 }}>
          <Box sx={{ height: 520, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSizeOptions={[10, 20, 50]}
              initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
              loading={loading}
              autoHeight
              disableRowSelectionOnClick
              sx={{ border: 'none', '& .MuiDataGrid-cell': { borderBottom: '1px solid rgba(15,23,42,0.08)' } }}
            />
          </Box>
        </Card>
      )}
    </Box>
  )
}
