import { useEffect, useState } from 'react'
import { Link as RouterLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import LogoutIcon from '@mui/icons-material/Logout'
import DashboardIcon from '@mui/icons-material/Dashboard'
import HistoryIcon from '@mui/icons-material/History'
import PeopleIcon from '@mui/icons-material/People'
import ArticleIcon from '@mui/icons-material/Article'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import SettingsIcon from '@mui/icons-material/Settings'

const navItems = [
  { path: '/dashboard', label: '统计', icon: <DashboardIcon fontSize="small" /> },
  { path: '/users', label: '用户管理', icon: <PeopleIcon fontSize="small" /> },
  { path: '/lottery-types', label: '彩种管理', icon: <EmojiEventsIcon fontSize="small" /> },
  { path: '/posts', label: '帖子管理', icon: <ArticleIcon fontSize="small" /> },
  { path: '/create-post', label: '创建帖子', icon: <DashboardIcon fontSize="small" /> },
  { path: '/balance-logs', label: '财务日志', icon: <HistoryIcon fontSize="small" /> },
  { path: '/lottery-logs', label: '彩票管理', icon: <EmojiEventsIcon fontSize="small" /> },
  { path: '/settings', label: '参数设置', icon: <SettingsIcon fontSize="small" /> },
]

const drawerWidth = 280

export function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('admin_token')) {
      navigate('/login')
    }
  }, [navigate])

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev)
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_username')
    localStorage.removeItem('admin_user_id')
    navigate('/login')
  }

  const drawer = (
    <Box sx={{ height: '100%', bgcolor: '#111827', color: 'common.white' }}>
      <Toolbar />
      <List sx={{ py: 2 }}>
        {navItems.map((item) => {
          const active = location.pathname === item.path
          return (
            <ListItem disablePadding key={item.path}>
              <ListItemButton
                component={RouterLink}
                to={item.path}
                selected={active}
                sx={{
                  color: active ? 'common.white' : 'rgba(255,255,255,0.72)',
                  borderRadius: 2,
                  mb: 1,
                  px: 2,
                  borderLeft: active ? '4px solid #60A5FA' : '4px solid transparent',
                  pl: 1.5,
                  '&.Mui-selected': {
                    bgcolor: 'rgba(255,255,255,0.08)',
                  },
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.06)',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: active ? 'common.white' : 'rgba(255,255,255,0.68)' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 13, fontWeight: 600, letterSpacing: 0.8 }} />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: '#ffffff', color: '#111827', boxShadow: '0 1px 10px rgba(15,23,42,0.08)', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography component={RouterLink} to="/dashboard" variant="subtitle1" sx={{ color: '#111827', textDecoration: 'none', fontWeight: 700 }}>
              管理后台
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid rgba(15,23,42,0.12)', bgcolor: '#ffffff', display: 'grid', placeItems: 'center' }}>
              <Typography variant="caption" sx={{ color: '#111827', fontWeight: 700 }}>
                管
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: 'rgba(55,65,81,0.9)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              管理员
            </Typography>
            <IconButton onClick={handleLogout} sx={{ color: '#111827' }}>
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, bgcolor: '#111827', borderRight: '1px solid rgba(255,255,255,0.08)' },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, width: { md: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                欢迎回来，管理员
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                后台控制面板
              </Typography>
            </Box>
          </Box>
          <Box sx={{ borderRadius: 4, bgcolor: 'background.paper', p: 3, boxShadow: 1 }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
