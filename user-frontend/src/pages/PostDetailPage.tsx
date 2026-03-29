import { useEffect, useState } from 'react'
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'
import { apiClient } from '../api/apiClient'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Container from '@mui/material/Container'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

interface PostDetail {
  id: number
  title: string
  summary: string
  contentHidden: string | null
  price: number
  type: 'FREE' | 'PAID'
  purchased?: boolean
  isPurchased?: boolean
}

export function PostDetailPage() {
  const params = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const [post, setPost] = useState<PostDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [purchaseLoading, setPurchaseLoading] = useState(false)
  const [purchaseMessage, setPurchaseMessage] = useState('')

  const postId = Number(params.id)
  const isLoggedIn = Boolean(localStorage.getItem('user_token'))

  useEffect(() => {
    if (!postId) {
      setError('无效的帖子 ID')
      return
    }
    setLoading(true)
    setError('')
    apiClient
      .get<PostDetail>(`/posts/${postId}`)
      .then((response) => {
        setPost(response.data)
      })
      .catch((err: unknown) => {
        const message = (err as any)?.response?.data?.message
        setError(message || '帖子加载失败，请重试。')
      })
      .finally(() => setLoading(false))
  }, [postId])

  const handlePurchase = async () => {
    if (!post) return
    setPurchaseLoading(true)
    setPurchaseMessage('')

    try {
      await apiClient.post('/transactions/purchase', { postId: post.id })
      setPurchaseMessage('购买成功，内容已解锁。')
      const response = await apiClient.get(`/posts/${post.id}`)
      setPost(response.data)
    } catch (err) {
      const errorMessage = (err as any)?.response?.data?.message
      setPurchaseMessage(errorMessage || '购买失败，请检查余额或登录状态。')
    } finally {
      setPurchaseLoading(false)
    }
  }

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography>加载帖子中...</Typography>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          返回
        </Button>
      </Container>
    )
  }

  if (!post) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography>帖子不存在</Typography>
      </Container>
    )
  }

  const isPurchased = post.type === 'FREE' || post.isPurchased || post.purchased

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            {post.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {post.summary}
          </Typography>
        </CardContent>
      </Card>

      {post.type === 'PAID' && !isPurchased ? (
        <Card sx={{ mb: 3, borderColor: 'warning.main', borderWidth: 1, borderStyle: 'solid' }}>
          <CardContent>
            {isLoggedIn ? (
              <Typography variant="body1" color="text.secondary">
                该内容为付费隐藏内容，购买后可查看完整内容。
              </Typography>
            ) : (
              <Typography variant="body1" color="text.secondary">
                请先 <Link component={RouterLink} to="/login">登录</Link> 后再购买隐藏内容。
              </Typography>
            )}
            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color="warning"
                onClick={handlePurchase}
                disabled={purchaseLoading || !isLoggedIn}
              >
                {purchaseLoading ? '购买中...' : isLoggedIn ? `消耗 ${post.price} 金币解锁` : '请先登录'}
              </Button>
            </Box>
            {purchaseMessage ? <Typography sx={{ mt: 2 }} color="text.secondary">{purchaseMessage}</Typography> : null}
          </CardContent>
        </Card>
      ) : null}

      {isPurchased && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              隐藏内容
            </Typography>
            <Typography sx={{ whiteSpace: 'pre-line' }}>{post.contentHidden}</Typography>
          </CardContent>
        </Card>
      )}

      {post.type === 'PAID' && post.purchased && purchaseMessage ? (
        <Alert severity="success">{purchaseMessage}</Alert>
      ) : null}
    </Container>
  )
}
