# CleanCity - Technical Documentation

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌─────────────────┐         ┌──────────────────┐          │
│  │  React Frontend │         │   Node.js Backend │         │
│  │  (Vite, TW CSS)│         │   (Express)       │          │
│  └────────┬────────┘         └────────┬─────────┘          │
│           │                            │                    │
│           │◄──────► HTTP/REST ◄──────►│                    │
│           │    & JWT Auth              │                    │
│           │                            │                    │
│  ┌────────┴─────────────────────────────┴────────┐          │
│  │                                                │          │
│  │  ┌──────────────────────────────────────┐     │          │
│  │  │  External APIs                       │     │          │
│  │  ├──────────────────────────────────────┤     │          │
│  │  │ • OSRM (Route Optimization)         │     │          │
│  │  │ • OpenStreetMap (Tiles)             │     │          │
│  │  │ • Leaflet.js (Map Display)          │     │          │
│  │  └──────────────────────────────────────┘     │          │
│  │                                                │          │
│  │  ┌──────────────────────────────────────┐     │          │
│  │  │  MongoDB Database                    │     │          │
│  │  ├──────────────────────────────────────┤     │          │
│  │  │ • Admins                            │     │          │
│  │  │ • Drivers                           │     │          │
│  │  │ • Dustbins                          │     │          │
│  │  │ • Routes (History)                  │     │          │
│  │  └──────────────────────────────────────┘     │          │
│  │                                                │          │
│  └────────────────────────────────────────────────┘          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Algorithm: Route Optimization

### Overview
The system uses a **Nearest Neighbor Algorithm with Priority Weighting** to optimize garbage collection routes.

### Algorithm Steps

1. **Sort by Priority**
   - Primary: Priority level (1-5, where 5 = highest)
   - Secondary: Fill level (0-100%, higher = more urgent)

2. **Greedy Selection Loop**
   ```
   current_location = DEPOT
   visited = {}
   route = []
   
   while unvisited_dustbins exist:
       best_bin = select_nearest_unvisited(
           considering: distance, priority, fill_level
       )
       route.add(best_bin)
       visited.add(best_bin)
       current_location = best_bin.location
   
   route.add(DEPOT)  // Return to depot
   ```

3. **Scoring Function**
   ```
   score = distance × (1 + priority_weight × 0.5 + fill_weight × 0.5)
   
   where:
   - priority_weight = 1 / (priority + 1)
   - fill_weight = 1 - (fill_level / 100)
   
   Lower score = higher priority in selection
   ```

### Example Calculation

Given:
- Dustbins at locations with distances and fill levels
- Current location: DEPOT at (12.9716, 77.5946)

| Bin | Distance | Priority | Fill | Priority Weight | Fill Weight | Score |
|-----|----------|----------|------|-----------------|-------------|-------|
| 1   | 2.5 km   | 3        | 85%  | 0.25            | 0.15        | 3.21  |
| 2   | 3.0 km   | 5        | 60%  | 0.167           | 0.40        | 3.80  |
| 3   | 1.5 km   | 1        | 40%  | 0.50            | 0.60        | 2.25  |

**Selected**: Bin 3 (lowest score)

### Time Complexity
- O(n²) where n = number of dustbins
- Suitable for typical city routes (10-50 stops)

### Space Complexity
- O(n) for storing bins and distances

## Backend Architecture

### Folder Structure
```
backend/
├── controllers/
│   ├── authController.js        # Login, authentication
│   └── driverController.js      # Route creation
├── models/
│   ├── Admin.js                 # Admin schema
│   ├── Driver.js                # Driver schema
│   ├── Dustbin.js               # Dustbin schema
│   └── Route.js                 # Route history
├── routes/
│   ├── authRoutes.js            # /api/auth/*
│   └── driverRoutes.js          # /api/driver/*
├── middleware/
│   └── authMiddleware.js        # JWT verification
├── services/
│   └── routeOptimizer.service.js # Route algorithm
├── database/
│   └── database.js              # MongoDB connection
├── scripts/
│   └── seed.js                  # Database population
└── server.js                    # Entry point
```

### API Endpoints

#### Authentication
```
POST /api/auth/login

Request:
{
  "username": "driver1",
  "password": "driver123"
}

Response (Success):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "driver",
  "userId": "507f1f77bcf86cd799439011",
  "username": "driver1"
}

Response (Error):
{
  "message": "Invalid username or password"
}
```

#### Create Route
```
POST /api/driver/create-route
Headers:
  Authorization: Bearer <token>
  Content-Type: application/json

Response (Success):
{
  "route": [
    { "lat": 12.9716, "lng": 77.5946, "name": "DEPOT" },
    { 
      "lat": 12.9352, 
      "lng": 77.6245, 
      "binCode": "BIN-001",
      "fillLevel": 85,
      "priority": 3
    },
    { 
      "lat": 12.9389, 
      "lng": 77.6050, 
      "binCode": "BIN-002",
      "fillLevel": 60,
      "priority": 2
    },
    { "lat": 12.9716, "lng": 77.5946, "name": "DEPOT" }
  ],
  "visitOrder": ["BIN-001", "BIN-002"],
  "totalDistance": "15.32",
  "totalDuration": "45",
  "routeId": "507f1f77bcf86cd799439012"
}

Response (Error):
{
  "message": "No dustbins assigned to this driver"
}
```

## Frontend Architecture

