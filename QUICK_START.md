# Quick Start Guide

Follow these steps to get CleanCity running on your machine.

## Prerequisites

- **Node.js** (v16 or higher) - Download from https://nodejs.org/
- **MongoDB** (Community Edition) - Download from https://www.mongodb.com/try/download/community
- **Git** (optional) - For version control

## Step 1: Start MongoDB

### Windows
1. If installed locally, MongoDB should start automatically
2. Or run: `mongod` in command prompt
3. Verify connection at `mongodb://localhost:27017`

### Alternative: Use MongoDB Atlas (Cloud)
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `DB_URI` in backend `.env`

## Step 2: Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and set your values (MongoDB URI, JWT Secret, etc.)
# Default values are already set in .env.example

# Seed database with sample data
npm run seed

# Start development server
npm run dev
```

Backend will run on: `http://localhost:5000`

## Step 3: Setup Frontend

```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on: `http://localhost:5173`

## Step 4: Login and Test

1. Open browser: `http://localhost:5173`
2. Use demo credentials:
   - **Driver**: username: `driver1`, password: `driver123`
   - **Admin**: username: `admin`, password: `admin123`
3. Click "Create Optimized Route" as a driver to see the system in action

## Testing the Flow

### As a Driver:
1. Login with driver1 credentials
2. See the Driver Dashboard
3. Click "Create Optimized Route"
4. View the optimized route on the map
5. See distance, duration, and visit order

### As Admin:
1. Login with admin credentials
2. See system overview and statistics
3. View driver and dustbin management (UI ready for backend integration)

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: 
- Ensure MongoDB is running
- Check `DB_URI` in `.env` matches your MongoDB setup
- Try: `mongod` in terminal

### Port Already in Use
```
Port 5000 or 5173 already in use
```
**Solution**:
- Kill the process using that port
- Or change `PORT` in backend `.env`
- Or use different Vite port in `vite.config.js`

### Token Expiration
Clear localStorage and login again:
```javascript
localStorage.clear()
```

### Map Not Displaying
- Check internet connection (needs OSRM and OpenStreetMap APIs)
- Open browser console for errors
- Try refreshing the page

## API Documentation

### Authentication
```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "driver1",
  "password": "driver123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "role": "driver",
  "userId": "...",
  "username": "driver1"
}
```

### Create Route (Requires Auth)
```bash
POST /api/driver/create-route
Authorization: Bearer <token>

Response:
{
  "route": [...],
  "visitOrder": ["BIN-001", "BIN-002", ...],
  "totalDistance": "15.32",
  "totalDuration": "45",
  "routeId": "..."
}
```

## Project Structure

```
CleanCity/
├── backend/          # Express.js server
│   ├── controllers/  # Business logic
│   ├── models/       # MongoDB schemas
│   ├── routes/       # API endpoints
│   ├── middleware/   # Auth, CORS, etc.
│   ├── services/     # Route optimization
│   ├── scripts/      # Database seed
│   └── server.js     # Entry point
│
└── frontend/         # React + Vite app
    ├── src/
    │   ├── components/   # Reusable UI
    │   ├── pages/        # Page components
    │   ├── api/          # HTTP client
    │   └── App.jsx       # Main component
    └── package.json
```

## Development Tips

### Hot Reload
- Frontend: Auto-reloads on file change (Vite)
- Backend: Auto-reloads on file change (Nodemon)

### Debug Backend
```javascript
// Add console.log in controllers
console.log('Creating route for driver:', req.user.id);
```

### Debug Frontend
- Open DevTools: F12 or Ctrl+Shift+I
- Check Console tab for errors
- Check Network tab for API calls

### MongoDB Tips
```bash
# Connect to MongoDB CLI
mongosh

# Show all databases
show dbs

# Use cleancity database
use cleancity

# Show collections
show collections

# View all drivers
db.drivers.find()

# Clear database
db.drivers.deleteMany({})
```

## Next Steps

1. **Enhance Admin Dashboard** - Add driver/dustbin management endpoints
2. **Add Real-time Tracking** - WebSocket integration for live driver location
3. **Implement Update Route** - Allow drivers to update route status
4. **Add Analytics** - Charts and statistics for admin
5. **Mobile App** - React Native version

## Support

For issues or questions:
1. Check logs in terminal
2. Review browser console (F12)
3. Check `.env` configuration
4. Verify MongoDB connection
5. Restart development servers

## Environment Variables Reference

```env
# Backend (.env)
PORT=5000                                          # Server port
DB_URI=mongodb://localhost:27017/cleancity        # MongoDB URI
JWT_SECRET=your_super_secret_jwt_key              # JWT signing key
NODE_ENV=development                              # Environment
```

## Production Deployment

Before deploying:
1. Change `JWT_SECRET` to a strong random value
2. Hash passwords in database
3. Enable HTTPS
4. Set `NODE_ENV=production`
5. Update CORS origin to production domain
6. Use production MongoDB URI
7. Add rate limiting
8. Implement proper error logging

Happy coding! 🚀
