import { NavLink } from 'react-router-dom'
import { LayoutDashboard, CheckSquare, FolderKanban } from 'lucide-react'

const nav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { to: '/projects', icon: FolderKanban, label: 'Projects' },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-slate-200"
      style={{ background: 'linear-gradient(180deg, #0f0c29, #1a1035)' }}>
      <div className="flex items-center justify-around px-2 py-2 pb-safe">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-5 py-2 rounded-xl transition-all ${
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
      </div>
    </nav>
  )
}
