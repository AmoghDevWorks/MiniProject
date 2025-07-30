import React, { useState } from 'react';
import { Menu, X, User, LogIn } from 'lucide-react';
import { useSelector } from 'react-redux'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const user = useSelector((state)=>state.user)

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="bg-gradient-to-br from-green-100 to-blue-50 text-gray-800 w-full shadow-lg border-b border-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo or Brand Name */}
          <div className="text-2xl font-bold text-blue-600 hover:text-blue-700 cursor-pointer">
            MyApp
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/home" className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-md hover:bg-blue-50">
              Home
            </a>
            <a href="/about" className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-md hover:bg-blue-50">
              About
            </a>
            <a href="/contact" className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-md hover:bg-blue-50">
              Contact
            </a>
            
            {/* User Auth Section */}
            {user ? (
              <div className="flex items-center space-x-2 bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded-full cursor-pointer">
                <User size={20} className="text-blue-600" />
                <span className="text-blue-700 font-medium">Profile</span>
              </div>
            ) : (
              <a href="/signin" className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium">
                <LogIn size={20} />
                <span>Sign In</span>
              </a>
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
            <a 
              href="/home" 
              className="block text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-md font-medium"
              onClick={handleLinkClick}
            >
              Home
            </a>
            <a 
              href="/about" 
              className="block text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-md font-medium"
              onClick={handleLinkClick}
            >
              About
            </a>
            <a 
              href="/contact" 
              className="block text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-md font-medium"
              onClick={handleLinkClick}
            >
              Contact
            </a>
            
            {/* Mobile User Auth Section */}
            <div className="pt-3 border-t border-gray-200">
              {user ? (
                <div className="flex items-center space-x-3 bg-blue-100 hover:bg-blue-200 px-4 py-3 rounded-md cursor-pointer">
                  <User size={20} className="text-blue-600" />
                  <span className="text-blue-700 font-medium">Profile</span>
                </div>
              ) : (
                <a 
                  href="/signin" 
                  className="flex items-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-md font-medium w-full"
                  onClick={handleLinkClick}
                >
                  <LogIn size={20} />
                  <span>Sign In</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;