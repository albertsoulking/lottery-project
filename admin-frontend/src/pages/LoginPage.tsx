import { type FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { apiClient } from '../api/apiClient'

export function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('admin_token')) {
      navigate('/dashboard')
    }
  }, [navigate])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await apiClient.post('/auth/login', { username, password })
      const token = response.data?.accessToken
      if (token) {
        localStorage.setItem('admin_token', token)
        localStorage.setItem('admin_username', username)
        localStorage.setItem('admin_user_id', String(response.data.user?.id ?? ''))
        navigate('/dashboard')
      } else {
        setError(response.data?.message || '登录失败，请检查用户名和密码。')
      }
    } catch {
      setError('登录失败，请检查用户名和密码。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
      <Card sx={{ width: '100%', maxWidth: 480, borderRadius: 4, boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
            管理员登录
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            请输入管理员账号和密码以登录后台。
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 3 }}>
            <TextField
              label="用户名"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
              fullWidth
            />
            <TextField
              label="密码"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              fullWidth
            />
            {error ? (
              <Typography color="error" sx={{ mb: 1 }}>
                {error}
              </Typography>
            ) : null}
            <Button type="submit" variant="contained" size="large" disabled={loading}>
              {loading ? '登录中...' : '登录'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
