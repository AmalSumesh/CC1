# 🌍 CleanCity - AI-Based Garbage Routing System

> An intelligent waste management solution using AI optimization, real-time mapping, and dynamic route generation for efficient garbage collection.

![Status](https://img.shields.io/badge/status-active-success)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-ISC-green)

## 🎯 Overview

CleanCity is a modern web application that intelligently optimizes garbage collection routes using AI algorithms. The system integrates real-time mapping, route optimization, and driver management to streamline waste collection operations.

### Key Features
- ✨ **Dual Authentication**: Separate admin and driver login systems
- 🤖 **AI Route Optimization**: Smart algorithms that minimize collection time and distance
- 🗺️ **Interactive Maps**: Real-time visualization using Leaflet and OpenStreetMap
- 📍 **OSRM Integration**: Accurate distance calculations using routing algorithms
- 📊 **Admin Dashboard**: System overview and resource management
- 🚗 **Driver Interface**: Simple, intuitive route management

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- Modern web browser

### Installation (< 5 minutes)

```bash
# 1. Clone and setup backend
cd backend
npm install
npm run seed    # Populate with demo data
npm run dev     # Starts on http://localhost:5000

# 2. Setup frontend (new terminal)
cd frontend
npm install
npm run dev     # Starts on http://localhost:5173
```

### Login with Demo Credentials
- **Driver**: `driver1` / `driver123`
- **Admin**: `admin` / `admin123`

### Test the System
1. Click "Create Optimized Route" as a driver
2. View the AI-optimized route on the map
3. See collected statistics (distance, time, stops)

## 📚 Documentation

### Getting Started
- 📖 **[QUICK_START.md](QUICK_START.md)** - Fast setup guide (recommended first read)
- 📋 **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Complete installation & configuration
- 🔧 **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues & solutions

### Development
- 📐 **[TECHNICAL_DOCS.md](TECHNICAL_DOCS.md)** - Architecture, algorithms, API details
- ✅ **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - What was built and changed

## 🏗️ Architecture

```
┌─────────────────┐         ┌──────────────────┐
│ React Frontend  │◄───────►│ Express Backend  │
│ (Vite, TW CSS)  │         │ (Node.js)        │
└─────────────────┘         └──────────────────┘
        │                            │
        │                            │
        ▼                            ▼
    Leaflet.js          MongoDB Database
    OpenStreetMap       Route History
    OSRM API            User Management
```

## 🎮 How It Works

### For Drivers
1. **Login** with driver credentials
2. **View Dashboard** with assigned routes
3. **Generate Route** with one click
4. **View Optimized Path** on interactive map
5. **See Statistics** - distance, time, stops

### For Admins
1. **Login** with admin credentials
2. **Monitor System** overview and status
3. **Manage Drivers** - view assignments
4. **Manage Dustbins** - view locations and fill levels

## 🤖 Smart Route Optimization

The system uses a **Nearest Neighbor Algorithm** with priority weighting:

- Considers dustbin **priority level** (1-5)
- Factors in **fill level** (0-100%)
- Calculates **actual road distances** via OSRM
- Minimizes total collection time
- Optimizes for efficiency

## 🛠️ Tech Stack

### Backend
```
Express.js       - Web server
MongoDB          - Database
JWT              - Authentication
Node.js          - Runtime
```

### Frontend
```
React 19         - UI framework
Vite             - Build tool
Leaflet.js       - Maps
Tailwind CSS     - Styling
Axios            - HTTP client
```

### External Services
```
OSRM             - Route optimization
OpenStreetMap    - Map tiles
MongoDB Atlas    - Cloud database (optional)
```

## 📁 Project Structure

```
CleanCity/
├── backend/
│   ├── controllers/       # Business logic
│   ├── models/            # Database schemas
│   ├── routes/            # API endpoints
│   ├── middleware/        # Auth, logging, etc.
│   ├── services/          # Route optimization
│   ├── scripts/           # Database seeding
│   └── server.js          # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Full page components
│   │   ├── api/           # HTTP configuration
│   │   └── App.jsx        # Main app
│   └── package.json
│
└── Documentation Files
    ├── QUICK_START.md          # ⭐ Start here!
    ├── SETUP_GUIDE.md
    ├── TECHNICAL_DOCS.md
    ├── TROUBLESHOOTING.md
    └── IMPLEMENTATION_SUMMARY.md
```

## 🔌 API Endpoints

```bash
# Authentication
POST /api/auth/login
  → Login for admin/driver

# Driver Routes
POST /api/driver/create-route
  → Generate optimized garbage collection route

# Health Check
GET /api/health
  → Server status
```

**Full API documentation** in [TECHNICAL_DOCS.md](TECHNICAL_DOCS.md)

## 🗄️ Database Schema

### Collections
- **admins** - Admin accounts
- **drivers** - Driver accounts and assigned bins
- **dustbins** - Garbage bin locations and status
- **routes** - Historical route data

**Detailed schema** in [TECHNICAL_DOCS.md](TECHNICAL_DOCS.md)

## ⚙️ Configuration

### Backend `.env`
```env
PORT=5000
DB_URI=mongodb://localhost:27017/cleancity
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

See `backend/.env.example` as template

## 🧪 Running Tests

```bash
# Backend
cd backend
npm run seed    # Seed database with test data

# With sample data, try:
# 1. Login as driver1/driver123
# 2. Click "Create Optimized Route"
# 3. Verify route displays on map
```

## 🐛 Troubleshooting

Having issues? Check these files in order:

1. **[QUICK_START.md](QUICK_START.md)** - Setup issues
2. **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common problems
3. **[TECHNICAL_DOCS.md](TECHNICAL_DOCS.md)** - Detailed info

## 📈 Performance

- **Route Optimization**: O(n²) - suitable for 10-100 bins per route
- **OSRM API**: ~500ms response time
- **Database Queries**: Optimized with indexes
- **Frontend**: Instant response with React

## 🔐 Security

- JWT-based authentication
- Password validation
- CORS configured
- Input validation
- Secure headers

**Production tips** in [TECHNICAL_DOCS.md](TECHNICAL_DOCS.md)

## 🚢 Deployment

Ready to deploy? See **[TECHNICAL_DOCS.md](TECHNICAL_DOCS.md)** deployment section:
- Heroku
- Vercel
- AWS
- Azure
- DigitalOcean

## 📝 License

ISC - See LICENSE file

## 🎓 Learning Resources

### Algorithm Understanding
- Read [route optimization algorithm](TECHNICAL_DOCS.md#algorithm-route-optimization) section
- See complexity analysis and examples

### API Development
- Review [API endpoints](TECHNICAL_DOCS.md#api-endpoints) documentation
- Check request/response examples

### Frontend Architecture
- Study [component tree](TECHNICAL_DOCS.md#frontend-architecture)
- Understand data flow

## 🤝 Contributing

To improve CleanCity:
1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit pull request

## 📞 Support

Having trouble? Try these resources in order:

1. **[QUICK_START.md](QUICK_START.md)** ← Start here for setup
2. **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** ← Common issues
3. **[TECHNICAL_DOCS.md](TECHNICAL_DOCS.md)** ← Deep dive
4. Check browser console (F12) for errors
5. Check backend terminal for logs

## 🎯 Future Roadmap

- [ ] Real-time driver tracking
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-vehicle routing
- [ ] Traffic-aware routing
- [ ] IoT sensor integration
- [ ] SMS/Email notifications
- [ ] Cost optimization
- [ ] Offline mode

## 📊 System Status

```
✅ Backend        - Fully functional
✅ Frontend       - Fully functional
✅ Database       - Configured
✅ Authentication - Working
✅ Route Optimization - Operational
✅ Map Display    - Functional
✅ OSRM Integration - Active
```

**Version**: 1.0.0  
**Last Updated**: February 2026  
**Status**: Production Ready

---

## 🎯 Next Steps

1. **First Time?** → Read [QUICK_START.md](QUICK_START.md)
2. **Want Details?** → Read [TECHNICAL_DOCS.md](TECHNICAL_DOCS.md)
3. **Having Issues?** → Read [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
4. **Need Setup Help?** → Read [SETUP_GUIDE.md](SETUP_GUIDE.md)

---

<div align="center">

**Made with ❤️ for efficient waste management**

[Quick Start](QUICK_START.md) • [Documentation](SETUP_GUIDE.md) • [Technical](TECHNICAL_DOCS.md) • [Troubleshooting](TROUBLESHOOTING.md)

</div>
