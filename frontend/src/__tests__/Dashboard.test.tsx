import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Dashboard from '../components/dashboard/Dashboard'
import { dashboardService } from '../services/dashboardService'

jest.mock('../services/dashboardService', () => ({
  dashboardService: {
    getStats: jest.fn(),
    getTrends: jest.fn(),
    getPurposes: jest.fn(),
    getVisitors: jest.fn(),
    createVisitor: jest.fn(),
    checkIn: jest.fn(),
    checkOut: jest.fn(),
    search: jest.fn(),
  },
}))

const mockStats = { visitors_today: 12, active_visitors: 5, pending_approvals: 2, overstay_alerts: 1 }
const mockTrends = [{ date: 'Jan 01', count: 4 }, { date: 'Jan 02', count: 7 }]
const mockPurposes = [{ purpose: 'Meeting', count: 10 }, { purpose: 'Delivery', count: 5 }]
const mockVisitors = {
  items: [
    { id: '1', name: 'Alice Smith', company: 'Acme', host: 'John Doe', purpose: 'Meeting', status: 'waiting', created_at: new Date().toISOString() },
  ],
  total: 1,
  page: 1,
  limit: 10,
}

beforeEach(() => {
  jest.clearAllMocks()
  ;(dashboardService.getStats as jest.Mock).mockResolvedValue(mockStats)
  ;(dashboardService.getTrends as jest.Mock).mockResolvedValue(mockTrends)
  ;(dashboardService.getPurposes as jest.Mock).mockResolvedValue(mockPurposes)
  ;(dashboardService.getVisitors as jest.Mock).mockResolvedValue(mockVisitors)
})

function renderDashboard() {
  return render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>
  )
}

test('renders dashboard heading', async () => {
  renderDashboard()
  expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
})

test('displays KPI stats after loading', async () => {
  renderDashboard()
  await waitFor(() => {
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })
})

test('renders recent visitors table with visitor data', async () => {
  renderDashboard()
  await waitFor(() => {
    expect(screen.getByText('Alice Smith')).toBeInTheDocument()
    expect(screen.getByText('Acme')).toBeInTheDocument()
  })
})

test('opens Add Visitor modal on button click', async () => {
  renderDashboard()
  const addButton = screen.getByRole('button', { name: /\+ Add Visitor/i })
  fireEvent.click(addButton)
  await waitFor(() => {
    expect(screen.getByPlaceholderText('Visitor name')).toBeInTheDocument()
  })
})

test('closes modal when Cancel is clicked', async () => {
  renderDashboard()
  fireEvent.click(screen.getByRole('button', { name: /\+ Add Visitor/i }))
  await waitFor(() => { expect(screen.getByText('Cancel')).toBeInTheDocument() })
  fireEvent.click(screen.getByText('Cancel'))
  await waitFor(() => { expect(screen.queryByText('Cancel')).not.toBeInTheDocument() })
})

test('calls checkIn when Check In button is clicked', async () => {
  ;(dashboardService.checkIn as jest.Mock).mockResolvedValue({ ...mockVisitors.items[0], status: 'checked_in', check_in_time: new Date().toISOString() })
  renderDashboard()
  await waitFor(() => { expect(screen.getByText('Check In')).toBeInTheDocument() })
  fireEvent.click(screen.getByText('Check In'))
  await waitFor(() => { expect(dashboardService.checkIn).toHaveBeenCalledWith('1') })
})
