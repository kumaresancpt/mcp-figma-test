import React, { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendItem } from '../../services/dashboardService'

interface VisitorTrendsChartProps {
  data: TrendItem[]
  onRangeChange: (days: number) => void
}

const VisitorTrendsChart: React.FC<VisitorTrendsChartProps> = ({ data, onRangeChange }) => {
  const [selected, setSelected] = useState(7)

  const handleChange = (days: number) => {
    setSelected(days)
    onRangeChange(days)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-inter font-semibold text-base text-gray-800">Visitor Trends</h3>
        <div className="flex gap-2">
          {[7, 14, 30].map((d) => (
            <button
              key={d}
              onClick={() => handleChange(d)}
              className={`px-3 py-1 rounded-full text-xs font-inter font-medium transition-colors ${
                selected === d ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fontFamily: 'Inter' }} />
          <YAxis tick={{ fontSize: 11, fontFamily: 'Inter' }} allowDecimals={false} />
          <Tooltip contentStyle={{ fontFamily: 'Inter', fontSize: 12 }} />
          <Line type="monotone" dataKey="count" stroke="#5B21B6" strokeWidth={2} dot={{ r: 3, fill: '#5B21B6' }} name="Visitors" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default VisitorTrendsChart
