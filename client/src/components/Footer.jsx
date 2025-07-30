import React from 'react'
import { Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className='bg-gradient-to-t from-green-100 to-blue-50 text-gray-800 w-full border-t border-2 border-slate-300'>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold text-green-700 mb-4">FarmApp</h3>
            <p className="text-gray-600 text-sm mb-4">
              Empowering farmers with smart technology solutions for better harvests and sustainable farming.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-800">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-600 hover:text-green-600">Home</a></li>
              <li><a href="#" className="text-gray-600 hover:text-green-600">Crop Management</a></li>
              <li><a href="#" className="text-gray-600 hover:text-green-600">Market Prices</a></li>
              <li><a href="#" className="text-gray-600 hover:text-green-600">Community</a></li>
              <li><a href="#" className="text-gray-600 hover:text-green-600">Support</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-800">Contact Us</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <Phone size={16} className="mr-2" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Mail size={16} className="mr-2" />
                <span>support@farmapp.com</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin size={16} className="mr-2" />
                <span>Bengaluru, Karnataka</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-green-200 mt-8 pt-6">
          {/* Copyright */}
          <div className="text-center text-sm text-gray-600">
            <p>&copy; 2025 FarmApp. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer