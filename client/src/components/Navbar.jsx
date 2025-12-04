import React, { useState } from 'react';
import { Menu, X, User, LogIn } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { removeRole } from '../utils/roleSlice'
import { removeUser } from '../utils/userSlice'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const user = useSelector((state)=>state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const handleSignOut = () =>{
    dispatch(removeUser())
    dispatch(removeRole())
    navigate('/')
  }

  return (
    <nav className="bg-gradient-to-br from-green-100 to-green-50 text-gray-800 w-full shadow-lg border-b border-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo or Brand Name */}
          <div className="text-2xl font-bold text-green-600 hover:text-green-700 cursor-pointer">
            FarmApp
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-green-600 font-medium px-3 py-2 rounded-md hover:bg-green-50">
              Home
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-green-600 font-medium px-3 py-2 rounded-md hover:bg-green-50">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-green-600 font-medium px-3 py-2 rounded-md hover:bg-green-50">
              Contact
            </Link>
            
            {/* User Auth Section */}
            {user ? (
              <div className='flex gap-8'>
                <Link to="/farmerIoT" className="text-gray-700 hover:text-green-600 font-medium px-3 py-2 rounded-md hover:bg-green-50">
                  Device Details
                </Link>
                <Link to="/diseaseDetection" className="text-gray-700 hover:text-green-600 font-medium px-3 py-2 rounded-md hover:bg-green-50">
                  Detect
                </Link>
                <Link to='/farmerProfile' className="flex items-center space-x-2 bg-green-100 hover:bg-green-200 px-4 py-2 rounded-full cursor-pointer">
                  <User size={20} className="text-green-600" />
                  <span className="text-green-700 font-medium">Profile</span>
                </Link>
                <div onClick={handleSignOut} className="flex items-center space-x-2 bg-green-100 hover:bg-green-200 px-4 py-2 rounded-full cursor-pointer">
                  <span className="text-green-700 font-medium">Sign Out</span>
                </div>
              </div>
            ) : (
              // <Link to="/auth" className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium">
              <Link to="/farmerSignIn" className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium">
                <LogIn size={20} />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Hamburger Menu Icon */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="focus:outline-none p-2 rounded-md hover:bg-gray-100"
            >
              {isOpen ? <X size={24} className="text-gray-700" /> : <Menu size={24} className="text-gray-700" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-4 space-y-3">
            <Link 
              to="/" 
              className="block text-gray-700 hover:text-green-600 hover:bg-green-50 px-4 py-3 rounded-md font-medium"
              onClick={handleLinkClick}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="block text-gray-700 hover:text-green-600 hover:bg-green-50 px-4 py-3 rounded-md font-medium"
              onClick={handleLinkClick}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="block text-gray-700 hover:text-green-600 hover:bg-green-50 px-4 py-3 rounded-md font-medium"
              onClick={handleLinkClick}
            >
              Contact
            </Link>
            
            {/* Mobile User Auth Section */}
            <div className="pt-3 border-t border-gray-200">
              {user ? (
                <Link 
                  to='/farmerProfile' 
                  className="flex items-center space-x-3 bg-green-100 hover:bg-green-200 px-4 py-3 rounded-md cursor-pointer"
                >
                  <User size={20} className="text-green-600" />
                  <span className="text-green-700 font-medium">Profile</span>
                </Link>
              ) : (
                <Link 
                  to="/auth" 
                  className="flex items-center space-x-3 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-md font-medium w-full"
                  onClick={handleLinkClick}
                >
                  <LogIn size={20} />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;