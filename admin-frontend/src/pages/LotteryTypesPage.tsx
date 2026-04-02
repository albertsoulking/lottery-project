import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { apiClient } from '../api/apiClient'
import { getLotteryTypeDescription } from '../utils/lotteryTypeDisplay'

interface LotteryTypeItem {
  id: number
  name: string
  code: string
  ruleType: string
  description?: string
  config: Record<string, unknown>
}

export function LotteryTypeManagement() {
  const [types, setTypes] = useState<LotteryTypeItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)

  const loadTypes = () => {
    setLoading(true)
    setError('')
    apiClient
      .get('/lottery-types')
      .then((response) => setTypes(response.data))
      .catch(() => setError('无法加载彩种列表，请检查后端服务。'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadTypes()
  }, [])

  const handleReset = async () => {
    setSubmitError('')
    setSubmitLoading(true)

    try {
      await apiClient.post('/lottery-types/reset')
      setConfirmOpen(false)
      loadTypes()
    } catch {
      setSubmitError('重置彩种失败，请检查后端服务或当前数据状态。')
    } finally {
      setSubmitLoading(false)
    }
  }

  return (
    <Box sx={{ display: 'grid', gap: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h5" fontWeight="bold">
            彩种管理
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            彩种由开发人员预设，管理员只能查看或重置默认数据。
          </Typography>
        </Box>
        <Button variant="contained" color="warning" onClick={() => setConfirmOpen(true)} sx={{ textTransform: 'none' }}>
          Reset Types
        </Button>
      </Box>

      {loading ? (
        <Paper sx={{ p: 4 }}>
          <Typography>正在加载...</Typography>
        </Paper>
      ) : error ? (
        <Paper sx={{ p: 4, bgcolor: '#FEF3C7' }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>名称</TableCell>
                <TableCell>编码</TableCell>
                <TableCell>规则类型</TableCell>
                <TableCell>说明</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {types.map((type) => (
                <TableRow key={type.id} hover>
                  <TableCell>{type.name}</TableCell>
                  <TableCell>{type.code}</TableCell>
                  <TableCell>{type.ruleType}</TableCell>
                  <TableCell>{getLotteryTypeDescription(type.config, type.description)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Reset Lottery Types</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography>Are you sure to reset all lottery types?</Typography>
          {submitError ? (
            <Typography color="error" sx={{ mt: 2 }}>
              {submitError}
            </Typography>
          ) : null}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setConfirmOpen(false)}>取消</Button>
          <Button onClick={handleReset} disabled={submitLoading} color="warning" variant="contained">
            {submitLoading ? '重置中...' : '确认重置'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export const LotteryTypesPage = LotteryTypeManagement
