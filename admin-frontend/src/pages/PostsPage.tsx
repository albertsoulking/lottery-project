import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { apiClient } from '../api/apiClient'

interface PredictionItem {
  id: number
  lotteryType: {
    name: string
  }
  prediction: Record<string, unknown>
  result: Record<string, unknown>
  isWin: boolean
  createdAt: string
}

interface PostItem {
  id: number
  issue: number
  title: string
  type: string
  price: number
  createdAt: string
  items?: PredictionItem[]
}

export function PostsPage() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<PostItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadPosts = () => {
    setLoading(true)
    setError('')
    apiClient
      .get('/posts')
      .then((response) => setPosts(response.data.items ?? response.data))
      .catch(() => setError('无法加载帖子列表，请检查后端服务。'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadPosts()
  }, [])

  const renderRecord = (value: Record<string, unknown>) => {
    const entries = Object.entries(value)
    if (entries.length === 0) {
      return <Typography variant="body2" color="text.secondary">-</Typography>
    }
    return (
      <Box component="span" sx={{ display: 'inline-flex', flexDirection: 'column', gap: 0.5 }}>
        {entries.map(([key, item]) => (
          <Typography key={key} variant="body2">
            <strong>{key}:</strong> {typeof item === 'object' ? JSON.stringify(item) : String(item)}
          </Typography>
        ))}
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'grid', gap: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h5" fontWeight="bold">
            帖子管理
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            列出所有帖子，并展示每个帖子的预测项、结果和中奖状态。
          </Typography>
        </Box>
        <Button variant="contained" onClick={() => navigate('/create-post')} sx={{ textTransform: 'none' }}>
          创建帖子
        </Button>
      </Box>

      {loading ? (
        <Paper sx={{ p: 4 }}>
          <Typography>正在加载帖子...</Typography>
        </Paper>
      ) : error ? (
        <Paper sx={{ p: 4, bgcolor: '#FEF3C7' }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      ) : posts.length === 0 ? (
        <Paper sx={{ p: 4 }}>
          <Typography>暂无帖子数据。</Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'grid', gap: 3 }}>
          {posts.map((post) => (
            <Paper
              key={post.id}
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: 1,
                border: (theme) => `1px solid ${theme.palette.divider}`,
                bgcolor: post.items?.some((item) => item.isWin) ? 'rgba(220, 255, 200, 0.35)' : 'background.paper',
              }}
            >
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    期号 {post.issue}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {post.title}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2">类型：{post.type}</Typography>
                  <Typography variant="body2">价格：{post.price}</Typography>
                  <Typography variant="body2">创建时间：{new Date(post.createdAt).toLocaleString()}</Typography>
                </Box>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                  预测项
                </Typography>
                {post.items && post.items.length > 0 ? (
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>类型</TableCell>
                        <TableCell>预测</TableCell>
                        <TableCell>结果</TableCell>
                        <TableCell>状态</TableCell>
                        <TableCell>时间</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {post.items.map((item) => (
                        <TableRow key={item.id} sx={{ bgcolor: item.isWin ? 'rgba(16, 185, 129, 0.12)' : 'inherit' }}>
                          <TableCell>{item.lotteryType?.name ?? '未知'}</TableCell>
                          <TableCell>{renderRecord(item.prediction)}</TableCell>
                          <TableCell>{renderRecord(item.result)}</TableCell>
                          <TableCell>
                            <Typography color={item.isWin ? 'success.main' : 'text.secondary'}>
                              {item.isWin ? '中奖' : '未中'}
                            </Typography>
                          </TableCell>
                          <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    暂无预测项。
                  </Typography>
                )}
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  )
}
