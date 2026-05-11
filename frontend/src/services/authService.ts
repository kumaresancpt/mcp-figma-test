import axios, { AxiosInstance } from 'axios'

const API_BASE_URL = '/api'

interface LoginResponse {
  accessToken: string
  refreshToken: string
  user?: {
    id: string
    username: string
    email: string
    role: string
  }
}

interface ErrorResponse {
  message: string
  statusCode: number
}

class AuthService {
  private apiClient: AxiosInstance

  constructor() {
    this.apiClient = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Add request interceptor to include token
    this.apiClient.interceptors.request.use((config) => {
      const token = localStorage.getItem('accessToken')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Add response interceptor to handle 401
    this.apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Try to refresh token
          const refreshToken = localStorage.getItem('refreshToken')
          if (refreshToken) {
            try {
              const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
                refreshToken,
              })
              const newAccessToken = refreshResponse.data.accessToken
              localStorage.setItem('accessToken', newAccessToken)
              // Retry original request
              error.config.headers.Authorization = `Bearer ${newAccessToken}`
              return this.apiClient(error.config)
            } catch {
              // Refresh failed, redirect to login
              localStorage.removeItem('accessToken')
              localStorage.removeItem('refreshToken')
              window.location.href = '/login'
            }
          }
        }
        throw error
      }
    )
  }

  /**
   * Login user with username, password, and role
   */
  async loginUser(
    username: string,
    password: string,
    role: string,
    keepLoggedIn: boolean
  ): Promise<LoginResponse> {
    try {
      const response = await this.apiClient.post<LoginResponse>('/auth/login', {
        username,
        password,
        role,
        keepLoggedIn,
      })
      return response.data
    } catch (error: any) {
      const statusCode = error.response?.status
      const detail = error.response?.data?.detail || 'Login failed'

      if (statusCode === 401) {
        throw new Error('Invalid username or password')
      } else if (statusCode === 403) {
        throw new Error('Role mismatch')
      } else if (statusCode === 423) {
        throw new Error('Account locked due to too many failed attempts. Try again later.')
      }

      throw new Error(detail)
    }
  }

  /**
   * Logout user
   */
  async logoutUser(): Promise<void> {
    try {
      await this.apiClient.post('/auth/logout')
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    } catch (error: any) {
      throw new Error(error?.response?.data?.detail || 'Logout failed')
    }
  }

  /**
   * Get current user information
   */
  async getCurrentUser(): Promise<any> {
    try {
      const response = await this.apiClient.get('/auth/me')
      return response.data
    } catch (error: any) {
      throw new Error(error?.response?.data?.detail || 'Failed to fetch user information')
    }
  }

  /**
   * Request password reset
   */
  async forgotPassword(usernameOrEmail: string): Promise<any> {
    try {
      const response = await this.apiClient.post('/auth/forgot-password', {
        username: usernameOrEmail.includes('@') ? undefined : usernameOrEmail,
        email: usernameOrEmail.includes('@') ? usernameOrEmail : undefined,
      })
      return response.data
    } catch (error: any) {
      throw new Error(error?.response?.data?.detail || 'Failed to send password reset email')
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(resetToken: string, newPassword: string): Promise<any> {
    try {
      const response = await this.apiClient.post('/auth/reset-password', {
        resetToken,
        newPassword,
      })
      return response.data
    } catch (error: any) {
      throw new Error(error?.response?.data?.detail || 'Failed to reset password')
    }
  }

  /**
   * Sign up new user (admin only)
   */
  async signUp(username: string, email: string, password: string, role: string): Promise<any> {
    try {
      const response = await this.apiClient.post('/auth/signup', {
        username,
        email,
        password,
        role,
      })
      return response.data
    } catch (error: any) {
      throw new Error(error?.response?.data?.detail || 'Failed to create user')
    }
  }
}

export default new AuthService()
