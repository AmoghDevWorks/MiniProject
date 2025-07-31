import React from 'react'
import { Leaf, Users, TrendingUp, Shield, Globe, Award } from 'lucide-react'

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full">
              <Leaf className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Empowering Farmers, <span className="text-green-600">Growing Communities</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our centralized platform connects farmers across the globe, providing cutting-edge tools, 
            real-time market insights, and community support to revolutionize modern agriculture.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Our Mission</h2>
          <p className="text-lg text-gray-700 text-center max-w-4xl mx-auto leading-relaxed">
            To bridge the gap between traditional farming practices and modern technology, creating a 
            sustainable ecosystem where every farmer has access to the tools, knowledge, and market 
            opportunities they need to thrive in today's agricultural landscape.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Market Analytics</h3>
            <p className="text-gray-600">
              Real-time crop prices, demand forecasting, and market trends to help you make informed decisions about when and where to sell your produce.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Leaf className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Smart Farming Tools</h3>
            <p className="text-gray-600">
              Weather monitoring, soil analysis, crop management schedules, and AI-powered recommendations to optimize your farming practices.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Farmer Community</h3>
            <p className="text-gray-600">
              Connect with fellow farmers, share experiences, get expert advice, and collaborate on sustainable farming initiatives.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Globe className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Global Marketplace</h3>
            <p className="text-gray-600">
              Direct access to buyers, exporters, and distributors worldwide. Eliminate middlemen and get better prices for your crops.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Secure Transactions</h3>
            <p className="text-gray-600">
              End-to-end encrypted payments, contract management, and dispute resolution to ensure safe and reliable business dealings.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Certification Support</h3>
            <p className="text-gray-600">
              Guidance for organic certification, quality standards compliance, and access to premium market segments.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-green-600 rounded-2xl text-white p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our Impact</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-green-100">Active Farmers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">25+</div>
              <div className="text-green-100">Countries</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">$2.5M+</div>
              <div className="text-green-100">Revenue Generated</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-green-100">Satisfaction Rate</div>
            </div>
          </div>
        </div>

        {/* Vision Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Vision</h2>
          <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed mb-8">
            We envision a world where technology and agriculture work hand in hand to create sustainable food systems, 
            support rural communities, and ensure food security for future generations. Our platform is the bridge 
            that connects traditional farming wisdom with modern innovation.
          </p>
          
          <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">Join Our Growing Community</h3>
            <p className="text-lg mb-6">
              Whether you're a small-scale farmer or managing large agricultural operations, 
              our platform is designed to help you succeed in today's competitive market.
            </p>
            <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Get Started Today
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About