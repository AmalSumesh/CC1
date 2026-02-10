# CleanCity - AI-Based Garbage Routing System

An intelligent garbage collection routing system that optimizes waste collection paths using AI algorithms, OpenStreetMap, OSRM, and Leaflet.js.

## Features

✅ **Dual Authentication System**
- Admin Login: Manage drivers and dustbin locations
- Driver Login: View optimized routes and collect garbage

✅ **AI-Powered Route Optimization**
- Nearest neighbor algorithm with priority consideration
- Considers fill level and priority of dustbins
- Minimizes distance and collection time

✅ **Interactive Map Visualization**
- Real-time route display using Leaflet.js
- OpenStreetMap integration for accurate geographic data
- OSRM routing for precise distance and duration calculations

✅ **Route Management**
- Automatic route generation for assigned dustbins
- Total distance and estimated time calculations
- Visit order optimization

## Project Structure

```
CleanCity/
├── backend/
│   ├── controllers/
│   │   ├── authController.js      # Authentication logic
│   │   └── driverController.js    # Driver route logic
│   ├── models/
│   │   ├── Admin.js               # Admin schema
│   │   ├── Driver.js              # Driver schema
│   │   ├── Dustbin.js             # Dustbin schema
│   │   └── Route.js               # Route schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── driverRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT authentication
│   ├── services/
│   │   └── routeOptimizer.service.js  # Route optimization algorithm
│   ├── database/
│   │   └── database.js            # MongoDB connection
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── MapView.jsx        # Interactive map display
    │   │   └── RouteInfo.jsx      # Route details display
    │   ├── pages/
    │   │   ├── Login.jsx          # Login page
    │   │   ├── AdminDashboard.jsx
    │   │   └── DriverDashboard.jsx
    │   ├── api/
    │   │   └── axios.js           # API configuration
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

## Installation & Setup

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

Configure your `.env` file:
```
PORT=5000
DB_URI=mongodb://localhost:27017/cleancity
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
```

**Install MongoDB** (if not already installed):
- Download from https://www.mongodb.com/try/download/community
- Or use MongoDB Atlas (Cloud): https://www.mongodb.com/cloud/atlas

Start the backend server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- **POST** `/api/auth/login` - Login (admin or driver)
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```

### Driver Routes
- **POST** `/api/driver/create-route` - Generate optimized route
  - Requires: JWT Token in Authorization header
  - Returns: Optimized route with coordinates, visit order, distance, and duration

## Demo Credentials

### Admin
- Username: `admin`
- Password: `admin123`

### Driver
- Username: `driver1`
- Password: `driver123`

## How to Use

### For Drivers:
1. Login with driver credentials
2. Click "Create Optimized Route"
3. View the optimized route on the map
4. See the visit order and route statistics
5. Follow the optimized path for garbage collection

### For Admins:
1. Login with admin credentials
2. Manage drivers and dustbin assignments
3. Monitor collection activities

## Technology Stack

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **Mongoose** - ORM for MongoDB

### Frontend
- **React.js** - UI framework
- **Vite** - Build tool
- **React Router** - Routing
- **Leaflet.js** - Map visualization
- **React-Leaflet** - React wrapper for Leaflet
- **Axios** - HTTP client
- **Tailwind CSS** - Styling

### External APIs
- **OpenStreetMap** - Map tiles
- **OSRM (Open Source Routing Machine)** - Route optimization

## Route Optimization Algorithm

The system uses a **Nearest Neighbor Algorithm** with priority weighting:

1. **Sort by Priority**: Dustbins are weighted by:
   - Priority level (higher = more important)
   - Fill level (higher = more urgent)

2. **Greedy Selection**: From current location, select the next nearest dustbin that:
   - Minimizes distance
   - Considers fill level and priority
   - Hasn't been visited yet

3. **Return to Depot**: After all dustbins, return to the starting depot

## Distance and Duration Calculation

- **Distance**: Calculated using OSRM routing API (road network distance)
- **Duration**: Estimated time considering:
  - Road network travel time
  - Collection time at each dustbin

## Error Handling

- Invalid credentials show appropriate error messages
- Missing assigned dustbins are handled gracefully
- OSRM API failures don't crash the system
- Network errors are caught and displayed to users

## Future Enhancements

- [ ] Real-time driver tracking
- [ ] Dynamic route updates based on traffic
- [ ] Multiple vehicle routing
- [ ] Advanced analytics dashboard
- [ ] Mobile app for drivers
- [ ] Integration with garbage collection sensors
- [ ] Cost optimization
- [ ] Multi-depot support

## Troubleshooting

### MongoDB Connection Failed
- Ensure MongoDB service is running
- Check DB_URI in .env file
- Verify network connectivity

### OSRM Route Not Displaying
- Check internet connection
- OSRM API might be temporarily unavailable
- Try refreshing the page

### Token Expired
- Clear local storage and login again
- Check JWT_SECRET in backend .env

### CORS Errors
- Ensure backend CORS is configured for http://localhost:5173
- Check server.js CORS settings

## License

© 2026 CleanCity. All rights reserved.

## Support

For issues or questions, please contact the development team or create an issue in the repository.