### Component Tree
```
App
├── Login (/)
│   └── Handles admin/driver authentication
├── DriverDashboard (/driver)
│   ├── MapView
│   │   └── Leaflet map with route markers
│   └── RouteInfo
│       └── Route details, distance, duration
└── AdminDashboard (/admin)
    ├── Overview tab
    ├── Drivers tab
    └── Dustbins tab
```

### Component Details

#### MapView.jsx
- Displays interactive map using Leaflet
- Shows depot and dustbin markers
- Renders route polyline from OSRM
- Custom marker icons (red for depot, green for dustbins)
- Features: Zoom controls, pan, popup info

#### RouteInfo.jsx
- Lists visit order with sequence numbers
- Shows total distance and estimated duration
- Responsive grid layout
- Color-coded priority indicators

#### DriverDashboard.jsx
- Route generation button
- Error handling and loading states
- Route statistics display
- Logout functionality
- Gradient background styling

## Database Schema

### Admin
```javascript
{
  _id: ObjectId,
  name: String,
  username: String (unique),
  password: String (should be hashed),
  createdAt: Date
}
```

### Driver
```javascript
{
  _id: ObjectId,
  name: String,
  username: String (unique),
  password: String (should be hashed),
  assignedBins: [ObjectId],  // References to Dustbin
  createdAt: Date
}
```

### Dustbin
```javascript
{
  _id: ObjectId,
  binCode: String (unique),
  location: {
    lat: Number,
    lng: Number
  },
  fillLevel: Number (0-100),
  priority: Number (1-5),
  createdAt: Date
}
```

### Route
```javascript
{
  _id: ObjectId,
  driver: ObjectId,       // Reference to Driver
  visitOrder: [String],   // Array of bin codes
  totalDistance: Number,  // In km
  totalDuration: Number,  // In minutes
  status: String,         // 'pending', 'in-progress', 'completed'
  createdAt: Date,
  updatedAt: Date
}
```

## Authentication Flow

```
1. User enters credentials
   ↓
2. POST /api/auth/login
   ↓
3. Backend verifies username/password
   ↓
4. Backend creates JWT token
   {
     id: user._id,
     role: 'admin' | 'driver'
   }
   ↓
5. Token sent to frontend
   ↓
6. Frontend stores in localStorage
   ↓
7. Frontend redirects to /admin or /driver
   ↓
8. For protected routes, token sent in header:
   Authorization: Bearer <token>
   ↓
9. Backend verifies JWT and allows access
```

## OSRM Integration

### OSRM API Call
```javascript
// Build coordinates string
const coords = "77.5946,12.9716;77.6245,12.9352;77.6050,12.9389;77.5946,12.9716";

// Make request
fetch(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`)
  .then(res => res.json())
  .then(data => {
    const route = data.routes[0];
    const distance = route.distance / 1000;  // Convert to km
    const duration = route.duration / 60;    // Convert to minutes
    const geometry = route.geometry;          // GeoJSON for polyline
  });
```

### Response Format
```javascript
{
  "code": "Ok",
  "routes": [
    {
      "distance": 15320,           // meters
      "duration": 2700,            // seconds
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [77.5946, 12.9716],
          [77.5950, 12.9720],
          ...
        ]
      },
      "legs": [...],
      "weight": 2700,
      "weight_name": "routability"
    }
  ],
  "waypoints": [...]
}
```

## Performance Optimization

### Route Optimization
- Haversine formula for accurate distance calculation
- O(n²) algorithm suitable for typical city routes
- Caching could be added for repeated routes

### Frontend
- React lazy loading components
- Optimize map rerenders with useMemo
- Debounce API calls

### Backend
- Implement route caching
- Add pagination for large datasets
- Use database indexes on frequently queried fields

## Error Handling

### Backend
```javascript
try {
  // Operation
} catch (error) {
  console.error('Detailed error:', error);
  res.status(500).json({
    message: 'User-friendly message',
    error: error.message  // Only in dev
  });
}
```

### Frontend
- Try-catch in async functions
- User-friendly error messages
- Retry logic for network errors
- Fallback UI if data unavailable

## Security Considerations

- **JWT**: Tokens expire after 24 hours
- **CORS**: Limited to frontend origin
- **HTTPS**: Should be enabled in production
- **Password**: Should be hashed (bcrypt)
- **Rate Limiting**: Should be implemented
- **Input Validation**: Add request validation

## Testing

### Unit Tests
```bash
npm test  # Run tests
```

### Integration Tests
- Test complete login flow
- Test route creation with sample data
- Test error scenarios

### Manual Testing
1. Test authentication
2. Test route generation
3. Test map rendering
4. Test with different user roles
5. Test network errors

## Deployment

### Environment Preparation
```bash
# Build frontend
cd frontend
npm run build  # Creates dist/ folder

# Test production build
npm run preview
```

### Deployment Options
1. **Heroku**: Free tier available
2. **Vercel**: Good for frontend
3. **AWS**: EC2 for backend, S3 for frontend
4. **Azure**: Database + App Service
5. **DigitalOcean**: VPS option

## Future Enhancements

- [ ] Real-time driver tracking with WebSocket
- [ ] Dynamic route updates based on traffic
- [ ] Multiple vehicle routing (TSP)
- [ ] Data analytics dashboard
- [ ] Mobile app (React Native)
- [ ] SMS/Email notifications
- [ ] Cost optimization
- [ ] Machine learning predictions
- [ ] Integration with IoT sensors
- [ ] Offline mode support

---

**Last Updated**: February 2026
**Version**: 1.0.0
