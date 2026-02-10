import { useState, useEffect } from 'react'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
  const [drivers, setDrivers] = useState([])
  const [dustbins, setDustbins] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [newDriver, setNewDriver] = useState({ name: '', username: '', password: '' })
  const [newBin, setNewBin] = useState({ binCode: '', lat: '', lng: '' })
  const navigate = useNavigate()

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    try {
      setLoading(true)
      const [dRes, bRes] = await Promise.all([
        api.get('/admin/drivers'),
        api.get('/admin/dustbins')
      ])
      setDrivers(dRes.data)
      setDustbins(bRes.data)
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    navigate('/')
  }

  const createDriver = async () => {
    try {
      setLoading(true)
      await api.post('/admin/driver', newDriver)
      setNewDriver({ name: '', username: '', password: '' })
      fetchAll()
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    } finally { setLoading(false) }
  }

  const removeDriver = async (id) => {
    if (!confirm('Delete driver?')) return
    try { setLoading(true); await api.delete(`/admin/driver/${id}`); fetchAll() } 
    catch (err) { setError(err.response?.data?.message || err.message) } 
    finally { setLoading(false) }
  }

  const assignBin = async (driverId, binId) => {
    try { setLoading(true); await api.post('/admin/assign-bin', { driverId, binId }); fetchAll() }
    catch (err) { setError(err.response?.data?.message || err.message) }
    finally { setLoading(false) }
  }

  const removeBin = async (driverId, binId) => {
    try { setLoading(true); await api.post('/admin/remove-bin', { driverId, binId }); fetchAll() }
    catch (err) { setError(err.response?.data?.message || err.message) }
    finally { setLoading(false) }
  }

  const createBin = async () => {
    try {
      setLoading(true)
      await api.post('/admin/dustbin', { binCode: newBin.binCode, lat: parseFloat(newBin.lat), lng: parseFloat(newBin.lng) })
      setNewBin({ binCode: '', lat: '', lng: '' })
      fetchAll()
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    } finally { setLoading(false) }
  }

  const deleteBin = async (id) => {
    if (!confirm('Delete dustbin?')) return
    try { setLoading(true); await api.delete(`/admin/dustbin/${id}`); fetchAll() }
    catch (err) { setError(err.response?.data?.message || err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">👨‍💼 Admin Dashboard</h1>
            <p className="text-gray-600 text-sm mt-1">Manage drivers and dustbins</p>
          </div>
          <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded-lg">Logout</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-4 mb-8">
          <button onClick={() => setActiveTab('drivers')} className={`px-6 py-3 rounded-lg ${activeTab==='drivers'?'bg-blue-600 text-white':'bg-white'}`}>Drivers</button>
          <button onClick={() => setActiveTab('dustbins')} className={`px-6 py-3 rounded-lg ${activeTab==='dustbins'?'bg-blue-600 text-white':'bg-white'}`}>Dustbins</button>
        </div>

        {error && <div className="mb-4 text-red-600">{error}</div>}

        {activeTab==='drivers' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-bold mb-4">Create Driver</h3>
              <input placeholder="Name" value={newDriver.name} onChange={e=>setNewDriver(s=>({...s,name:e.target.value}))} className="w-full mb-2 p-2 border rounded" />
              <input placeholder="Username" value={newDriver.username} onChange={e=>setNewDriver(s=>({...s,username:e.target.value}))} className="w-full mb-2 p-2 border rounded" />
              <input placeholder="Password" value={newDriver.password} onChange={e=>setNewDriver(s=>({...s,password:e.target.value}))} className="w-full mb-4 p-2 border rounded" />
              <button onClick={createDriver} className="bg-green-600 text-white px-4 py-2 rounded">Add Driver</button>
            </div>

            <div className="md:col-span-2 space-y-4">
              {loading ? <p>Loading...</p> : (
                drivers.map(d => (
                  <div key={d._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{d.name} <span className="text-sm text-gray-500">@{d.username}</span></p>
                      <div className="mt-2 flex gap-2 flex-wrap">
                        {d.assignedBins && d.assignedBins.length>0 ? d.assignedBins.map(b => (
                          <div key={b._id} className="px-3 py-1 bg-gray-100 rounded flex items-center gap-2">
                            <span className="font-medium">{b.binCode}</span>
                            <button onClick={()=>removeBin(d._id,b._id)} className="text-red-500">×</button>
                          </div>
                        )) : <span className="text-gray-500">No bins assigned</span>}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <select onChange={e=>assignBin(d._id,e.target.value)} className="p-2 border rounded">
                        <option value="">Assign bin</option>
                        {dustbins.map(b=> <option key={b._id} value={b._id}>{b.binCode}</option>)}
                      </select>
                      <button onClick={()=>removeDriver(d._id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab==='dustbins' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded shadow">
              <h3 className="font-bold mb-4">Add Dustbin</h3>
              <input placeholder="Bin Code" value={newBin.binCode} onChange={e=>setNewBin(s=>({...s,binCode:e.target.value}))} className="w-full mb-2 p-2 border rounded" />
              <input placeholder="Lat" value={newBin.lat} onChange={e=>setNewBin(s=>({...s,lat:e.target.value}))} className="w-full mb-2 p-2 border rounded" />
              <input placeholder="Lng" value={newBin.lng} onChange={e=>setNewBin(s=>({...s,lng:e.target.value}))} className="w-full mb-4 p-2 border rounded" />
              <button onClick={createBin} className="bg-green-600 text-white px-4 py-2 rounded">Add Dustbin</button>
            </div>

            <div className="md:col-span-2 space-y-4">
              {dustbins.map(b=> (
                <div key={b._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{b.binCode}</p>
                    <p className="text-sm text-gray-600">{b.location?.lat?.toFixed(4)}, {b.location?.lng?.toFixed(4)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={()=>deleteBin(b._id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
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
