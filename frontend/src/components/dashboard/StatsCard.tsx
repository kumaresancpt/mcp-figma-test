import React from 'react'

interface StatsCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  bgColor: string
  borderColor: string
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, bgColor, borderColor }) => {
  return (
    <div
      className="rounded-xl p-5 flex items-center gap-4 shadow-sm border"
      style={{ backgroundColor: bgColor, borderColor }}
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-white/60">
        {icon}
      </div>
      <div>
        <p className="text-sm font-inter font-medium text-gray-600">{title}</p>
        <p className="text-3xl font-inter font-bold text-gray-800">{value}</p>
      </div>
    </div>
  )
}

export default StatsCard
