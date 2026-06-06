import { useEffect, useState } from 'react'
import { Plus, Search, Trash2, Pencil, X, Check, SlidersHorizontal, LayoutList, Columns3 } from 'lucide-react'
import { api } from '../lib/api'
import type { Task, Project, PaginatedResponse, TaskFilters, TaskStatus, TaskPriority } from '../lib/types'
import { StatusBadge, PriorityBadge } from '../components/ui/Badge'

const STATUSES: TaskStatus[] = ['todo', 'in_progress', 'done']
const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high']

const COLUMNS: { status: TaskStatus; label: string; color: string; bg: string; dot: string }[] = [
  { status: 'todo', label: 'To Do', color: 'text-slate-600', bg: 'bg-slate-50 border-slate-200', dot: 'bg-slate-400' },
  { status: 'in_progress', label: 'In Progress', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', dot: 'bg-blue-500' },
  { status: 'done', label: 'Done', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
]

interface TaskModalProps {
  task?: Task
  projects: Project[]
  defaultStatus?: TaskStatus
  onClose: () => void
  onSaved: () => void
}

function TaskModal({ task, projects, defaultStatus = 'todo', onClose, onSaved }: TaskModalProps) {
  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || defaultStatus,
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h2 className="font-semibold text-slate-900">{task ? 'Edit Task' : 'New Task'}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{task ? 'Update task details' : 'Add a new task to your workflow'}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Title *</label>
            <input
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              required
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
              placeholder="e.g. Design landing page hero section"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none bg-slate-50 focus:bg-white"
              placeholder="Optional description..."
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as TaskStatus }))}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-all">
                {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Priority</label>
              <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as TaskPriority }))}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-all">
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Project</label>
              <select value={form.project_id} onChange={e => setForm(f => ({ ...f, project_id: e.target.value }))}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-all">
                <option value="">No project</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Due date</label>
              <input type="date" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-all" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-all">Cancel</button>
            <button type="submit" disabled={loading}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm rounded-xl hover:from-indigo-500 hover:to-purple-500 disabled:opacity-60 shadow-lg shadow-indigo-500/25 transition-all font-medium">
              {loading ? 'Saving...' : task ? 'Save changes' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Kanban Card ────────────────────────────────────────────────────────────
function KanbanCard({ task, onEdit, onDelete, onStatusChange }: {
  task: Task
  onEdit: () => void
  onDelete: () => void
  onStatusChange: () => void
}) {
  const priorityAccent: Record<TaskPriority, string> = {
    low: 'border-l-slate-300',
    medium: 'border-l-amber-400',
    high: 'border-l-red-500',
  }

  return (
    <div className={`bg-white rounded-xl border border-slate-200 border-l-4 ${priorityAccent[task.priority]} p-4 shadow-sm hover:shadow-md transition-all group cursor-default`}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <p className={`text-sm font-medium leading-snug flex-1 ${task.status === 'done' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
          {task.title}
        </p>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button onClick={onEdit} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all">
            <Pencil size={12} />
          </button>
          <button onClick={onDelete} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all">
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-xs text-slate-400 mb-3 line-clamp-2 leading-relaxed">{task.description}</p>
      )}

      <div className="flex items-center gap-2 flex-wrap mb-3">
        <PriorityBadge priority={task.priority} />
        {task.project_name && (
          <span className="text-[11px] bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded-full font-medium">
            {task.project_name}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        {task.due_date ? (
          <span className="text-[11px] text-slate-400">📅 {task.due_date}</span>
        ) : <span />}
        <button
          onClick={onStatusChange}
          title="Advance status"
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            task.status === 'done'
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : task.status === 'in_progress'
              ? 'border-blue-400 bg-blue-50'
              : 'border-slate-300 hover:border-indigo-400'
          }`}
        >
          {task.status === 'done' && <Check size={11} />}
          {task.status === 'in_progress' && <span className="w-2 h-2 rounded-full bg-blue-400" />}
        </button>
      </div>
    </div>
  )
}

// ─── Kanban View ────────────────────────────────────────────────────────────
function KanbanView({ tasks, onEdit, onDelete, onStatusChange, onAddInColumn }: {
  tasks: Task[]
  onEdit: (t: Task) => void
  onDelete: (id: number) => void
  onStatusChange: (t: Task) => void
  onAddInColumn: (status: TaskStatus) => void
}) {
  return (
    <div className="grid grid-cols-3 gap-5">
      {COLUMNS.map(col => {
        const colTasks = tasks.filter(t => t.status === col.status)
        return (
          <div key={col.status} className="flex flex-col gap-3">
            {/* Column header */}
            <div className={`flex items-center justify-between px-4 py-3 rounded-xl border ${col.bg}`}>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
                <span className={`text-sm font-semibold ${col.color}`}>{col.label}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white/70 ${col.color}`}>
                  {colTasks.length}
                </span>
              </div>
              <button
                onClick={() => onAddInColumn(col.status)}
                className={`w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/60 transition-all ${col.color}`}
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-3 min-h-24">
              {colTasks.map(task => (
                <KanbanCard
                  key={task.id}
                  task={task}
                  onEdit={() => onEdit(task)}
                  onDelete={() => onDelete(task.id)}
                  onStatusChange={() => onStatusChange(task)}
                />
              ))}
              {colTasks.length === 0 && (
                <div
                  onClick={() => onAddInColumn(col.status)}
                  className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center text-slate-300 text-xs cursor-pointer hover:border-indigo-300 hover:text-indigo-400 transition-all"
                >
                  + Add task
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── List View ──────────────────────────────────────────────────────────────
function ListView({ tasks, loading, onEdit, onDelete, onStatusChange, page, totalPages, onPageChange }: {
  tasks: Task[]
  loading: boolean
  onEdit: (t: Task) => void
  onDelete: (id: number) => void
  onStatusChange: (t: Task) => void
  page: number
  totalPages: number
  onPageChange: (_p: number) => void
}) {
  if (loading) return <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" /></div>
  if (tasks.length === 0) return (
    <div className="py-16 text-center">
      <p className="text-slate-400 text-sm font-medium">No tasks found</p>
      <p className="text-slate-300 text-xs mt-1">Try adjusting your filters</p>
    </div>
  )

  return (
    <>
      <div className="divide-y divide-slate-50">
        {tasks.map(task => (
          <div key={task.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/70 transition-colors group">
            <button
              onClick={() => onStatusChange(task)}
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                task.status === 'done' ? 'bg-emerald-500 border-emerald-500 text-white'
                : task.status === 'in_progress' ? 'border-blue-400 bg-blue-50'
                : 'border-slate-300 hover:border-indigo-400'
              }`}
            >
              {task.status === 'done' && <Check size={11} />}
              {task.status === 'in_progress' && <span className="w-2 h-2 rounded-full bg-blue-400" />}
            </button>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${task.status === 'done' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                {task.title}
              </p>
              <div className="flex items-center gap-3 mt-0.5">
                {task.project_name && <span className="text-xs text-slate-400 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-indigo-300" /> {task.project_name}</span>}
                {task.due_date && <span className="text-xs text-slate-400">Due {task.due_date}</span>}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <PriorityBadge priority={task.priority} />
              <StatusBadge status={task.status} />
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                <button onClick={() => onEdit(task)} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><Pencil size={13} /></button>
                <button onClick={() => onDelete(task.id)} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={13} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-4 border-t border-slate-50">
          <p className="text-xs text-slate-400">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button onClick={() => onPageChange(page - 1)} disabled={page === 1}
              className="px-4 py-1.5 text-xs font-medium border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-all">← Previous</button>
            <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages}
              className="px-4 py-1.5 text-xs font-medium border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-all">Next →</button>
          </div>
        </div>
      )}
    </>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [allTasks, setAllTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<TaskFilters>({})
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'list' | 'kanban'>('kanban')
  const [modal, setModal] = useState<{ open: boolean; task?: Task; defaultStatus?: TaskStatus }>({ open: false })

  const activeFiltersCount = Object.values(filters).filter(Boolean).length + (search ? 1 : 0)

  const fetchTasks = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (view === 'list') params.set('page', String(page))
    else params.set('page_size', '100')
    if (filters.status) params.set('status', filters.status)
    if (filters.priority) params.set('priority', filters.priority)
    if (filters.project) params.set('project', String(filters.project))
    if (search) params.set('search', search)
    const { data } = await api.get<PaginatedResponse<Task>>(`/tasks/?${params}`)
    setTasks(data.results)
    setAllTasks(data.results)
    setCount(data.count)
    setLoading(false)
  }

  useEffect(() => {
    api.get<PaginatedResponse<Project>>('/projects/').then(r => setProjects(r.data.results))
  }, [])

  useEffect(() => { fetchTasks() }, [filters, page, search, view])

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
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {count} task{count !== 1 ? 's' : ''}
            {activeFiltersCount > 0 && <span className="ml-1 text-indigo-500">· {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} active</span>}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setView('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${view === 'kanban' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Columns3 size={14} /> Kanban
            </button>
            <button
              onClick={() => setView('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${view === 'list' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <LayoutList size={14} /> List
            </button>
          </div>
          <button
            onClick={() => setModal({ open: true })}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 transition-all active:scale-[0.98]"
          >
            <Plus size={16} /> New Task
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2 md:gap-3 bg-white border border-slate-100 rounded-2xl px-3 md:px-4 py-3 shadow-sm mb-4 md:mb-5">
        <div className="flex items-center gap-2 text-slate-400">
          <SlidersHorizontal size={14} />
          <span className="text-xs font-medium text-slate-500">Filters</span>
        </div>
        <div className="h-4 w-px bg-slate-200" />
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-all"
            placeholder="Search tasks..." />
        </div>
        <select value={filters.status || ''} onChange={e => { setFilters(f => ({ ...f, status: e.target.value as TaskStatus || undefined })); setPage(1) }}
          className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-all">
          <option value="">All statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
        <select value={filters.priority || ''} onChange={e => { setFilters(f => ({ ...f, priority: e.target.value as TaskPriority || undefined })); setPage(1) }}
          className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-all">
          <option value="">All priorities</option>
          {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={filters.project || ''} onChange={e => { setFilters(f => ({ ...f, project: Number(e.target.value) || undefined })); setPage(1) }}
          className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-all">
          <option value="">All projects</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        {activeFiltersCount > 0 && (
          <button onClick={() => { setFilters({}); setSearch('') }}
            className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 px-3 py-2 rounded-xl hover:bg-red-50 transition-all">
            <X size={13} /> Clear
          </button>
        )}
      </div>

      {/* Content */}
      {view === 'kanban' ? (
        loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
          </div>
        ) : (
          <div className="overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
          <div className="min-w-[680px]">
          <KanbanView
            tasks={allTasks}
            onEdit={task => setModal({ open: true, task })}
            onDelete={deleteTask}
            onStatusChange={toggleStatus}
            onAddInColumn={status => setModal({ open: true, defaultStatus: status })}
          />
          </div>
          </div>
        )
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <ListView
            tasks={tasks}
            loading={loading}
            onEdit={task => setModal({ open: true, task })}
            onDelete={deleteTask}
            onStatusChange={toggleStatus}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      {modal.open && (
        <TaskModal
          task={modal.task}
          projects={projects}
          defaultStatus={modal.defaultStatus}
          onClose={() => setModal({ open: false })}
          onSaved={fetchTasks}
        />
      )}
    </div>
  )
}
