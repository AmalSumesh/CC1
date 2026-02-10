import { useState } from 'react'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    
    if (!username || !password) {
      setError('Please enter both username and password')
      return
    }

    try {
      setLoading(true)
      setError('')
      const res = await api.post('/auth/login', { username, password })
      
      if (res.data.token) {
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('role', res.data.role)
        
        // Redirect based on role
        if (res.data.role === 'admin') {
          navigate('/admin')
        } else {
          navigate('/driver')
        }
      }
    } catch (err) {
      const errorMessage = 
        err.response?.data?.message || 
        'Login failed. Please check your credentials and try again.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-green-600 p-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-2">🌍 CleanCity</h1>
            <p className="text-blue-100 text-sm">AI-Based Garbage Routing System</p>
          </div>

          {/* Form */}
          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <p className="text-red-700 font-semibold flex items-center gap-2">
                  <span>⚠️</span>
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value)
                    setError('')
                  }}
                  placeholder="Enter your username"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError('')
                  }}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                  loading
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-green-600 text-white hover:shadow-lg'
                }`}
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Logging in...
                  </>
                ) : (
                  <>
                    <span>🔐</span>
                    Login
                  </>
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-xs font-semibold text-gray-700 mb-3">Demo Credentials:</p>
              <div className="space-y-2 text-xs">
                <div>
                  <p className="text-gray-600"><span className="font-semibold">Admin:</span> admin / admin123</p>
                </div>
                <div>
                  <p className="text-gray-600"><span className="font-semibold">Driver:</span> driver1 / driver123</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white text-sm mt-6">
          © 2026 CleanCity. Efficient Waste Management Solutions.
        </p>
      </div>
    </div>
  )
}
