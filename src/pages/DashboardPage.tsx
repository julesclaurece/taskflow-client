import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, Clock, AlertCircle, FolderKanban, ArrowRight } from 'lucide-react'
import { api } from '../lib/api'
import { useAuth } from '../store/auth'
import type { Task, Project, PaginatedResponse } from '../lib/types'
import { StatusBadge, PriorityBadge } from '../components/ui/Badge'

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Good day, {user?.first_name || user?.username} 👋
        </h1>
        <p className="text-slate-500 mt-1">Here's what's going on with your tasks.</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Tasks', value: stats.total, icon: CheckCircle, color: 'text-slate-600', bg: 'bg-slate-100' },
          { label: 'To Do', value: stats.todo, icon: AlertCircle, color: 'text-slate-600', bg: 'bg-slate-100' },
          { label: 'In Progress', value: stats.inProgress, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Done', value: stats.done, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center mb-3`}>
              <Icon size={20} className={color} />
            </div>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-sm text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Recent Tasks</h2>
            <Link to="/tasks" className="text-sm text-indigo-600 hover:underline flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {tasks.slice(0, 6).map((task) => (
              <div key={task.id} className="px-6 py-3.5 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{task.title}</p>
                  {task.project_name && (
                    <p className="text-xs text-slate-400 mt-0.5">{task.project_name}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <PriorityBadge priority={task.priority} />
                  <StatusBadge status={task.status} />
                </div>
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="px-6 py-10 text-center text-slate-400 text-sm">
                No tasks yet.{' '}
                <Link to="/tasks" className="text-indigo-600 hover:underline">Create your first task</Link>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Projects</h2>
            <Link to="/projects" className="text-sm text-indigo-600 hover:underline flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {projects.slice(0, 6).map((project) => (
              <div key={project.id} className="px-6 py-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                  <FolderKanban size={16} className="text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{project.name}</p>
                  <p className="text-xs text-slate-400">{project.task_count} tasks</p>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <div className="px-6 py-10 text-center text-slate-400 text-sm">
                No projects yet.{' '}
                <Link to="/projects" className="text-indigo-600 hover:underline">Create one</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
