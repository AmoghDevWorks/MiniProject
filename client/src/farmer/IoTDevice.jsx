import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Thermometer, Droplets, Sprout, Activity, Plus } from 'lucide-react';
import { addIoT } from '../utils/iotDataSlice'

const IoTDevice = () => {
  const IoTDeviceId = useSelector(state => state.user.IoTDeviceId);
  const dispatch = useDispatch();
  // const IoTDeviceId = 1
  const [deviceData, setDeviceData] = useState({
    temperature: null,
    soilMoisture: null,
    nitrogen: null,
    phosphorus: null,
    potassium: null
  });
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [newDeviceId, setNewDeviceId] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  // fetch function callable from useEffect and Refresh button
  const fetchDeviceData = useCallback(async () => {
    try {
      setIsFetching(true);
      const res = await fetch('http://localhost:8000/iot/getIoTData');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // store complete response in redux
      dispatch(addIoT(data));

      // map required fields into deviceData state
      setDeviceData({
        // Prefer SoilTemp for the displayed "Temperature" card; fallback to AirTemp
        temperature: data.SoilTemp ?? data.AirTemp ?? null,
        // Prefer SoilMoisturePct / SoilMoist for displayed soil moisture; fallback to AirHum
        soilMoisture: data.SoilMoisturePct ?? data.SoilMoist ?? data.AirHum ?? null,
        nitrogen: data.N ?? null,
        phosphorus: data.P ?? null,
        potassium: data.K ?? null
      });

      setLastUpdated(data.date + '  ' + data.time.slice(0,-4));
    } catch (err) {
      console.error('Failed to fetch IoT data', err);
    } finally {
      setIsFetching(false);
    }
  }, [dispatch]);

  // initial load when IoTDeviceId is present
  useEffect(() => {
    if (IoTDeviceId) {
      fetchDeviceData();
    }
  }, [IoTDeviceId, fetchDeviceData]);

  const handleAddDevice = () => {
    // Handle adding device logic here
    console.log('Adding device:', newDeviceId);
    setShowAddDevice(false);
  };

  if (!IoTDeviceId) {
    return (
      <div className="min-h-screen bg-green-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
              IoT Device Management
            </h1>
            <p className="text-gray-600 text-center mb-8">
              Connect your IoT device to monitor your crops
            </p>

            <div className="flex flex-col items-center justify-center py-12">
              <div className="bg-green-100 p-6 rounded-full mb-6">
                <Activity className="w-16 h-16 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                No Device Connected
              </h2>
              <p className="text-gray-600 text-center mb-8 max-w-md">
                Add your IoT device to start monitoring real-time data from your farm
              </p>
              
              {!showAddDevice ? (
                <button
                  onClick={() => setShowAddDevice(true)}
                  className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Device
                </button>
              ) : (
                <div className="w-full max-w-md">
                  <div className="bg-green-100 border border-green-600 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Enter Device ID
                    </h3>
                    <input
                      type="text"
                      value={newDeviceId}
                      onChange={(e) => setNewDeviceId(e.target.value)}
                      placeholder="Device ID (e.g., IOT-12345)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={handleAddDevice}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                      >
                        Connect
                      </button>
                      <button
                        onClick={() => setShowAddDevice(false)}
                        className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                IoT Device Dashboard
              </h1>
              <p className="text-gray-600 mb-2">
                Real-time monitoring of your farm
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchDeviceData}
                disabled={isFetching}
                className="bg-green-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                {isFetching ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>

          {/* Device ID Card */}
          <div className="bg-green-100 border border-green-600 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Device ID</p>
                <p className="text-lg font-bold text-gray-800">{IoTDeviceId}</p>
              </div>
              <div className="bg-green-600 p-3 rounded-full">
                <Activity className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Data Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Temperature Card */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-green-600 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Thermometer className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 font-medium">Temperature</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {deviceData.temperature !== null ? `${deviceData.temperature}°C` : '-'}
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: deviceData.temperature ? `${(deviceData.temperature / 50) * 100}%` : '0%' }}
                />
              </div>
            </div>

            {/* Humidity Card */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-green-600 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Droplets className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 font-medium">Soil Moisture</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {deviceData.soilMoisture !== null ? `${deviceData.soilMoisture}%` : '-'}
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: deviceData.soilMoisture ? `${deviceData.soilMoisture}%` : '0%' }}
                />
              </div>
            </div>

            {/* NPK Card - Combined */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-green-600 transition-colors md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Sprout className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Soil NPK Levels</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Nitrogen */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 font-medium">Nitrogen (N)</span>
                    <span className="text-xl font-bold text-gray-800">
                      {deviceData.nitrogen !== null ? `${deviceData.nitrogen} mg/kg` : '-'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: deviceData.nitrogen ? `${deviceData.nitrogen}%` : '0%' }}
                    />
                  </div>
                </div>

                {/* Phosphorus */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 font-medium">Phosphorus (P)</span>
                    <span className="text-xl font-bold text-gray-800">
                      {deviceData.phosphorus !== null ? `${deviceData.phosphorus} mg/kg` : '-'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: deviceData.phosphorus ? `${deviceData.phosphorus}%` : '0%' }}
                    />
                  </div>
                </div>

                {/* Potassium */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 font-medium">Potassium (K)</span>
                    <span className="text-xl font-bold text-gray-800">
                      {deviceData.potassium !== null ? `${deviceData.potassium} mg/kg` : '-'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: deviceData.potassium ? `${deviceData.potassium}%` : '0%' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Last Updated */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Last updated: {lastUpdated ? lastUpdated.toLocaleString() : '—'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IoTDevice;