import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export interface DashboardStats {
  visitors_today: number
  active_visitors: number
  pending_approvals: number
  overstay_alerts: number
}

export interface TrendItem {
  date: string
  count: number
}

export interface PurposeItem {
  purpose: string
  count: number
}

export interface Visitor {
  id: string
  name: string
  company?: string
  host?: string
  purpose: string
  check_in_time?: string
  check_out_time?: string
  status: string
  badge?: string
  scheduled_time?: string
  created_at: string
}

export interface PaginatedVisitors {
  items: Visitor[]
  total: number
  page: number
  limit: number
}

export interface CreateVisitorPayload {
  name: string
  company?: string
  host_id?: string
  purpose: string
  scheduled_time?: string
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const { data } = await api.get<DashboardStats>('/dashboard/stats')
    return data
  },

  async getTrends(days: number = 7): Promise<TrendItem[]> {
    const { data } = await api.get<TrendItem[]>(`/dashboard/trends?days=${days}`)
    return data
  },

  async getPurposes(): Promise<PurposeItem[]> {
    const { data } = await api.get<PurposeItem[]>('/dashboard/purposes')
    return data
  },

  async getVisitors(page: number = 1, limit: number = 10, status?: string, search?: string): Promise<PaginatedVisitors> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (status) params.append('status', status)
    if (search) params.append('search', search)
    const { data } = await api.get<PaginatedVisitors>(`/visitors?${params}`)
    return data
  },

  async createVisitor(payload: CreateVisitorPayload): Promise<Visitor> {
    const { data } = await api.post<Visitor>('/visitors', payload)
    return data
  },

  async checkIn(id: string): Promise<Visitor> {
    const { data } = await api.post<Visitor>(`/visitors/${id}/checkin`)
    return data
  },

  async checkOut(id: string): Promise<Visitor> {
    const { data } = await api.post<Visitor>(`/visitors/${id}/checkout`)
    return data
  },

  async search(q: string): Promise<Visitor[]> {
    const { data } = await api.get<{ results: Visitor[] }>(`/search?q=${encodeURIComponent(q)}`)
    return data.results
  },
}
