import { useState } from 'react'
import api from '../api/axios'
import MapView from '../components/MapView'
import RouteInfo from '../components/RouteInfo'
import { useNavigate } from 'react-router-dom'

export default function DriverDashboard() {
  const [routeData, setRouteData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const generateRoute = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await api.post('/driver/create-route')
      setRouteData(res.data)
    } catch (err) {
      const errorMessage = 
        err.response?.data?.message || 
        err.message || 
        'Failed to create route. Please try again.'
      setError(errorMessage)
      console.error('Error creating route:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">🚗 Driver Dashboard</h1>
            <p className="text-gray-600 text-sm mt-1">Manage your garbage collection routes</p>
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
        {/* Route Generation Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Create Optimized Route</h2>
          <p className="text-gray-600 mb-4">
            Click the button below to generate an optimized garbage collection route for your assigned dustbins.
          </p>
          <button
            onClick={generateRoute}
            disabled={loading}
            className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
              loading
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {loading ? (
              <>
                <span className="animate-spin">⏳</span>
                Generating Route...
              </>
            ) : (
              <>
                <span>🗺️</span>
                Create Optimized Route
              </>
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-lg">
            <p className="text-red-700 font-semibold flex items-center gap-2">
              <span>⚠️</span>
              {error}
            </p>
          </div>
        )}

        {/* Route Display */}
        {routeData && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">📍 Your Optimized Route</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <RouteInfo 
                  visitOrder={routeData.visitOrder}
                  totalDistance={routeData.totalDistance}
                  totalDuration={routeData.totalDuration}
                />
                <MapView route={routeData.route} />
              </div>
            </div>

            {/* Route Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-sm text-gray-600 font-semibold">Total Stops</p>
                <p className="text-3xl font-bold text-blue-600">{routeData.visitOrder?.length || 0}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-sm text-gray-600 font-semibold">Total Distance</p>
                <p className="text-3xl font-bold text-green-600">{routeData.totalDistance || 'N/A'} km</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-sm text-gray-600 font-semibold">Est. Time</p>
                <p className="text-3xl font-bold text-orange-600">{routeData.totalDuration || 'N/A'} min</p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!routeData && !loading && !error && (
          <div className="bg-white p-12 rounded-lg shadow-md text-center">
            <p className="text-gray-500 text-lg">Generate a route to see your optimized garbage collection path</p>
          </div>
        )}
      </main>
    </div>
  )
}
