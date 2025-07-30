import React, { useState } from 'react'
import { User, Settings, Wrench, X } from 'lucide-react'
import BgImg from '../assets/authBack.jpg'
import { useNavigate } from 'react-router-dom'

const Auth = () => {
  const [isOpen, setIsOpen] = useState(true)
  const [selectedRole, setSelectedRole] = useState(null)

  const navigate = useNavigate()

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId)
  }

  const handleContinue = () => {
    if (selectedRole) {
      console.log(`Selected role: ${selectedRole}`)
      // Handle role selection logic here
    }
  }

  if (!isOpen) 
    navigate('/')

  return (
    <div className='h-screen max-w-screen bg-cover bg-center bg-no-repeat '
      style={{
        backgroundImage: `
          radial-gradient(circle at center,transparent, rgba(226, 232, 240, 0.2), rgba(110, 231, 183,0.3)),
          url(${BgImg})
        `
      }}
    >
      <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.2), rgba(232,253,239,0.7))',
          }}
          className="rounded-2xl shadow-2xl w-full max-w-md"
        >
          {/* Modal Header */}
          <div className="flex justify-between items-center p-6 border-b border-green-300">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Choose Your Role</h2>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-black hover:text-gray-700 p-2 rounded-full hover:bg-white hover:bg-opacity-50"
            >
              <X size={30} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-8">
            <div className="flex flex-col items-center gap-6">
              {/* First Row - Admin and Technician */}
              <div className="flex gap-6">
                {/* Admin */}
                <div
                  onClick={() => handleRoleSelect('admin')}
                  className={`
                    w-32 h-32 cursor-pointer rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center
                    ${selectedRole === 'admin' 
                      ? 'border-green-500 bg-slate-100 shadow-lg transform scale-105' 
                      : 'border-green-200 bg-white bg-opacity-60 hover:bg-slate-50 hover:shadow-md'
                    }
                  `}
                >
                  <Settings size={40} className="text-purple-600 mb-2" />
                  <span className="text-sm font-semibold text-gray-800">Admin</span>
                </div>

                {/* Technician */}
                <div
                  onClick={() => handleRoleSelect('technician')}
                  className={`
                    w-32 h-32 cursor-pointer rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center
                    ${selectedRole === 'technician' 
                      ? 'border-green-500 bg-slate-100 shadow-lg transform scale-105' 
                      : 'border-green-200 bg-white bg-opacity-60 hover:bg-slate-50 hover:shadow-md'
                    }
                  `}
                >
                  <Wrench size={40} className="text-blue-600 mb-2" />
                  <span className="text-sm font-semibold text-gray-800">Technician</span>
                </div>
              </div>

              {/* Second Row - Farmer (Centered) */}
              <div
                onClick={() => handleRoleSelect('farmer')}
                className={`
                  w-32 h-32 cursor-pointer rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center
                  ${selectedRole === 'farmer' 
                    ? 'border-green-500 bg-slate-100 shadow-lg transform scale-105' 
                    : 'border-green-200 bg-white bg-opacity-60 hover:bg-slate-50 hover:shadow-md'
                  }
                `}
              >
                <User size={40} className="text-green-600 mb-2" />
                <span className="text-sm font-semibold text-gray-800">Farmer</span>
              </div>
            </div>

            {/* Continue Button */}
            <div className="flex justify-center mt-8">
              <button
                onClick={handleContinue}
                disabled={!selectedRole}
                className={`
                  px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200
                  ${selectedRole 
                    ? 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                Continue
              </button>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 pb-6">
            <div className="text-center">
              <p className="text-md text-black">
                Don't have an account? 
                <a href="#" className="text-green-600 hover:text-green-700 font-medium ml-1">Sign up here</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  )
}

export default Auth