export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  date_joined: string
}

export interface Project {
  id: number
  name: string
  description: string
  owner: User
  task_count: number
  created_at: string
  updated_at: string
}

export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: number
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  project: number | null
  project_name: string | null
  assignee: User | null
  owner: User
  due_date: string | null
  created_at: string
  updated_at: string
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface TaskFilters {
  status?: TaskStatus
  priority?: TaskPriority
  project?: number
  search?: string
  ordering?: string
}
