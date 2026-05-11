import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import RoleSelector from './RoleSelector'
import LoginForm from './LoginForm'

const backgroundImage = 'https://www.figma.com/api/mcp/asset/d1555197-4a44-4268-a092-284864e39959'
const visitorLogo = 'https://www.figma.com/api/mcp/asset/debaf516-898c-42e1-8e20-50f91313f0d6'
const cptLogo = 'https://www.figma.com/api/mcp/asset/fe19f327-550a-47b9-b725-bf38868f05e0'

export default function LoginPage() {
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState<'Admin' | 'Receptionist' | 'Security Guard'>('Admin')

  return (
    <div className="bg-white relative w-full h-screen overflow-hidden" data-node-id="3:84" data-name="login">
      {/* Background Image Container */}
      <div className="absolute top-0 left-0 w-[844px] h-screen overflow-hidden" data-node-id="3:85">
        <img
          alt="Background"
          src={backgroundImage}
          className="absolute w-full h-full object-cover"
        />
      </div>

      {/* Right Panel */}
      <div className="absolute right-0 top-0 w-[596px] h-screen bg-white rounded-bl-[56px] rounded-tl-[56px] shadow-lg flex flex-col overflow-y-auto" data-node-id="3:86">
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-2 pt-7 px-8" data-node-id="3:87" data-name="Logo">
          <div className="flex items-center gap-4">
            <img alt="Visitor Logo" src={visitorLogo} className="w-14 h-16" data-node-id="3:88" />
            <div className="flex flex-col">
              <h1 className="font-satoshi font-black text-2xl leading-normal text-primary uppercase" data-node-id="3:89">
                Visitor
              </h1>
              <div className="flex items-center gap-1">
                <p className="font-satoshi font-medium text-xs leading-normal text-black" data-node-id="3:90">
                  Powered by
                </p>
                <img alt="CPT Logo" src={cptLogo} className="h-4 w-auto" data-node-id="3:91" />
              </div>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="flex flex-col gap-8 flex-1 items-center px-10 py-10 pb-20">
          {/* Heading */}
          <div className="flex flex-col gap-1 items-center w-full" data-node-id="3:95">
            <h2 className="font-inter font-semibold text-3xl leading-normal text-primary" data-node-id="3:96">
              Login
            </h2>
            <p className="font-inter font-normal text-lg leading-normal text-dark-light" data-node-id="3:97">
              Welcome to Visitor
            </p>
          </div>

          {/* Role Selector */}
          <RoleSelector selectedRole={selectedRole} onRoleChange={setSelectedRole} />

          {/* Login Form */}
          <LoginForm selectedRole={selectedRole} />
        </div>

        {/* Footer */}
        <div className="text-center pb-6 px-8">
          <p className="font-inter font-normal text-sm leading-normal text-dark-text">
            Copyright 2025 Changepond. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
