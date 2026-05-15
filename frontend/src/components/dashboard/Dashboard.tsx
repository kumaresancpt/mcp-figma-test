import React, { useEffect, useState, useCallback } from 'react'
import Sidebar from './Sidebar'
import StatsCard from './StatsCard'
import VisitorTrendsChart from './VisitorTrendsChart'
import VisitPurposesChart from './VisitPurposesChart'
import RecentVisitorsTable from './RecentVisitorsTable'
import AddVisitorModal from './AddVisitorModal'
import {
  dashboardService,
  DashboardStats,
  TrendItem,
  PurposeItem,
  Visitor,
  CreateVisitorPayload,
} from '../../services/dashboardService'

const defaultStats: DashboardStats = {
  visitors_today: 0,
  active_visitors: 0,
  pending_approvals: 0,
  overstay_alerts: 0,
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>(defaultStats)
  const [trends, setTrends] = useState<TrendItem[]>([])
  const [purposes, setPurposes] = useState<PurposeItem[]>([])
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [tableLoading, setTableLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [trendDays, setTrendDays] = useState(7)

  const loadStats = useCallback(async () => {
    try { setStats(await dashboardService.getStats()) } catch { /* use defaults */ }
  }, [])

  const loadTrends = useCallback(async (days: number) => {
    try { setTrends(await dashboardService.getTrends(days)) } catch { /* silent */ }
  }, [])

  const loadPurposes = useCallback(async () => {
    try { setPurposes(await dashboardService.getPurposes()) } catch { /* silent */ }
  }, [])

  const loadVisitors = useCallback(async (p: number) => {
    setTableLoading(true)
    try {
      const result = await dashboardService.getVisitors(p, 10)
      setVisitors(result.items)
      setTotal(result.total)
    } catch { /* silent */ } finally { setTableLoading(false) }
  }, [])

  useEffect(() => {
    loadStats()
    loadTrends(trendDays)
    loadPurposes()
    loadVisitors(page)
  }, [])

  const handleRangeChange = (days: number) => {
    setTrendDays(days)
    loadTrends(days)
  }

  const handlePageChange = (p: number) => {
    setPage(p)
    loadVisitors(p)
  }

  const handleCheckIn = async (id: string) => {
    try { await dashboardService.checkIn(id); loadVisitors(page); loadStats() } catch { /* silent */ }
  }

  const handleCheckOut = async (id: string) => {
    try { await dashboardService.checkOut(id); loadVisitors(page); loadStats() } catch { /* silent */ }
  }

  const handleAddVisitor = async (payload: CreateVisitorPayload) => {
    await dashboardService.createVisitor(payload)
    loadVisitors(1)
    setPage(1)
    loadStats()
  }

  const statsCards = [
    { title: 'Visitors Today', value: stats.visitors_today, icon: <span className="text-2xl">👤</span>, bgColor: '#EDE9FE', borderColor: '#C4B5FD' },
    { title: 'Active Visitors', value: stats.active_visitors, icon: <span className="text-2xl">✅</span>, bgColor: '#DCFCE7', borderColor: '#86EFAC' },
    { title: 'Pending Approvals', value: stats.pending_approvals, icon: <span className="text-2xl">⏳</span>, bgColor: '#FEF9C3', borderColor: '#FDE047' },
    { title: 'Overstay Alerts', value: stats.overstay_alerts, icon: <span className="text-2xl">⚠️</span>, bgColor: '#FEE2E2', borderColor: '#FCA5A5' },
  ]

  return (
    <div className="flex min-h-screen bg-[#FAF8F5]">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-inter font-bold text-xl text-gray-800">Dashboard</h1>
            <p className="text-xs text-gray-400 font-inter mt-0.5">Welcome back! Here's what's happening today.</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-inter font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <span>+</span> Add Visitor
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {statsCards.map((card) => (
              <StatsCard key={card.title} {...card} />
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <VisitorTrendsChart data={trends} onRangeChange={handleRangeChange} />
            </div>
            <div className="lg:col-span-1">
              <VisitPurposesChart data={purposes} />
            </div>
          </div>

          {/* Recent Visitors Table */}
          <RecentVisitorsTable
            visitors={visitors}
            total={total}
            page={page}
            onPageChange={handlePageChange}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            loading={tableLoading}
          />

          {/* Footer */}
          <footer className="text-center text-xs text-gray-400 font-inter py-2">
            Copyright 2026 Changepond
          </footer>
        </main>
      </div>

      <AddVisitorModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleAddVisitor} />
    </div>
  )
}

export default Dashboard
