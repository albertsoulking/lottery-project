import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { apiClient } from '../api/apiClient'
import { DynamicPredictionForm } from '../components/DynamicPredictionForm'
import type { DynamicPredictionFormConfig } from '../components/DynamicPredictionForm'

interface UserItem {
  id: number
  username: string
}

interface LotteryTypeItem {
  id: number
  name: string
  code: string
  ruleType: string
  config: DynamicPredictionFormConfig
}

interface PredictionItem {
  prediction: Record<string, unknown>
  result: { number: number; zodiac?: string }
}

interface ClonedPostItem {
  typeId: number
  prediction: Record<string, unknown>
  result: { number: number; zodiac?: string }
}

interface CloneLastPostResponse {
  sourcePostId: number
  issue: number
  title: string
  summary: string
  contentHidden: string
  type: 'FREE' | 'PAID'
  price: number
  publisherId?: number
  items: ClonedPostItem[]
}

export function CreatePostPage() {
  const navigate = useNavigate()
  const [users, setUsers] = useState<UserItem[]>([])
  const [lotteryTypes, setLotteryTypes] = useState<LotteryTypeItem[]>([])
  const [selectedTypeId, setSelectedTypeId] = useState<number | ''>('')
  const [currentPrediction, setCurrentPrediction] = useState<Record<string, unknown>>({})
  const [currentResultNumber, setCurrentResultNumber] = useState<number>(0)
  const [currentResultZodiac, setCurrentResultZodiac] = useState('')
  const [items, setItems] = useState<PredictionItem[]>([])
  const [issue, setIssue] = useState(0)
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [type, setType] = useState<'FREE' | 'PAID'>('FREE')
  const [price, setPrice] = useState(0)
  const [publisherId, setPublisherId] = useState<number | ''>('')
  const [submitError, setSubmitError] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)
  const [itemError, setItemError] = useState('')
  const [cloneLoading, setCloneLoading] = useState(false)
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null)

  useEffect(() => {
    apiClient.get('/users').then((response) => setUsers(response.data)).catch(() => setSubmitError('无法加载用户列表，请检查后端服务。'))
    apiClient.get('/lottery-types').then((response) => setLotteryTypes(response.data)).catch(() => setSubmitError('无法加载彩种列表，请检查后端服务。'))
  }, [])

  const selectedType = useMemo(() => lotteryTypes.find((type) => type.id === selectedTypeId), [lotteryTypes, selectedTypeId])

  useEffect(() => {
    if (selectedType) {
      setCurrentPrediction({})
      setCurrentResultNumber(0)
      setCurrentResultZodiac('')
      setItemError('')
    }
  }, [selectedType])

  const addItem = () => {
    if (!selectedType) {
      setItemError('请先选择彩种。')
      return
    }
    if (!currentResultNumber || currentResultNumber < 0) {
      setItemError('请填写正确的开奖号码。')
      return
    }
    const nextItem: PredictionItem = {
      prediction: currentPrediction,
      result: { number: currentResultNumber, zodiac: currentResultZodiac || undefined },
    }
    setItems((prev) => {
      if (editingItemIndex === null) {
        return [...prev, nextItem]
      }
      const next = [...prev]
      next[editingItemIndex] = nextItem
      return next
    })
    setCurrentPrediction({})
    setCurrentResultNumber(0)
    setCurrentResultZodiac('')
    setEditingItemIndex(null)
    setItemError('')
  }

  const startEditItem = (index: number) => {
    const item = items[index]
    if (!item) {
      return
    }
    setCurrentPrediction(item.prediction)
    setCurrentResultNumber(item.result.number)
    setCurrentResultZodiac(item.result.zodiac ?? '')
    setEditingItemIndex(index)
    setItemError('')
  }

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, itemIndex) => itemIndex !== index))
    setItemError('')
    if (editingItemIndex === index) {
      setEditingItemIndex(null)
      setCurrentPrediction({})
      setCurrentResultNumber(0)
      setCurrentResultZodiac('')
    } else if (editingItemIndex !== null && index < editingItemIndex) {
      setEditingItemIndex(editingItemIndex - 1)
    }
  }

  const cancelEditing = () => {
    setEditingItemIndex(null)
    setCurrentPrediction({})
    setCurrentResultNumber(0)
    setCurrentResultZodiac('')
    setItemError('')
  }

  const handleCloneLastPost = async () => {
    setSubmitError('')
    setItemError('')
    setCloneLoading(true)

    try {
      const response = await apiClient.post<CloneLastPostResponse>('/posts/clone-last')
      const cloneData = response.data
      const firstTypeId = cloneData.items[0]?.typeId

      setIssue(cloneData.issue)
      setTitle(cloneData.title)
      setSummary(cloneData.summary)
      setType(cloneData.type)
      setPrice(cloneData.price)
      setPublisherId(cloneData.publisherId ?? '')
      setItems(
        (cloneData.items ?? []).map((item) => ({
          prediction: item.prediction ?? {},
          result: { number: Number(item.result?.number ?? 0), zodiac: item.result?.zodiac },
        })),
      )
      setCurrentPrediction({})
      setCurrentResultNumber(0)
      setCurrentResultZodiac('')
      setEditingItemIndex(null)

      if (firstTypeId) {
        setSelectedTypeId(firstTypeId)
      }
    } catch (error: any) {
      setSubmitError(error?.response?.data?.message ?? '复制上一期失败，请检查后端服务。')
    } finally {
      setCloneLoading(false)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError('')
    setSubmitLoading(true)

    if (!publisherId) {
      setSubmitError('请选择发布用户。')
      setSubmitLoading(false)
      return
    }
    if (!selectedType) {
      setSubmitError('请选择彩种。')
      setSubmitLoading(false)
      return
    }
    if (items.length === 0) {
      setSubmitError('请至少添加一条预测项。')
      setSubmitLoading(false)
      return
    }

    try {
      const postResponse = await apiClient.post('/posts', {
        issue,
        title,
        summary,
        contentHidden: summary,
        price,
        type,
        publisherId,
      })

      const postId = postResponse.data.id
      await Promise.all(
        items.map((item) =>
          apiClient.post('/post-items', {
            postId,
            typeId: selectedType.id,
            prediction: item.prediction,
            result: item.result,
          }),
        ),
      )

      navigate('/posts')
    } catch (error: any) {
      setSubmitError(error?.response?.data?.message ?? '创建帖子失败，请检查输入或登录状态。')
    } finally {
      setSubmitLoading(false)
    }
  }

  return (
    <Box sx={{ display: 'grid', gap: 4 }}>
      <Box>
        <Typography variant="h5" fontWeight="bold">
          创建预测帖子
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          选择彩种，填写基础帖子信息，并添加多个预测项。
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button variant="outlined" onClick={handleCloneLastPost} disabled={cloneLoading}>
            {cloneLoading ? '复制中...' : '复制上一期'}
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, boxShadow: 1 }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 3 }}>
          <TextField value={issue} onChange={(event) => setIssue(Number(event.target.value))} label="期号" type="number" required fullWidth />
          <TextField value={title} onChange={(event) => setTitle(event.target.value)} label="标题" required fullWidth />
          <TextField
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
            label="摘要／内容"
            required
            fullWidth
            multiline
            minRows={4}
          />
          <FormControl fullWidth>
            <InputLabel>帖子类型</InputLabel>
            <Select value={type} label="帖子类型" onChange={(event) => setType(event.target.value as 'FREE' | 'PAID')}>
              <MenuItem value="FREE">FREE</MenuItem>
              <MenuItem value="PAID">PAID</MenuItem>
            </Select>
          </FormControl>
          <TextField value={price} onChange={(event) => setPrice(Number(event.target.value))} label="价格" type="number" required fullWidth />
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

          <FormControl fullWidth>
            <InputLabel>彩种</InputLabel>
            <Select value={selectedTypeId} label="彩种" onChange={(event) => setSelectedTypeId(Number(event.target.value))}>
              {lotteryTypes.map((lotteryType) => (
                <MenuItem key={lotteryType.id} value={lotteryType.id}>
                  {lotteryType.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedType ? (
            <Box sx={{ display: 'grid', gap: 3 }}>
              <Box sx={{ p: 2, border: '1px solid rgba(0,0,0,0.08)', borderRadius: 3, bgcolor: '#f9fafb' }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                  添加预测项
                </Typography>
                <DynamicPredictionForm
                  config={selectedType.config}
                  value={currentPrediction}
                  onChange={(prediction) => setCurrentPrediction(prediction)}
                />
                <Box sx={{ display: 'grid', gap: 2, mt: 2 }}>
                  <TextField
                    label="开奖号码"
                    type="number"
                    value={currentResultNumber}
                    onChange={(event) => setCurrentResultNumber(Number(event.target.value))}
                    fullWidth
                    required
                  />
                  <TextField
                    label="生肖（可选）"
                    value={currentResultZodiac}
                    onChange={(event) => setCurrentResultZodiac(event.target.value)}
                    fullWidth
                  />
                  {itemError ? <Typography color="error">{itemError}</Typography> : null}
                  <Button variant="contained" onClick={addItem} sx={{ textTransform: 'none' }}>
                    {editingItemIndex === null ? '添加预测项' : `保存修改（第 ${editingItemIndex + 1} 条）`}
                  </Button>
                  {editingItemIndex !== null ? (
                    <Button variant="text" color="inherit" onClick={cancelEditing} sx={{ textTransform: 'none' }}>
                      取消编辑
                    </Button>
                  ) : null}
                </Box>
              </Box>
            </Box>
          ) : (
            <Typography color="text.secondary">请选择彩种后，加载动态预测表单。</Typography>
          )}

          {items.length > 0 ? (
            <Box sx={{ p: 2, border: '1px solid rgba(0,0,0,0.08)', borderRadius: 3, bgcolor: '#ffffff' }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                当前预测项 ({items.length})
              </Typography>
              {items.map((item, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2, borderRadius: 2, bgcolor: '#f8fafc' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    预测项 {index + 1}
                  </Typography>
                  <Typography variant="body2">开奖号码：{item.result.number}</Typography>
                  {item.result.zodiac ? <Typography variant="body2">生肖：{item.result.zodiac}</Typography> : null}
                  <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                    预测：{JSON.stringify(item.prediction)}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Button size="small" variant="outlined" onClick={() => startEditItem(index)}>
                      编辑
                    </Button>
                    <Button size="small" variant="outlined" color="error" onClick={() => removeItem(index)}>
                      删除
                    </Button>
                  </Box>
                </Paper>
              ))}
            </Box>
          ) : null}

          {submitError ? <Typography color="error">{submitError}</Typography> : null}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => navigate('/posts')}>
              返回列表
            </Button>
            <Button type="submit" variant="contained" disabled={submitLoading}>
              {submitLoading ? '提交中...' : '提交帖子'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}
