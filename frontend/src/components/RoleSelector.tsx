import { useState } from 'react'

interface RoleSelectorProps {
  selectedRole: 'Admin' | 'Receptionist' | 'Security Guard'
  onRoleChange: (role: 'Admin' | 'Receptionist' | 'Security Guard') => void
}

export default function RoleSelector({ selectedRole, onRoleChange }: RoleSelectorProps) {
  const roles: Array<'Admin' | 'Receptionist' | 'Security Guard'> = ['Admin', 'Receptionist', 'Security Guard']

  return (
    <div className="inline-flex gap-7 items-center bg-gray-light px-7 py-3 rounded-full" data-node-id="3:98">
      {roles.map((role) => (
        <button
          key={role}
          onClick={() => onRoleChange(role)}
          className={`px-4.5 py-2.5 rounded-tab font-inter font-semibold text-base leading-normal transition-all whitespace-nowrap ${
            selectedRole === role
              ? 'bg-primary text-white'
              : 'text-dark-text bg-transparent hover:opacity-75'
          }`}
          data-node-id={selectedRole === role ? '3:99' : undefined}
        >
          {role}
        </button>
      ))}
    </div>
  )
}
