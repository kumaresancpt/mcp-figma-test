import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../services/authService'

interface LoginFormProps {
  selectedRole: 'Admin' | 'Receptionist' | 'Security Guard'
}

const userIcon = 'https://www.figma.com/api/mcp/asset/ec25164a-34c4-43f5-bcb4-8499e9556225'
const eyeIcon = 'https://www.figma.com/api/mcp/asset/c60c92a2-2c1e-478e-9848-8bf889f4340f'

export default function LoginForm({ selectedRole }: LoginFormProps) {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [keepLoggedIn, setKeepLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [apiError, setApiError] = useState('')

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMessage('')
    setApiError('')

    // Validation
    if (!username.trim()) {
      setApiError('Username is required')
      return
    }

    if (!password.trim()) {
      setApiError('Password is required')
      return
    }

    setIsLoading(true)

    try {
      // Convert role to backend format (Admin -> ROLE_ADMIN)
      const roleMap: { [key: string]: string } = {
        'Admin': 'ROLE_ADMIN',
        'Receptionist': 'ROLE_RECEPTIONIST',
        'Security Guard': 'ROLE_SECURITY_GUARD'
      }
      const backendRole = roleMap[selectedRole] || selectedRole

      const response = await authService.loginUser(username, password, backendRole, keepLoggedIn)
      
      // Store tokens
      if (response.accessToken) {
        localStorage.setItem('accessToken', response.accessToken)
      }
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken)
      }
      
      setSuccessMessage('Login successful! Redirecting...')
      
      // Clear form
      setUsername('')
      setPassword('')
      setKeepLoggedIn(false)
      
      // Redirect after a brief delay
      setTimeout(() => {
        navigate('/dashboard')
      }, 1500)
    } catch (error: any) {
      const errorMessage = error?.message || 'Login failed. Please try again.'
      setApiError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleLoginSubmit} className="flex flex-col gap-7.5 w-full" data-node-id="3:103">
      {/* Username Field */}
      <div className="flex flex-col gap-2 h-auto w-full" data-node-id="3:104">
        <label className="form-label" data-node-id="3:105">
          Username
        </label>
        <div
          className="bg-white border border-input-border rounded-input flex items-center px-3 py-3 h-12 w-full focus-within:border-primary focus-within:ring-1 focus-within:ring-primary"
          data-node-id="3:106"
        >
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ex., john@123"
            className="flex-1 font-inter font-normal text-sm leading-6 text-input-text bg-transparent border-none outline-none placeholder:text-input-text"
            data-node-id="3:109"
          />
          <img alt="user icon" src={userIcon} className="w-6 h-6 flex-shrink-0" data-node-id="3:110" />
        </div>
      </div>

      {/* Password and Keep Logged In */}
      <div className="flex flex-col gap-2 w-full">
        {/* Password Field */}
        <div className="flex flex-col gap-2 w-full" data-node-id="3:116">
          <label className="form-label" data-node-id="3:117">
            Password
          </label>
          <div
            className="bg-white border border-input-border rounded-input flex items-center px-3 py-3 h-12 w-full focus-within:border-primary focus-within:ring-1 focus-within:ring-primary"
            data-node-id="3:118"
          >
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Please Enter"
              className="flex-1 font-inter font-normal text-sm leading-6 text-input-text bg-transparent border-none outline-none placeholder:text-input-text"
              data-node-id="3:121"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="flex-shrink-0 hover:opacity-75 transition-opacity"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <img alt="toggle password" src={eyeIcon} className="w-6 h-6" data-node-id="3:122" />
            </button>
          </div>
        </div>

        {/* Keep Me Logged In & Forgot Password */}
        <div className="flex items-center justify-between w-full mt-3">
          <div className="flex items-center gap-1.5">
            <input
              type="checkbox"
              id="keepLoggedIn"
              checked={keepLoggedIn}
              onChange={(e) => setKeepLoggedIn(e.target.checked)}
              className="w-4 h-4 border-2 border-dark-text rounded cursor-pointer"
              data-node-id="3:115"
            />
            <label htmlFor="keepLoggedIn" className="font-inter font-normal text-sm leading-normal text-input-label cursor-pointer">
              Keep me logged In
            </label>
          </div>
          <a
            onClick={() => navigate('/forgot-password')}
            className="forgot-password-link cursor-pointer"
            data-node-id="3:112"
          >
            Forgot Password?
          </a>
        </div>
      </div>

      {/* Error Message */}
      {apiError && (
        <div className="error-message" role="alert">
          {apiError}
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="success-message" role="status">
          {successMessage}
        </div>
      )}

      {/* Login Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        data-node-id="3:125"
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>

      {/* Sign Up Link */}
      <p className="font-inter font-normal text-base leading-normal text-secondary text-center w-full" data-node-id="3:127">
        <span>Don't have an account? </span>
        <button
          type="button"
          onClick={() => navigate('/signup')}
          className="signup-link bg-none border-none p-0 cursor-pointer"
        >
          Sign up
        </button>
      </p>
    </form>
  )
}
