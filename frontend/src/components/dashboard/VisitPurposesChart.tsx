import React from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { PurposeItem } from '../../services/dashboardService'

const COLORS = ['#5B21B6', '#7C3AED', '#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE']

interface VisitPurposesChartProps {
  data: PurposeItem[]
}

const VisitPurposesChart: React.FC<VisitPurposesChartProps> = ({ data }) => {
  const chartData = data.length > 0 ? data : [
    { purpose: 'Meeting', count: 35 },
    { purpose: 'Official', count: 25 },
    { purpose: 'Interview', count: 15 },
    { purpose: 'Delivery', count: 12 },
    { purpose: 'Maintenance', count: 8 },
    { purpose: 'Event', count: 5 },
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
      <h3 className="font-inter font-semibold text-base text-gray-800 mb-4">Visit Purposes</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="count" nameKey="purpose">
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ fontFamily: 'Inter', fontSize: 12 }} formatter={(value, name) => [value, name]} />
          <Legend iconType="circle" iconSize={8} formatter={(value) => <span style={{ fontFamily: 'Inter', fontSize: 12 }}>{value}</span>} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default VisitPurposesChart
