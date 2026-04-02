import { type FormEvent, useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { apiClient } from '../api/apiClient'

interface UserItem {
  id: number
  username: string
}

interface PredictionItem {
  id: number
  lotteryType: string
  data: Record<string, unknown>
  status: string
  user: { username: string }
  createdAt: string
}

interface LotteryField {
  key: string
  label: string
  type: 'text' | 'number' | 'select' | 'textarea'
  required?: boolean
  options?: string[]
  helperText?: string
}

interface LotteryConfig {
  lotteryType: string
  label: string
  fields: LotteryField[]
}

export function PublishPostPage() {
  const [configs, setConfigs] = useState<LotteryConfig[]>([])
  const [predictions, setPredictions] = useState<PredictionItem[]>([])
  const [users, setUsers] = useState<UserItem[]>([])
  const [selectedType, setSelectedType] = useState('')
  const [formData, setFormData] = useState<Record<string, string | number>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [publisherId, setPublisherId] = useState<number | ''>('')
  const [submitError, setSubmitError] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)

  const fetchConfigs = () => apiClient.get('/lottery/configs').then((response) => setConfigs(response.data)).catch(() => setConfigs([]))
  const fetchUsers = () => apiClient.get('/users').then((response) => setUsers(response.data)).catch(() => setUsers([]))
  const fetchPredictions = () => apiClient.get('/predictions').then((response) => setPredictions(response.data.items ?? [])).catch(() => setPredictions([]))

  useEffect(() => {
    setLoading(true)
    Promise.all([fetchConfigs(), fetchUsers(), fetchPredictions()])
      .catch(() => setError('无法加载彩种配置或用户数据'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (configs.length > 0 && !selectedType) {
      setSelectedType(configs[0].lotteryType)
    }
  }, [configs, selectedType])

  const selectedConfig = useMemo(
    () => configs.find((config) => config.lotteryType === selectedType),
    [configs, selectedType],
  )

  useEffect(() => {
    if (selectedConfig) {
      const nextData: Record<string, string | number> = {}
      selectedConfig.fields.forEach((field) => {
        nextData[field.key] = ''
      })
      setFormData(nextData)
    }
  }, [selectedConfig])

  const handleFieldChange = (key: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleCreatePrediction = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError('')
    setSubmitLoading(true)

    if (!publisherId) {
      setSubmitError('请选择发布用户。')
      setSubmitLoading(false)
      return
    }

    try {
      await apiClient.post('/predictions', {
        lotteryType: selectedType,
        data: formData,
        publisherId,
      })
      setCreateOpen(false)
      setSubmitError('')
      fetchPredictions()
    } catch (error: any) {
      setSubmitError(error?.response?.data?.message ?? '创建预测失败，请检查输入。')
    } finally {
      setSubmitLoading(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ p: 4, bgcolor: '#ffffff', borderRadius: 3, boxShadow: '0 1px 12px rgba(15,23,42,0.06)' }}>
        <Typography>加载中...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'grid', gap: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h5" fontWeight="bold">
            预测内容管理
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            根据彩种配置动态生成表单，后台可灵活添加预测项。
          </Typography>
        </Box>
        <Button variant="contained" onClick={() => setCreateOpen(true)} sx={{ textTransform: 'none' }}>
          新建预测项
        </Button>
      </Box>

      {error ? (
        <Card sx={{ borderRadius: 4, boxShadow: 2 }}>
          <CardContent>
            <Typography color="error">{error}</Typography>
          </CardContent>
        </Card>
      ) : null}

      <Card sx={{ borderRadius: 4, boxShadow: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 3 }}>
            <FormControl sx={{ minWidth: 220 }}>
              <InputLabel>彩种</InputLabel>
              <Select value={selectedType} label="彩种" onChange={(event) => setSelectedType(event.target.value)}>
                {configs.map((config) => (
                  <MenuItem key={config.lotteryType} value={config.lotteryType}>
                    {config.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700 }}>
            现有预测项
          </Typography>

          <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 'none' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>彩种</TableCell>
                  <TableCell>发布者</TableCell>
                  <TableCell>状态</TableCell>
                  <TableCell>创建时间</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {predictions.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>{item.lotteryType}</TableCell>
                    <TableCell>{item.user?.username ?? '未知'}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ bgcolor: '#f8fafc' }}>新建预测项</DialogTitle>
        <DialogContent sx={{ bgcolor: '#ffffff' }}>
          <Box component="form" onSubmit={handleCreatePrediction} sx={{ display: 'grid', gap: 3, mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>发布用户</InputLabel>
              <Select value={publisherId} label="发布用户" onChange={(event) => setPublisherId(Number(event.target.value))}>
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.username}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedConfig?.fields.map((field) => {
              if (field.type === 'select') {
                return (
                  <FormControl fullWidth key={field.key}>
                    <InputLabel>{field.label}</InputLabel>
                    <Select
                      label={field.label}
                      value={formData[field.key] ?? ''}
                      onChange={(event) => handleFieldChange(field.key, event.target.value)}
                    >
                      {field.options?.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                    {field.helperText ? <Typography variant="caption">{field.helperText}</Typography> : null}
                  </FormControl>
                )
              }

              return (
                <TextField
                  key={field.key}
                  label={field.label}
                  value={formData[field.key] ?? ''}
                  onChange={(event) =>
                    handleFieldChange(field.key, field.type === 'number' ? Number(event.target.value) : event.target.value)
                  }
                  fullWidth
                  multiline={field.type === 'textarea'}
                  minRows={field.type === 'textarea' ? 4 : 1}
                  type={field.type === 'number' ? 'number' : 'text'}
                  helperText={field.helperText}
                  required={field.required}
                />
              )
            })}

            {submitError ? <Typography color="error">{submitError}</Typography> : null}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button onClick={() => setCreateOpen(false)}>取消</Button>
              <Button type="submit" variant="contained" disabled={submitLoading}>
                {submitLoading ? '保存中...' : '保存预测'}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  )
}
