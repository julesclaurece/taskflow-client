import { useEffect, useState } from 'react'
import { Plus, Search, Trash2, Pencil, X, Check } from 'lucide-react'
import { api } from '../lib/api'
import type { Task, Project, PaginatedResponse, TaskFilters, TaskStatus, TaskPriority } from '../lib/types'
import { StatusBadge, PriorityBadge } from '../components/ui/Badge'

const STATUSES: TaskStatus[] = ['todo', 'in_progress', 'done']
const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high']

interface TaskModalProps {
  task?: Task
  projects: Project[]
  onClose: () => void
  onSaved: () => void
}

function TaskModal({ task, projects, onClose, onSaved }: TaskModalProps) {
  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'todo',
    priority: task?.priority || 'medium',
    project_id: task?.project || '',
    due_date: task?.due_date || '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = { ...form, project_id: form.project_id || null, due_date: form.due_date || null }
      if (task) await api.put(`/tasks/${task.id}/`, payload)
      else await api.post('/tasks/', payload)
      onSaved()
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">{task ? 'Edit Task' : 'New Task'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
            <input
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Task title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="Optional description"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value as TaskStatus }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
              <select
                value={form.priority}
                onChange={e => setForm(f => ({ ...f, priority: e.target.value as TaskPriority }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Project</label>
              <select
                value={form.project_id}
                onChange={e => setForm(f => ({ ...f, project_id: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">No project</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Due date</label>
              <input
                type="date"
                value={form.due_date}
                onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900">Cancel</button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? 'Saving...' : task ? 'Save changes' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<TaskFilters>({})
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<{ open: boolean; task?: Task }>({ open: false })

  const fetchTasks = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    params.set('page', String(page))
    if (filters.status) params.set('status', filters.status)
    if (filters.priority) params.set('priority', filters.priority)
    if (filters.project) params.set('project', String(filters.project))
    if (search) params.set('search', search)
    const { data } = await api.get<PaginatedResponse<Task>>(`/tasks/?${params}`)
    setTasks(data.results)
    setCount(data.count)
    setLoading(false)
  }

  useEffect(() => {
    api.get<PaginatedResponse<Project>>('/projects/').then(r => setProjects(r.data.results))
  }, [])

  useEffect(() => { fetchTasks() }, [filters, page, search])

  const deleteTask = async (id: number) => {
    if (!confirm('Delete this task?')) return
    await api.delete(`/tasks/${id}/`)
    fetchTasks()
  }

  const toggleStatus = async (task: Task) => {
    const next: Record<string, TaskStatus> = { todo: 'in_progress', in_progress: 'done', done: 'todo' }
    await api.patch(`/tasks/${task.id}/`, { status: next[task.status] })
    fetchTasks()
  }

  const totalPages = Math.ceil(count / 10)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
          <p className="text-slate-500 text-sm mt-0.5">{count} task{count !== 1 ? 's' : ''} total</p>
        </div>
        <button
          onClick={() => setModal({ open: true })}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus size={16} /> New Task
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 mb-4">
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-slate-100">
          <div className="relative flex-1 min-w-48">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Search tasks..."
            />
          </div>
          <select
            value={filters.status || ''}
            onChange={e => { setFilters(f => ({ ...f, status: e.target.value as TaskStatus || undefined })); setPage(1) }}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>
          <select
            value={filters.priority || ''}
            onChange={e => { setFilters(f => ({ ...f, priority: e.target.value as TaskPriority || undefined })); setPage(1) }}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All priorities</option>
            {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select
            value={filters.project || ''}
            onChange={e => { setFilters(f => ({ ...f, project: Number(e.target.value) || undefined })); setPage(1) }}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All projects</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-indigo-600" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">No tasks found.</div>
        ) : (
          <div className="divide-y divide-slate-50">
            {tasks.map(task => (
              <div key={task.id} className="flex items-center gap-4 px-4 py-3.5 hover:bg-slate-50 transition-colors">
                <button
                  onClick={() => toggleStatus(task)}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    task.status === 'done'
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-slate-300 hover:border-indigo-400'
                  }`}
                >
                  {task.status === 'done' && <Check size={11} />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${task.status === 'done' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {task.project_name && <span className="text-xs text-slate-400">{task.project_name}</span>}
                    {task.due_date && <span className="text-xs text-slate-400">Due {task.due_date}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <PriorityBadge priority={task.priority} />
                  <StatusBadge status={task.status} />
                  <button onClick={() => setModal({ open: true, task })} className="p-1.5 text-slate-400 hover:text-indigo-600 rounded">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => deleteTask(task.id)} className="p-1.5 text-slate-400 hover:text-red-500 rounded">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
            <p className="text-sm text-slate-500">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => p - 1)}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50"
              >Previous</button>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50"
              >Next</button>
            </div>
          </div>
        )}
      </div>

      {modal.open && (
        <TaskModal
          task={modal.task}
          projects={projects}
          onClose={() => setModal({ open: false })}
          onSaved={fetchTasks}
        />
      )}
    </div>
  )
}
