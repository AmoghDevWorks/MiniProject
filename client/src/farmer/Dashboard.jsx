import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { User, Mail, Phone, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FarmerDashboard = () => {
  const farmer = useSelector((state) => state.user);
  const farmerId = farmer?._id;
  const [detectionHistory, setDetectionHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!farmerId) {
      navigate('/');
      return;
    }

    const fetchPreviousDetections = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:8000/farmer/previousDetection/${farmerId}`
        );

        if (res.data && res.data.detections) {
          setDetectionHistory(res.data.detections);
        } else {
          setDetectionHistory([]);
        }
      } catch (err) {
        setError('Failed to load detection history');
      } finally {
        setLoading(false);
      }
    };

    fetchPreviousDetections();
  }, [farmerId, navigate]);

  if (!farmer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <p className="text-gray-700 text-lg font-medium">
          No user is signed in. Please log in to view your dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Farmer Dashboard</h1>
          <p className="text-gray-600">Manage your profile and view detection history</p>
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Farmer Details Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Farmer Details</h2>

            {/* Profile Image */}
            <div className="flex justify-center mb-6">
              {farmer.profileImage ? (
                <img
                  src={farmer.profileImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-green-100"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center border-4 border-green-200">
                  <User className="w-16 h-16 text-green-600" />
                </div>
              )}
            </div>

            {/* Farmer Information */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="bg-blue-100 rounded-lg p-2">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-0.5">Name</p>
                  <p className="text-base font-semibold text-gray-800">{farmer.name}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="bg-green-100 rounded-lg p-2">
                  <Mail className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-0.5">Email</p>
                  <p className="text-base font-semibold text-gray-800">{farmer.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="bg-purple-100 rounded-lg p-2">
                  <Phone className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-0.5">Phone Number</p>
                  <p className="text-base font-semibold text-gray-800">{farmer.phoneNo}</p>
                </div>
              </div>
            </div>

            {/* Edit Profile Button */}
            <button className="w-full mt-6 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold py-3 px-4 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-md">
              Edit Profile
            </button>
          </div>

          {/* Disease Detection History Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-blue-600" />
              Detection History
            </h2>

            {loading ? (
              <div className="text-gray-600">Loading detection history...</div>
            ) : error ? (
              <div className="text-red-600">{error}</div>
            ) : detectionHistory.length === 0 ? (
              <div className="text-gray-500">No detection history available.</div>
            ) : (
              <>
                {/* Table for larger screens */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 px-2 text-xs font-semibold text-gray-700">Date</th>
                        <th className="text-left py-3 px-2 text-xs font-semibold text-gray-700">Result</th>
                        <th className="text-left py-3 px-2 text-xs font-semibold text-gray-700">Confidence</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detectionHistory.map((record, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-2 text-sm text-gray-700">{record.date}</td>
                          <td className="py-3 px-2">
                            {record.result == 'Healthy' ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                {record.result}
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                {record.result}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-2 text-sm font-semibold text-gray-700">
                            {parseFloat(record.confidence).toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Card view for mobile */}
                <div className="sm:hidden space-y-3">
                  {detectionHistory.map((record, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500">{record.date}</p>
                          {record.isHealthy ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 mt-1">
                              {record.result}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 mt-1">
                              {record.result}
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{record.confidence}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
