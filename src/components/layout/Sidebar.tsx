import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, CheckSquare, FolderKanban, LogOut } from 'lucide-react'
import { useAuth } from '../../store/auth'

const nav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { to: '/projects', icon: FolderKanban, label: 'Projects' },
]

export function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user
    ? (user.first_name && user.last_name
      ? `${user.first_name[0]}${user.last_name[0]}`
      : user.username[0])
    : '?'

  return (
    <aside className="w-64 min-h-screen flex flex-col"
      style={{
        background: 'linear-gradient(180deg, #0f0c29 0%, #1a1035 50%, #0d0d1a 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}>

      {/* Logo */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="TaskFlow" className="w-10 h-10 rounded-xl object-contain" />
          <div>
            <span className="font-bold text-white text-lg tracking-tight">TaskFlow</span>
            <div className="text-[10px] text-indigo-400 font-medium tracking-widest uppercase">Pro</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 mb-3">Menu</p>
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'text-white shadow-lg'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
              }`
            }
            style={({ isActive }) => isActive ? {
              background: 'linear-gradient(135deg, #219ebc, #1a7a94)',
              boxShadow: '0 4px 15px rgba(33,158,188,0.25)',
            } : {}}
          >
            {({ isActive }) => (
              <>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${isActive ? 'bg-white/20' : 'bg-white/5'}`} >
                  <Icon size={15} />
                </div>
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Decorative glow */}
      <div className="mx-4 my-2 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.4), transparent)' }} />

      {/* User */}
      <div className="px-3 py-4">
        <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shadow-md" style={{ background: 'linear-gradient(135deg, #219ebc, #1a7a94)' }}>
              {initials.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.username}</p>
              <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={13} />
            Sign out
          </button>
        </div>
      </div>
    </aside>
  )
}
