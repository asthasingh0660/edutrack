import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import Login from './pages/Login'
import Sidebar from './components/layout/Sidebar'
import MobileTopBar from './components/layout/MobileTopBar'
import PageWrapper from './components/layout/PageWrapper'
import StudentDashboard from './pages/StudentDashboard'
import AdminDashboard from './pages/AdminDashboard'
import AnalyticsPage from './pages/AnalyticsPage'
import StudentAssignmentsPage from './pages/StudentAssignmentsPage'
import AdminAssignmentsPage from './pages/AdminAssignmentsPage'

const pageTitles = {
  '/dashboard':   'Dashboard',
  '/assignments': 'Assignments',
  '/analytics':   'Analytics',
}

function AppShell() {
  const { role } = useApp()
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  if (!role) return <Navigate to="/login" replace />

  const title = pageTitles[location.pathname] ?? 'Dashboard'

  return (
    <div className="flex min-h-screen bg-cream dark:bg-ink">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex flex-col flex-1 min-w-0">
        <MobileTopBar title={title} setMobileOpen={setMobileOpen} />
        <PageWrapper>
          <Routes>
            {role === 'student' && (
              <>
                <Route path="/dashboard"   element={<StudentDashboard />} />
                <Route path="/assignments" element={<StudentAssignmentsPage />} />
                <Route path="*"            element={<Navigate to="/dashboard" replace />} />
              </>
            )}
            {role === 'admin' && (
              <>
                <Route path="/dashboard"   element={<AdminDashboard />} />
                <Route path="/assignments" element={<AdminAssignmentsPage />} />
                <Route path="/analytics"   element={<AnalyticsPage />} />
                <Route path="*"            element={<Navigate to="/dashboard" replace />} />
              </>
            )}
          </Routes>
        </PageWrapper>
      </div>
    </div>
  )
}

function Router() {
  const { role } = useApp()
  return (
    <Routes>
      <Route path="/login" element={role ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/*"     element={role ? <AppShell /> : <Navigate to="/login" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Router />
      </AppProvider>
    </BrowserRouter>
  )
}