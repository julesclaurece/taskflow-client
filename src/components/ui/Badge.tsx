import type { TaskStatus, TaskPriority } from '../../lib/types'

const statusStyles: Record<TaskStatus, string> = {
  todo: 'bg-slate-100 text-slate-600 border border-slate-200',
  in_progress: 'bg-blue-50 text-blue-700 border border-blue-200',
  done: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
}

const statusLabels: Record<TaskStatus, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
}

const priorityStyles: Record<TaskPriority, string> = {
  low: 'bg-slate-50 text-slate-500 border border-slate-200',
  medium: 'bg-amber-50 text-amber-700 border border-amber-200',
  high: 'bg-red-50 text-red-700 border border-red-200',
}

const priorityDot: Record<TaskPriority, string> = {
  low: 'bg-slate-400',
  medium: 'bg-amber-500',
  high: 'bg-red-500',
}

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}>
      {statusLabels[status]}
    </span>
  )
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${priorityStyles[priority]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${priorityDot[priority]}`} />
      {priority}
    </span>
  )
}
