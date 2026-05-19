import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import SignUpForm from '../components/SignUpForm'
import SignUpPage from '../components/SignUpPage'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}))

afterEach(() => {
  jest.clearAllMocks()
})

// Test 1 (AC3): Renders "Sign up" heading and "Create an account to get started" subtitle from SignUpPage
test('renders "Sign up" heading and "Create an account to get started" subtitle', () => {
  render(
    <MemoryRouter>
      <SignUpPage />
    </MemoryRouter>
  )
  expect(screen.getByRole('heading', { name: /Sign up/i })).toBeInTheDocument()
  expect(screen.getByText(/Create an account to get started/i)).toBeInTheDocument()
})

// Test 2 (AC4–AC8): Renders all 5 input fields with correct placeholders
test('renders all 5 input fields with correct placeholders', () => {
  render(
    <MemoryRouter>
      <SignUpForm />
    </MemoryRouter>
  )
  expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument()
  expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
  expect(screen.getByPlaceholderText('Enter your phone number')).toBeInTheDocument()
  expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument()
  expect(screen.getByPlaceholderText('Enter confirm password')).toBeInTheDocument()
})

// Test 3 (AC7): Password field toggles visibility on eye icon click
test('toggles password field type to text when Show password button is clicked', () => {
  render(
    <MemoryRouter>
      <SignUpForm />
    </MemoryRouter>
  )
  const passwordInput = screen.getByPlaceholderText('Enter password')
  expect(passwordInput).toHaveAttribute('type', 'password')
  const showPasswordBtn = screen.getByRole('button', { name: 'Show password' })
  fireEvent.click(showPasswordBtn)
  expect(passwordInput).toHaveAttribute('type', 'text')
})

// Test 4 (AC9, AC12): Submits form with correct payload to POST /api/v1/auth/register
test('submits form with correct payload to POST /api/v1/auth/register', async () => {
  ;(global as any).fetch = jest.fn().mockResolvedValue({
    status: 201,
    ok: true,
    json: async () => ({ message: 'Account created successfully' }),
  })

  render(
    <MemoryRouter>
      <SignUpForm />
    </MemoryRouter>
  )

  fireEvent.change(screen.getByPlaceholderText('Enter your name'), { target: { value: 'Test User' } })
  fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'test@example.com' } })
  fireEvent.change(screen.getByPlaceholderText('Enter your phone number'), { target: { value: '1234567890' } })
  fireEvent.change(screen.getByPlaceholderText('Enter password'), { target: { value: 'Password123' } })
  fireEvent.change(screen.getByPlaceholderText('Enter confirm password'), { target: { value: 'Password123' } })

  fireEvent.click(screen.getByRole('button', { name: /Create Account/i }))

  await waitFor(() => {
    expect((global as any).fetch).toHaveBeenCalledWith(
      '/api/v1/auth/register',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          phoneNumber: '1234567890',
          password: 'Password123',
          confirmPassword: 'Password123',
        }),
      })
    )
  })
})

// Test 5 (AC14): Shows error message when API returns 400
test('shows error message when API returns 400 with detail field', async () => {
  ;(global as any).fetch = jest.fn().mockResolvedValue({
    status: 400,
    ok: false,
    json: async () => ({ detail: 'Email already registered' }),
  })

  render(
    <MemoryRouter>
      <SignUpForm />
    </MemoryRouter>
  )

  fireEvent.change(screen.getByPlaceholderText('Enter your name'), { target: { value: 'Test User' } })
  fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'test@example.com' } })
  fireEvent.change(screen.getByPlaceholderText('Enter your phone number'), { target: { value: '1234567890' } })
  fireEvent.change(screen.getByPlaceholderText('Enter password'), { target: { value: 'Password123' } })
  fireEvent.change(screen.getByPlaceholderText('Enter confirm password'), { target: { value: 'Password123' } })

  fireEvent.click(screen.getByRole('button', { name: /Create Account/i }))

  await waitFor(() => {
    expect(screen.getByText('Email already registered')).toBeInTheDocument()
  })
})

// Test 6 (AC10): Renders "Log in" button for navigation to /login
test('renders "Log in" button for navigation to /login', () => {
  render(
    <MemoryRouter>
      <SignUpForm />
    </MemoryRouter>
  )
  expect(screen.getByRole('button', { name: /Log in/i })).toBeInTheDocument()
})
