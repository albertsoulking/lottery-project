import { type FormEvent, useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import SearchIcon from '@mui/icons-material/Search'
import { apiClient } from '../api/apiClient'

interface UserItem {
  id: number
  username: string
  phone?: string
  role: string
  active: boolean
  balance: number
  createdAt: string
}

export function UsersPage() {
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState<UserItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null)
  const [adjustAmount, setAdjustAmount] = useState(0)
  const [remark, setRemark] = useState('')
  const [modalError, setModalError] = useState('')
  const [modalSuccess, setModalSuccess] = useState('')
  const [modalSaving, setModalSaving] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const defaultNewUserRole = 'Test'
  const [createError, setCreateError] = useState('')
  const [createLoading, setCreateLoading] = useState(false)

  const fetchUsers = () => {
    setLoading(true)
    setError('')
    apiClient
      .get('/users')
      .then((response) => {
        setUsers(response.data)
      })
      .catch(() => {
        setError('无法加载用户列表，请检查登录状态或后端服务。')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = useMemo(
    () => users.filter((user) => user.username.toLowerCase().includes(query.toLowerCase()) || (user.phone ?? '').includes(query)),
    [query, users],
  )

  const openAdjustModal = (user: UserItem) => {
    setSelectedUser(user)
    setAdjustAmount(0)
    setRemark('')
    setModalError('')
    setModalSuccess('')
  }

  const closeModal = () => {
    setSelectedUser(null)
    setModalError('')
    setModalSuccess('')
  }

  const handleAdjust = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedUser) return

    setModalError('')
    setModalSuccess('')
    setModalSaving(true)

    try {
      await apiClient.post('/admin/adjust-balance', {
        userId: selectedUser.id,
        amount: adjustAmount,
        remark,
      })
      setModalSuccess('调账成功，已刷新用户数据。')
      fetchUsers()
    } catch {
      setModalError('调账失败，请检查输入或登录状态。')
    } finally {
      setModalSaving(false)
    }
  }

  const handleCreateUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setCreateError('')
    setCreateLoading(true)

    try {
      await apiClient.post('/users', {
        username: newUsername,
        password: newPassword,
        role: defaultNewUserRole,
      })
      setNewUsername('')
      setNewPassword('')
      setAddOpen(false)
      fetchUsers()
    } catch {
      setCreateError('创建用户失败，请检查输入或权限。')
    } finally {
      setCreateLoading(false)
    }
  }

  return (
    <Box sx={{ display: 'grid', gap: 4, bgcolor: '#ffffff', borderRadius: 3, p: { xs: 2, md: 3 }, boxShadow: '0 1px 12px rgba(15,23,42,0.06)' }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between', gap: 3 }}>
        <Box>
          <Typography variant="overline" sx={{ color: '#111827', fontWeight: 700, letterSpacing: 1.2 }}>
            用户管理
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(55,65,81,0.78)', mt: 1 }}>
            使用简洁的表格搜索并管理用户余额。
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', maxWidth: 520 }}>
          <TextField
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            fullWidth
            placeholder="搜索用户名或手机号"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'rgba(15,23,42,0.5)' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: '#ffffff',
                border: '1px solid rgba(0,0,0,0.14)',
              },
            }}
          />
          <Button variant="contained" onClick={() => setAddOpen(true)} sx={{ textTransform: 'none' }}>
            添加用户
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ p: 4, border: '1px solid rgba(0,0,0,0.08)', borderRadius: 3, bgcolor: '#ffffff' }}>
          <Typography sx={{ color: 'rgba(55,65,81,0.75)' }}>正在加载用户...</Typography>
        </Box>
      ) : error ? (
        <Box sx={{ p: 4, border: '1px solid rgba(255,0,0,0.12)', borderRadius: 3, bgcolor: '#fff7f7' }}>
          <Typography sx={{ color: '#b91c1c' }}>{error}</Typography>
        </Box>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 'none', border: '1px solid rgba(0,0,0,0.08)' }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  {['ID', '用户名', '手机号', '余额', '角色', '状态', '操作'].map((label) => (
                    <TableCell key={label} sx={{ color: '#111827', fontWeight: 700, borderBottom: 'none', py: 2 }}>
                      {label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} sx={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                    <TableCell sx={{ color: 'rgba(15,23,42,0.78)', py: 2 }}>{user.id}</TableCell>
                    <TableCell sx={{ color: 'rgba(15,23,42,0.88)', py: 2 }}>{user.username}</TableCell>
                    <TableCell sx={{ color: 'rgba(15,23,42,0.78)', py: 2 }}>{user.phone ?? '—'}</TableCell>
                    <TableCell sx={{ color: user.balance >= 0 ? '#0f4fbc' : 'rgba(15,23,42,0.78)', py: 2 }}>{user.balance.toFixed(2)}</TableCell>
                    <TableCell sx={{ color: 'rgba(15,23,42,0.78)', py: 2 }}>{user.role}</TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Box sx={{ display: 'inline-flex', alignItems: 'center', px: 1.8, py: 0.7, borderRadius: 999, bgcolor: user.active ? '#dcfce7' : '#FEE2E2', color: user.active ? '#166534' : '#991B1B', fontWeight: 600, fontSize: 12 }}>
                        {user.active ? '正常' : '冻结'}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Button
                        variant="contained"
                        disableElevation
                        sx={{
                          backgroundColor: '#DBEAFE',
                          color: '#1E3A8A',
                          textTransform: 'none',
                          boxShadow: 'none',
                          '&:hover': { backgroundColor: '#BFDBFE' },
                        }}
                        onClick={() => openAdjustModal(user)}
                      >
                        手动调账
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
            <Typography variant="body2" sx={{ color: 'rgba(15,23,42,0.7)' }}>
              共 {users.length} 条
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" sx={{ border: '1px solid rgba(0,0,0,0.08)', color: '#111827' }}>
                <ChevronLeftIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ border: '1px solid rgba(0,0,0,0.08)', color: '#111827' }}>
                <ChevronRightIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </>
      )}

      <Dialog open={Boolean(selectedUser)} onClose={closeModal} fullWidth maxWidth="sm">
        <DialogTitle sx={{ bgcolor: '#f8fafc' }}>手动调账</DialogTitle>
        <DialogContent sx={{ bgcolor: '#ffffff' }}>
          <Box sx={{ display: 'grid', gap: 3, mt: 1 }} component="form" onSubmit={handleAdjust}>
            <Typography variant="body2" sx={{ color: 'rgba(55,65,81,0.78)' }}>
              调整用户 {selectedUser?.username} 的余额。
            </Typography>
            <TextField label="目标用户" value={selectedUser?.username ?? ''} fullWidth disabled />
            <TextField
              label="调整金额"
              type="number"
              value={adjustAmount}
              onChange={(event) => setAdjustAmount(Number(event.target.value))}
              helperText="正数为充值，负数为扣减"
              fullWidth
            />
            <TextField label="备注" value={remark} onChange={(event) => setRemark(event.target.value)} fullWidth />
            {modalError ? <Typography color="error">{modalError}</Typography> : null}
            {modalSuccess ? <Typography color="success.main">{modalSuccess}</Typography> : null}
            <DialogActions sx={{ px: 0, pb: 0, pt: 2 }}>
              <Button onClick={closeModal}>取消</Button>
              <Button type="submit" variant="contained" disabled={modalSaving}>
                {modalSaving ? '保存中...' : '提交调账'}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog open={addOpen} onClose={() => setAddOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ bgcolor: '#f8fafc' }}>添加用户</DialogTitle>
        <DialogContent sx={{ bgcolor: '#ffffff' }}>
          <Box sx={{ display: 'grid', gap: 3, mt: 1 }} component="form" onSubmit={handleCreateUser}>
            <TextField
              label="用户名"
              value={newUsername}
              onChange={(event) => setNewUsername(event.target.value)}
              required
              fullWidth
            />
            <TextField
              label="密码"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              required
              fullWidth
            />
            <TextField
              label="角色"
              value={defaultNewUserRole}
              disabled
              fullWidth
            />
            {createError ? <Typography color="error">{createError}</Typography> : null}
            <DialogActions sx={{ px: 0, pb: 0, pt: 2 }}>
              <Button onClick={() => setAddOpen(false)}>取消</Button>
              <Button type="submit" variant="contained" disabled={createLoading}>
                {createLoading ? '创建中...' : '确认'}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  )
}
