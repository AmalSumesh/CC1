import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import { useEffect, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom marker icons
const depotIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const dustbinIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

export default function MapView({ route }) {
  const [polyline, setPolyline] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!route || route.length < 2) return

    setLoading(true)
    const coords = route.map(p => `${p.lng},${p.lat}`).join(';')

    fetch(
      `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`
    )
      .then(res => res.json())
      .then(data => {
        if (data.routes && data.routes[0]) {
          const points = data.routes[0].geometry.coordinates.map(
            ([lng, lat]) => [lat, lng]
          )
          setPolyline(points)
        }
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching route:', error)
        setLoading(false)
      })
  }, [route])

  if (!route || route.length === 0) {
    return (
      <div className="col-span-2 h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No route data available</p>
      </div>
    )
  }

  const center = [route[0].lat, route[0].lng]

  return (
    <div className="col-span-2 h-[500px] rounded-lg overflow-hidden shadow-lg">
      {loading && (
        <div className="absolute z-50 bg-white p-4 rounded">Loading route...</div>
      )}
      <MapContainer center={center} zoom={13} className="h-full w-full" scrollWheelZoom={true}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {route.map((point, idx) => (
          <Marker
            key={idx}
            position={[point.lat, point.lng]}
            icon={point.name === 'DEPOT' ? depotIcon : dustbinIcon}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-bold">
                  {point.name === 'DEPOT' ? 'DEPOT (Start/End)' : `Dustbin: ${point.binCode}`}
                </p>
                {point.fillLevel !== undefined && (
                  <p>Fill Level: {point.fillLevel}%</p>
                )}
                {point.priority !== undefined && (
                  <p>Priority: {point.priority}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Lat: {point.lat.toFixed(4)}
                </p>
                <p className="text-xs text-gray-500">
                  Lng: {point.lng.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {polyline.length > 0 && (
          <Polyline positions={polyline} color="blue" weight={3} opacity={0.7} />
        )}
      </MapContainer>
    </div>
  )
}

