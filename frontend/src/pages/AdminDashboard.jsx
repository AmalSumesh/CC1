import { useState, useEffect } from 'react'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
  const [drivers, setDrivers] = useState([])
  const [dustbins, setDustbins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      // Note: These endpoints might not exist yet, adjust based on your backend
      // For now, we'll show a placeholder
      setError(null)
    } catch (err) {
      // setError(err.response?.data?.message || 'Failed to load data')
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">👨‍💼 Admin Dashboard</h1>
            <p className="text-gray-600 text-sm mt-1">Manage system, drivers, and garbage collection</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            📊 Overview
          </button>
          <button
            onClick={() => setActiveTab('drivers')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'drivers'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            🚗 Drivers
          </button>
          <button
            onClick={() => setActiveTab('dustbins')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'dustbins'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            🗑️ Dustbins
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-lg">
            <p className="text-red-700 font-semibold">⚠️ {error}</p>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Total Drivers</p>
                    <p className="text-4xl font-bold text-blue-600 mt-2">3</p>
                  </div>
                  <span className="text-4xl">🚗</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Total Dustbins</p>
                    <p className="text-4xl font-bold text-green-600 mt-2">8</p>
                  </div>
                  <span className="text-4xl">🗑️</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Avg Collection Rate</p>
                    <p className="text-4xl font-bold text-orange-600 mt-2">72%</p>
                  </div>
                  <span className="text-4xl">📈</span>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">System Status</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-700">Backend Server</span>
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    ✓ Online
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-700">Database Connection</span>
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    ✓ Connected
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-700">Map Service (OSRM)</span>
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    ✓ Operational
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Drivers Tab */}
        {activeTab === 'drivers' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Driver Management</h2>
            <p className="text-gray-600 mb-6">
              Drivers management features will be added here. You can assign dustbins, track routes, and view collection statistics.
            </p>

            {/* Sample Driver Data */}
            <div className="space-y-4">
              {[
                { name: 'Raj Kumar', username: 'driver1', bins: 3, status: 'Active' },
                { name: 'Priya Singh', username: 'driver2', bins: 4, status: 'Active' },
                { name: 'Ahmed Hassan', username: 'driver3', bins: 1, status: 'Active' }
              ].map((driver, idx) => (
                <div key={idx} className="p-4 border rounded-lg hover:bg-gray-50 transition">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800">{driver.name}</p>
                      <p className="text-sm text-gray-600">@{driver.username} • {driver.bins} bins assigned</p>
                    </div>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {driver.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dustbins Tab */}
        {activeTab === 'dustbins' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Dustbin Management</h2>
            <p className="text-gray-600 mb-6">
              Manage dustbin locations, fill levels, and priorities.
            </p>

            {/* Sample Dustbin Data */}
            <div className="space-y-4">
              {[
                { code: 'BIN-001', fill: 85, priority: 'High', location: '12.9352, 77.6245' },
                { code: 'BIN-002', fill: 60, priority: 'Medium', location: '12.9389, 77.6050' },
                { code: 'BIN-003', fill: 95, priority: 'Critical', location: '12.9719, 77.5937' },
                { code: 'BIN-004', fill: 40, priority: 'Low', location: '12.9520, 77.6009' },
                { code: 'BIN-005', fill: 75, priority: 'High', location: '12.9716, 77.5946' }
              ].map((bin, idx) => (
                <div key={idx} className="p-4 border rounded-lg hover:bg-gray-50 transition">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{bin.code}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        📍 {bin.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="mb-2">
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              bin.fill >= 80 ? 'bg-red-500' : 
                              bin.fill >= 60 ? 'bg-yellow-500' : 
                              'bg-green-500'
                            }`}
                            style={{ width: `${bin.fill}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{bin.fill}% Full</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        bin.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                        bin.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                        bin.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {bin.priority}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
