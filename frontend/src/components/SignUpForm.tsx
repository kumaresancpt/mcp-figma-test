import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8390A2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8390A2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8390A2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

const EyeOpenIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8390A2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8390A2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)

export default function SignUpForm() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')

    if (!name.trim()) { setError('Name is required'); return }
    if (!email.trim()) { setError('Email is required'); return }
    if (!phoneNumber.trim()) { setError('Phone number is required'); return }
    if (!password.trim()) { setError('Password is required'); return }
    if (password !== confirmPassword) { setError('Passwords do not match'); return }

    setIsLoading(true)
    try {
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phoneNumber, password, confirmPassword }),
      })

      if (response.status === 201 || response.ok) {
        setSuccessMessage('Account created successfully! Redirecting to login...')
        setTimeout(() => navigate('/login'), 1500)
      } else {
        const data = await response.json().catch(() => ({}))
        setError(data?.detail || data?.message || 'Registration failed. Please try again.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const inputWrapClass =
    'bg-white border border-[#B9B9B9] rounded-lg flex items-center px-3 h-12 w-[400px] focus-within:border-primary focus-within:ring-1 focus-within:ring-primary'
  const innerInputClass =
    'flex-1 font-inter font-normal text-sm text-[#292D32] bg-transparent border-none outline-none placeholder:text-[#8390A2]'
  const labelClass = 'font-inter font-normal text-sm text-[#3B3B3B]'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full items-center">
      {/* Success Banner */}
      {successMessage && (
        <div className="w-[400px] bg-green-50 border border-green-400 text-green-800 text-sm rounded-lg px-4 py-2">
          {successMessage}
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="w-[400px] bg-red-50 border border-red-400 text-red-800 text-sm rounded-lg px-4 py-2">
          {error}
        </div>
      )}

      {/* Name Field */}
      <div className="flex flex-col gap-2">
        <label className={labelClass}>Name</label>
        <div className={inputWrapClass}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className={innerInputClass}
          />
          <UserIcon />
        </div>
      </div>

      {/* Email Field */}
      <div className="flex flex-col gap-2">
        <label className={labelClass}>Email</label>
        <div className={inputWrapClass}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className={innerInputClass}
          />
          <MailIcon />
        </div>
      </div>

      {/* Phone Number Field */}
      <div className="flex flex-col gap-2">
        <label className={labelClass}>Phone Number</label>
        <div className={inputWrapClass}>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter your phone number"
            className={innerInputClass}
          />
          <PhoneIcon />
        </div>
      </div>

      {/* Password Field */}
      <div className="flex flex-col gap-2">
        <label className={labelClass}>Password</label>
        <div className={inputWrapClass}>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className={innerInputClass}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="flex-shrink-0 hover:opacity-75 transition-opacity"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOffIcon /> : <EyeOpenIcon />}
          </button>
        </div>
      </div>

      {/* Confirm Password Field */}
      <div className="flex flex-col gap-2">
        <label className={labelClass}>Confirm Password</label>
        <div className={inputWrapClass}>
          <input
            type={showConfirm ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Enter confirm password"
            className={innerInputClass}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="flex-shrink-0 hover:opacity-75 transition-opacity"
            aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
          >
            {showConfirm ? <EyeOffIcon /> : <EyeOpenIcon />}
          </button>
        </div>
      </div>

      {/* Create Account Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-[400px] h-12 bg-primary text-white font-inter font-semibold text-base rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </button>

      {/* Login Link */}
      <p className="font-inter font-normal text-sm text-[#474A5F]">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="font-bold text-primary underline hover:opacity-80 transition-opacity"
        >
          Log in
        </button>
      </p>
    </form>
  )
}
