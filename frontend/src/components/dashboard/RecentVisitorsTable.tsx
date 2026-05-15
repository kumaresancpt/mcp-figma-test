import React from 'react'
import { Visitor } from '../../services/dashboardService'

interface RecentVisitorsTableProps {
  visitors: Visitor[]
  total: number
  page: number
  onPageChange: (page: number) => void
  onCheckIn: (id: string) => void
  onCheckOut: (id: string) => void
  loading: boolean
}

const statusColor: Record<string, string> = {
  waiting: 'bg-yellow-100 text-yellow-700',
  checked_in: 'bg-green-100 text-green-700',
  checked_out: 'bg-gray-100 text-gray-600',
  pending_approval: 'bg-blue-100 text-blue-700',
  expired_pass: 'bg-red-100 text-red-600',
}

function formatTime(iso?: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const LIMIT = 10

const RecentVisitorsTable: React.FC<RecentVisitorsTableProps> = ({ visitors, total, page, onPageChange, onCheckIn, onCheckOut, loading }) => {
  const totalPages = Math.ceil(total / LIMIT)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="font-inter font-semibold text-base text-gray-800">Recent Visitors</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm font-inter">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Company</th>
              <th className="px-4 py-3 text-left">Host</th>
              <th className="px-4 py-3 text-left">Purpose</th>
              <th className="px-4 py-3 text-left">Check-In</th>
              <th className="px-4 py-3 text-left">Check-Out</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Badge</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>
            ) : visitors.length === 0 ? (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-400">No visitors found</td></tr>
            ) : visitors.map((v) => (
              <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-800">{v.name}</td>
                <td className="px-4 py-3 text-gray-500">{v.company || '—'}</td>
                <td className="px-4 py-3 text-gray-500">{v.host || '—'}</td>
                <td className="px-4 py-3 text-gray-500">{v.purpose}</td>
                <td className="px-4 py-3 text-gray-500">{formatTime(v.check_in_time)}</td>
                <td className="px-4 py-3 text-gray-500">{formatTime(v.check_out_time)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[v.status] || 'bg-gray-100 text-gray-600'}`}>
                    {v.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">{v.badge || '—'}</td>
                <td className="px-4 py-3">
                  {v.status === 'waiting' || v.status === 'pending_approval' ? (
                    <button onClick={() => onCheckIn(v.id)} className="text-xs bg-primary text-white px-3 py-1 rounded-full hover:opacity-80 transition-opacity">Check In</button>
                  ) : v.status === 'checked_in' ? (
                    <button onClick={() => onCheckOut(v.id)} className="text-xs bg-gray-700 text-white px-3 py-1 rounded-full hover:opacity-80 transition-opacity">Check Out</button>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-500">Showing {((page - 1) * LIMIT) + 1}–{Math.min(page * LIMIT, total)} of {total}</span>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => onPageChange(page - 1)} className="text-xs px-3 py-1 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50">Prev</button>
            <button disabled={page === totalPages} onClick={() => onPageChange(page + 1)} className="text-xs px-3 py-1 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50">Next</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default RecentVisitorsTable
