import SignUpForm from './SignUpForm'

const backgroundImage = 'https://www.figma.com/api/mcp/asset/d1555197-4a44-4268-a092-284864e39959'
const visitorLogo = 'https://www.figma.com/api/mcp/asset/debaf516-898c-42e1-8e20-50f91313f0d6'
const cptLogo = 'https://www.figma.com/api/mcp/asset/fe19f327-550a-47b9-b725-bf38868f05e0'

export default function SignUpPage() {
  return (
    <div className="bg-white relative w-full h-screen overflow-hidden" data-node-id="21:77" data-name="signup">
      {/* Background Image Container */}
      <div className="absolute top-0 left-0 w-[844px] h-screen overflow-hidden">
        <img
          alt="Background"
          src={backgroundImage}
          className="absolute w-full h-full object-cover"
        />
      </div>

      {/* Right Panel */}
      <div className="absolute right-0 top-0 w-[596px] h-screen bg-white rounded-tl-[56px] rounded-bl-[56px] shadow-lg flex flex-col overflow-y-auto">
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-2 pt-7 px-8">
          <div className="flex items-center gap-4">
            <img alt="Visitor Logo" src={visitorLogo} className="w-14 h-16" />
            <div className="flex flex-col">
              <h1 className="font-satoshi font-black text-2xl leading-normal text-primary uppercase">
                VISITOR
              </h1>
              <div className="flex items-center gap-1">
                <p className="font-satoshi font-medium text-xs leading-normal text-black">
                  Powered by
                </p>
                <img alt="CPT Logo" src={cptLogo} className="h-4 w-auto" />
              </div>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="flex flex-col gap-6 flex-1 items-center px-10 py-8 pb-20">
          {/* Heading */}
          <div className="flex flex-col gap-1 items-center w-full">
            <h2 className="font-inter font-semibold text-3xl leading-normal text-primary">
              Sign up
            </h2>
            <p className="font-inter font-normal text-lg leading-normal text-dark-light">
              Create an account to get started
            </p>
          </div>

          {/* Sign Up Form */}
          <SignUpForm />
        </div>

        {/* Footer */}
        <div className="text-center pb-6 px-8">
          <p className="font-inter font-normal text-sm leading-normal text-dark-text">
            Copyright 2026 Changepond. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
