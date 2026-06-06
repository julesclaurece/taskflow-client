import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, CheckSquare, FolderKanban, LogOut } from 'lucide-react'
import { useAuth } from '../../store/auth'

const nav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { to: '/projects', icon: FolderKanban, label: 'Projects' },
]

export function BottomNav() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-slate-800"
      style={{ background: 'linear-gradient(180deg, #0f0c29, #1a1035)' }}>
      <div className="flex items-center justify-around px-2 py-2">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                isActive ? 'text-white' : 'text-slate-500'
              }`
            }
            style={({ isActive }) => isActive ? {
              background: 'linear-gradient(135deg, #219ebc, #1a7a94)',
            } : {}}
          >
            <Icon size={20} />
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-slate-500 hover:text-red-400 transition-all"
        >
          <LogOut size={20} />
          <span className="text-[10px] font-medium">Logout</span>
        </button>
      </div>
    </nav>
  )
}
