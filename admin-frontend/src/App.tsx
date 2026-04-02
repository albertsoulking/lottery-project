import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout } from './layout/AdminLayout'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { FinanceDashboard } from './pages/FinanceDashboard'
import { UsersPage } from './pages/UsersPage'
import { LotteryLogsPage } from './pages/LotteryLogsPage'
import { SettingsPage } from './pages/SettingsPage'
import { LotteryTypesPage } from './pages/LotteryTypesPage'
import { PostsPage } from './pages/PostsPage'
import { CreatePostPage } from './pages/CreatePostPage'
import { BalanceLogsPage } from './pages/BalanceLogsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="lottery-types" element={<LotteryTypesPage />} />
          <Route path="posts" element={<PostsPage />} />
          <Route path="create-post" element={<CreatePostPage />} />
          <Route path="finance" element={<FinanceDashboard />} />
          <Route path="balance-logs" element={<BalanceLogsPage />} />
          <Route path="lottery-logs" element={<LotteryLogsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
