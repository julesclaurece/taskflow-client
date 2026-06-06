import { useEffect, useState } from 'react'
import { Plus, FolderKanban, Trash2, X } from 'lucide-react'
import { api } from '../lib/api'
import type { Project, PaginatedResponse } from '../lib/types'

interface ProjectModalProps {
  onClose: () => void
  onSaved: () => void
}

function ProjectModal({ onClose, onSaved }: ProjectModalProps) {
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">New Project</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
            <input
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Project name"
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
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900">Cancel</button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? 'Creating...' : 'Create project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  const fetchProjects = async () => {
    setLoading(true)
    const { data } = await api.get<PaginatedResponse<Project>>('/projects/')
    setProjects(data.results)
    setLoading(false)
  }

  useEffect(() => { fetchProjects() }, [])

  const deleteProject = async (id: number) => {
    if (!confirm('Delete this project and all its tasks?')) return
    await api.delete(`/projects/${id}/`)
    fetchProjects()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
          <p className="text-slate-500 text-sm mt-0.5">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus size={16} /> New Project
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-indigo-600" />
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
          <FolderKanban size={40} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">No projects yet.</p>
          <button onClick={() => setModalOpen(true)} className="mt-3 text-indigo-600 text-sm font-medium hover:underline">
            Create your first project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {projects.map(project => (
            <div key={project.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <FolderKanban size={20} className="text-indigo-600" />
                </div>
                <button
                  onClick={() => deleteProject(project.id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 rounded transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
              <h3 className="font-semibold text-slate-900 truncate">{project.name}</h3>
              {project.description && (
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">{project.description}</p>
              )}
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  <span className="font-semibold text-slate-900">{project.task_count}</span> task{project.task_count !== 1 ? 's' : ''}
                </span>
                <span className="text-xs text-slate-400">
                  {new Date(project.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <ProjectModal onClose={() => setModalOpen(false)} onSaved={fetchProjects} />
      )}
    </div>
  )
}
