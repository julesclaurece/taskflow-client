import { create } from 'zustand'
import { api } from '../lib/api'
import type { User } from '../lib/types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  fetchMe: () => Promise<void>
}

interface RegisterData {
  username: string
  email: string
  password: string
  first_name: string
  last_name: string
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem('access_token'),

  login: async (username, password) => {
    const { data } = await api.post('/auth/login/', { username, password })
    localStorage.setItem('access_token', data.access)
    localStorage.setItem('refresh_token', data.refresh)
    const me = await api.get('/auth/me/')
    set({ user: me.data, isAuthenticated: true })
  },

  register: async (formData) => {
    const { data } = await api.post('/auth/register/', formData)
    localStorage.setItem('access_token', data.tokens.access)
    localStorage.setItem('refresh_token', data.tokens.refresh)
    set({ user: data.user, isAuthenticated: true })
  },

  logout: () => {
    localStorage.clear()
    set({ user: null, isAuthenticated: false })
  },

  fetchMe: async () => {
    try {
      const { data } = await api.get('/auth/me/')
      set({ user: data, isAuthenticated: true })
    } catch {
      localStorage.clear()
      set({ user: null, isAuthenticated: false })
    }
  },
}))
