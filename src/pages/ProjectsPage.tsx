import { useEffect, useState } from 'react'
import { Plus, FolderKanban, Trash2, X, CheckCircle2, Clock, Circle, TrendingUp } from 'lucide-react'
import { api } from '../lib/api'
import type { Project, Task, PaginatedResponse } from '../lib/types'

interface TaskStats {
  todo: number
  in_progress: number
  done: number
  total: number
}

const gradients = [
  { from: '#6366f1', to: '#8b5cf6', cls: 'from-indigo-500 to-purple-600' },
  { from: '#3b82f6', to: '#06b6d4', cls: 'from-blue-500 to-cyan-500' },
  { from: '#10b981', to: '#14b8a6', cls: 'from-emerald-500 to-teal-500' },
  { from: '#f97316', to: '#f59e0b', cls: 'from-orange-500 to-amber-500' },
  { from: '#ec4899', to: '#f43f5e', cls: 'from-pink-500 to-rose-500' },
  { from: '#8b5cf6', to: '#6366f1', cls: 'from-violet-500 to-indigo-500' },
]

function ProjectModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ name: '', description: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/projects/', form)
      onSaved()
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h2 className="font-semibold text-slate-900">New Project</h2>
            <p className="text-xs text-slate-400 mt-0.5">Organize your tasks into a project</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Project name *</label>
            <input
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-all"
              placeholder="e.g. Client Website Redesign"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none bg-slate-50 focus:bg-white transition-all"
              placeholder="What is this project about?"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-all">Cancel</button>
            <button type="submit" disabled={loading}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm rounded-xl hover:from-indigo-500 hover:to-purple-500 disabled:opacity-60 shadow-lg shadow-indigo-500/25 transition-all font-medium">
              {loading ? 'Creating...' : 'Create project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ProjectCard({ project, stats, gradient, onDelete }: {
  project: Project
  stats: TaskStats
  gradient: typeof gradients[0]
  onDelete: () => void
}) {
  const percent = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all overflow-hidden group flex flex-col">
      {/* Top gradient band */}
      <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${gradient.from}, ${gradient.to})` }} />

      <div className="p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-md shrink-0"
              style={{ background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }}>
              <FolderKanban size={20} className="text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 truncate text-[15px] leading-tight">{project.name}</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
          <button
            onClick={onDelete}
            className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 shrink-0"
          >
            <Trash2 size={14} />
          </button>
        </div>

        {/* Description */}
        <p className={`text-sm leading-relaxed mb-4 flex-1 ${project.description ? 'text-slate-500' : 'text-slate-300 italic'}`}>
          {project.description || 'No description'}
        </p>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-400 font-medium">Progress</span>
            <span className="text-xs font-bold" style={{ color: gradient.from }}>{percent}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${percent}%`,
                background: `linear-gradient(90deg, ${gradient.from}, ${gradient.to})`,
              }}
            />
          </div>
        </div>

        {/* Task status breakdown */}
        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-50">
          {[
            { label: 'To Do', value: stats.todo, icon: Circle, color: 'text-slate-500', bg: 'bg-slate-50' },
            { label: 'In Progress', value: stats.in_progress, icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
            { label: 'Done', value: stats.done, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className={`${bg} rounded-xl p-2.5 text-center`}>
              <Icon size={14} className={`${color} mx-auto mb-1`} />
              <p className="text-base font-bold text-slate-800">{value}</p>
              <p className="text-[10px] text-slate-400 leading-tight">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [taskStats, setTaskStats] = useState<Record<number, TaskStats>>({})
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    const [projRes, taskRes] = await Promise.all([
      api.get<PaginatedResponse<Project>>('/projects/'),
      api.get<PaginatedResponse<Task>>('/tasks/?page_size=200'),
    ])
    setProjects(projRes.data.results)

    // Compute per-project stats from tasks
    const stats: Record<number, TaskStats> = {}
    for (const task of taskRes.data.results) {
      if (task.project === null) continue
      const pid = task.project as number
      if (!stats[pid]) stats[pid] = { todo: 0, in_progress: 0, done: 0, total: 0 }
      stats[pid][task.status]++
      stats[pid].total++
    }
    setTaskStats(stats)
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const deleteProject = async (id: number) => {
    if (!confirm('Delete this project and all its tasks?')) return
    await api.delete(`/projects/${id}/`)
    fetchData()
  }

  const totalTasks = projects.reduce((acc, p) => acc + p.task_count, 0)
  const totalDone = Object.values(taskStats).reduce((acc, s) => acc + s.done, 0)
  const globalPercent = totalTasks > 0 ? Math.round((totalDone / totalTasks) * 100) : 0

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="px-8 pt-8 pb-8 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
            <p className="text-slate-400 text-sm mt-0.5">{projects.length} project{projects.length !== 1 ? 's' : ''} · {totalTasks} tasks total</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 transition-all active:scale-[0.98]"
          >
            <Plus size={16} /> New Project
          </button>
        </div>
        {/* Global stats bar */}
        {projects.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center gap-6">
              {[
                { label: 'Projects', value: projects.length, icon: FolderKanban, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { label: 'Total Tasks', value: totalTasks, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Completed', value: totalDone, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>
                    <Icon size={17} className={color} />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-slate-900">{value}</p>
                    <p className="text-xs text-slate-400">{label}</p>
                  </div>
                </div>
              ))}
              <div className="flex-1 ml-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-slate-500 font-medium">Overall completion</span>
                  <span className="text-xs font-bold text-indigo-600">{globalPercent}%</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${globalPercent}%`,
                      background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mx-auto mb-4">
              <FolderKanban size={28} className="text-indigo-400" />
            </div>
            <p className="text-slate-700 font-medium">No projects yet</p>
            <p className="text-slate-400 text-sm mt-1">Create your first project to organize your tasks</p>
            <button
              onClick={() => setModalOpen(true)}
              className="mt-5 inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-purple-500 transition-all"
            >
              <Plus size={15} /> Create a project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-5">
            {projects.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                stats={taskStats[project.id] || { todo: 0, in_progress: 0, done: 0, total: 0 }}
                gradient={gradients[i % gradients.length]}
                onDelete={() => deleteProject(project.id)}
              />
            ))}
          </div>
        )}
      </div>

      {modalOpen && <ProjectModal onClose={() => setModalOpen(false)} onSaved={fetchData} />}
    </div>
  )
}
