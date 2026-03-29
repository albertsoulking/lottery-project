import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const navItems = [
  { path: '/dashboard', label: '仪表盘' },
  { path: '/finance', label: '财务对账' },
  { path: '/users', label: '用户管理' },
  { path: '/lottery-logs', label: '抽奖记录' },
  { path: '/settings', label: '系统设置' },
]

export function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('admin_token')) {
      navigate('/login')
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_username')
    localStorage.removeItem('admin_user_id')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="md:flex">
        <aside className="w-full md:w-72 bg-slate-950 text-white">
          <div className="px-6 py-8 border-b border-slate-800">
            <Link to="/dashboard" className="text-2xl font-bold tracking-tight">
              管理后台
            </Link>
            <p className="mt-2 text-sm text-slate-400">Lottery Project Admin</p>
          </div>
          <nav className="px-4 py-6 space-y-1">
            {navItems.map((item) => {
              const active = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                    active ? 'bg-slate-800 text-white shadow' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </aside>

        <main className="flex-1 p-6 md:p-8">
          <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-slate-500">欢迎回来，管理员</p>
              <h1 className="text-3xl font-semibold text-slate-900">后台控制面板</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white px-4 py-2 shadow-sm">
                <p className="text-xs text-slate-500">当前用户</p>
                <p className="font-semibold">admin</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                退出登录
              </button>
            </div>
          </header>

          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <Outlet />
          </section>
        </main>
      </div>
    </div>
  )
}
