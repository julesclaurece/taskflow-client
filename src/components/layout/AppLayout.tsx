import { Outlet, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Sidebar } from './Sidebar'
import { useAuth } from '../../store/auth'

export function AppLayout() {
  const { isAuthenticated, fetchMe } = useAuth()

  useEffect(() => {
    if (isAuthenticated) fetchMe()
  }, [])

  if (!isAuthenticated) return <Navigate to="/login" replace />

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
