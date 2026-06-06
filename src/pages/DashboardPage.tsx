import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Clock, Circle, FolderKanban, ArrowRight, TrendingUp, Zap } from 'lucide-react'
import { api } from '../lib/api'
import { useAuth } from '../store/auth'
import type { Task, Project, PaginatedResponse } from '../lib/types'
import { StatusBadge, PriorityBadge } from '../components/ui/Badge'

const greetings = ['Good morning', 'Good afternoon', 'Good evening']
const greeting = greetings[Math.floor(new Date().getHours() / 8)]

export function DashboardPage() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<PaginatedResponse<Task>>('/tasks/?ordering=-created_at'),
      api.get<PaginatedResponse<Project>>('/projects/'),
    ]).then(([tasksRes, projectsRes]) => {
      setTasks(tasksRes.data.results)
      setProjects(projectsRes.data.results)
    }).finally(() => setLoading(false))
  }, [])

  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    done: tasks.filter(t => t.status === 'done').length,
  }

  const donePercent = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center animate-pulse">
            <Zap size={20} className="text-white" />
          </div>
          <p className="text-slate-400 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="relative overflow-hidden px-4 md:px-8 pt-6 md:pt-8 pb-10 md:pb-12"
        style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' }}>
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }} />
        <div className="absolute top-4 right-8 w-48 h-48 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent)', filter: 'blur(30px)' }} />
        <div className="relative">
          <p className="text-indigo-400 text-sm font-medium mb-1">{greeting},</p>
          <h1 className="text-3xl font-bold text-white">
            {user?.first_name || user?.username} 👋
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Here's what's happening with your tasks today.</p>
        </div>
      </div>

      <div className="px-4 md:px-8 -mt-6 pb-8 space-y-4 md:space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            {
              label: 'Total Tasks', value: stats.total, icon: TrendingUp,
              from: '#6366f1', to: '#8b5cf6', shadow: 'shadow-indigo-500/30'
            },
            {
              label: 'To Do', value: stats.todo, icon: Circle,
              from: '#64748b', to: '#475569', shadow: 'shadow-slate-500/20'
            },
            {
              label: 'In Progress', value: stats.inProgress, icon: Clock,
              from: '#3b82f6', to: '#06b6d4', shadow: 'shadow-blue-500/30'
            },
            {
              label: 'Completed', value: stats.done, icon: CheckCircle2,
              from: '#10b981', to: '#059669', shadow: 'shadow-green-500/30'
            },
          ].map(({ label, value, icon: Icon, from, to, shadow }) => (
            <div
              key={label}
              className={`stat-card rounded-2xl p-5 text-white shadow-lg ${shadow}`}
              style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Icon size={20} className="text-white" />
                </div>
                <span className="text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full">
                  {stats.total > 0 ? Math.round((value / stats.total) * 100) : 0}%
                </span>
              </div>
              <p className="text-3xl font-bold">{value}</p>
              <p className="text-sm text-white/70 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        {stats.total > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold text-slate-900">Overall Progress</p>
                <p className="text-xs text-slate-400 mt-0.5">{stats.done} of {stats.total} tasks completed</p>
              </div>
              <span className="text-2xl font-bold text-indigo-600">{donePercent}%</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${donePercent}%`,
                  background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)',
                }}
              />
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-300" />{stats.todo} to do</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-400" />{stats.inProgress} in progress</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-400" />{stats.done} done</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* Recent tasks */}
          <div className="col-span-1 md:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
              <div>
                <h2 className="font-semibold text-slate-900">Recent Tasks</h2>
                <p className="text-xs text-slate-400 mt-0.5">Latest activity</p>
              </div>
              <Link
                to="/tasks"
                className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 px-3 py-1.5 rounded-lg"
              >
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <div className="divide-y divide-slate-50">
              {tasks.slice(0, 7).map((task) => (
                <div key={task.id} className="px-6 py-3.5 flex items-center gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    task.status === 'done' ? 'bg-green-400' :
                    task.status === 'in_progress' ? 'bg-blue-400' : 'bg-slate-300'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${task.status === 'done' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {task.title}
                    </p>
                    {task.project_name && (
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                        <FolderKanban size={10} /> {task.project_name}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <PriorityBadge priority={task.priority} />
                    <StatusBadge status={task.status} />
                  </div>
                </div>
              ))}
              {tasks.length === 0 && (
                <div className="py-16 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 size={22} className="text-indigo-400" />
                  </div>
                  <p className="text-slate-400 text-sm">No tasks yet.</p>
                  <Link to="/tasks" className="mt-2 inline-block text-indigo-600 text-sm font-medium hover:underline">
                    Create your first task →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Projects */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
              <div>
                <h2 className="font-semibold text-slate-900">Projects</h2>
                <p className="text-xs text-slate-400 mt-0.5">{projects.length} active</p>
              </div>
              <Link to="/projects" className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg">
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <div className="divide-y divide-slate-50">
              {projects.slice(0, 7).map((project, i) => {
                const colors = ['from-indigo-500 to-purple-500', 'from-blue-500 to-cyan-500', 'from-emerald-500 to-teal-500', 'from-orange-500 to-amber-500']
                return (
                  <div key={project.id} className="px-6 py-3.5 flex items-center gap-3 hover:bg-slate-50/50 transition-colors">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colors[i % colors.length]} flex items-center justify-center shrink-0`}>
                      <FolderKanban size={14} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{project.name}</p>
                      <p className="text-xs text-slate-400">{project.task_count} task{project.task_count !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                )
              })}
              {projects.length === 0 && (
                <div className="py-16 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-3">
                    <FolderKanban size={22} className="text-indigo-400" />
                  </div>
                  <p className="text-slate-400 text-sm">No projects yet.</p>
                  <Link to="/projects" className="mt-2 inline-block text-indigo-600 text-sm font-medium hover:underline">
                    Create a project →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
