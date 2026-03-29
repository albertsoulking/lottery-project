import { type FormEvent, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
    } catch (err) {
      setError('登录失败，请检查用户名和密码。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-lg">
      <h1 className="mb-4 text-3xl font-semibold text-slate-900">管理员登录</h1>
      <p className="mb-8 text-slate-500">请输入管理员账号和密码以登录后台。</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">用户名</span>
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            name="username"
            type="text"
            required
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            placeholder="admin"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">密码</span>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            name="password"
            type="password"
            required
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            placeholder="••••••••"
          />
        </label>
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? '登录中...' : '登录'}
        </button>
      </form>
    </div>
  )
}
