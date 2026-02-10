# Troubleshooting & Debugging Guide

## Common Issues and Solutions

### ❌ Backend Won't Start

#### Issue: `Port 5000 already in use`
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solutions**:
1. Kill the process using port 5000
   - Windows: `netstat -ano | findstr :5000` then `taskkill /PID <PID> /F`
   - Mac/Linux: `lsof -i :5000` then `kill -9 <PID>`
2. Or change port in `.env`: `PORT=5001`
3. Or restart your terminal

#### Issue: `Cannot find module`
```
Error: Cannot find module 'mongoose'
```
**Solutions**:
```bash
cd backend
npm install
```

#### Issue: `MongoDB connection failed`
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solutions**:
1. Start MongoDB
   - Windows: Open Services → Find MongoDB → Start
   - Mac: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongodb`
2. Verify connection string in `.env`
3. Check MongoDB is running: `test-mongo` command
4. Use MongoDB Atlas instead (cloud):
   - Sign up at https://www.mongodb.com/cloud/atlas
   - Create cluster
   - Update DB_URI in .env

#### Issue: `dotenv/config not found`
```
Error: Cannot find module 'dotenv/config'
```
**Solutions**:
```bash
cd backend
npm install dotenv
# Ensure first line of server.js is:
# import 'dotenv/config';
```

---

### ❌ Frontend Won't Start

#### Issue: `Port 5173 already in use`
```
Error: EADDRINUSE: address already in use :::5173
```
**Solutions**:
1. Kill the process (similar to backend)
2. Use different port: `VITE_PORT=5174 npm run dev`
3. Check `vite.config.js` for port config

#### Issue: `npm ERR! code ERESOLVE`
```
npm ERR! code ERESOLVE, Could not resolve dependency
```
**Solutions**:
```bash
npm install --legacy-peer-deps
# Or
npm install --force
```

#### Issue: `Tailwind CSS not working`
**Solutions**:
1. Clear cache: `npm run build && npm run dev`
2. Check `src/App.jsx` has tailwind imports
3. Verify `vite.config.js` has tailwind plugin

---

### ❌ Login Issues

#### Issue: Login always fails with valid credentials
**Check**:
1. Database has users: 
   ```bash
   mongosh
   use cleancity
   db.drivers.find()  # Should show driver1
   db.admins.find()   # Should show admin
   ```
2. Run seed script to populate data:
   ```bash
   npm run seed
   ```
3. Check .env `JWT_SECRET` is set

#### Issue: `401 Unauthorized - No token provided`
**Solutions**:
1. Clear browser localStorage: `localStorage.clear()`
2. Login again
3. Check network tab for auth requests
4. Verify token is sent: `Authorization: Bearer <token>`

#### Issue: `401 Unauthorized - Invalid token`
**Solutions**:
1. Token might be expired (24 hour limit)
2. Clear localStorage and login again
3. Verify backend `.env` JWT_SECRET matches
4. Check backend logs for token errors

---

### ❌ Map Issues

#### Issue: Map doesn't display
**Check**:
1. Browser console (F12) for errors
2. Network tab for failed requests
3. Verify Leaflet CSS is loaded:
   ```javascript
   import 'leaflet/dist/leaflet.css'
   ```

#### Issue: Markers not showing
**Solutions**:
1. Check network for marker icon images
2. Verify coordinates are valid (lat between -90 and 90, lng between -180 and 180)
3. Scroll to see markers (they might be outside visible area)

#### Issue: Route polyline not displaying
**Problems**:
1. OSRM API might be down
2. No internet connection
3. Invalid coordinates passed to OSRM

**Debug**:
- Open DevTools Network tab
- Look for `router.project-osrm.org` requests
- Check response status and data
- Try accessing OSRM directly in browser

#### Issue: Too many OSRM requests - API rate limited
**Solutions**:
1. Wait 10-15 minutes (rate limit resets)
2. Reduce number of bins
3. Cache routes locally
4. Use self-hosted OSRM in production

---

### ❌ Route Generation Issues

#### Issue: `No dustbins assigned to this driver`
**Solutions**:
1. Use `npm run seed` to create sample drivers with bins
2. Or manually assign bins in database:
   ```bash
   mongosh
   use cleancity
   db.drivers.updateOne(
     {username: "driver1"},
     {$set: {assignedBins: [...bin IDs...]}}
   )
   ```

#### Issue: Route generation works but no options appear
**Check**:
1. Driver has access token (check localStorage)
2. Backend server is running (`http://localhost:5000/api/health`)
3. Network request succeeded (check Network tab)
4. Check browser console for JavaScript errors

#### Issue: Distance and duration showing as "N/A"
**Possible causes**:
1. OSRM API failed (check network)
2. Invalid route coordinates
3. Coordinates too far apart for routing

**Fix**: 
- Check OSRM response in Network tab
- Verify coordinates are in same region
- Try with sample data from seed script

---

### ❌ Database Issues

#### Issue: Duplicate key error
```
MongoError: E11000 duplicate key error
```
**Solutions**:
```bash
mongosh
use cleancity
# Find duplicates
db.drivers.find({username: "driver1"})
# Clear the collection
db.drivers.deleteMany({})
db.admins.deleteMany({})
# Re-seed
npm run seed
```

#### Issue: Can't connect to MongoDB
**Debug steps**:
1. Check MongoDB is running: `mongosh`
2. Connection string correct: `DB_URI=mongodb://localhost:27017/cleancity`
3. Port 27017 not blocked by firewall
4. Check user permissions (if not local)

---

### 🔧 Debugging Tips

#### Enable Verbose Logging
```javascript
// Backend - in controllers
console.log('User ID:', req.user.id);
console.log('Assigned bins:', driver.assignedBins);
console.log('Optimized route:', optimizedBins);
```

#### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Filter by 'Fetch/XHR'
4. Click on request to see:
   - Request headers (Authorization token)
   - Request body (JSON payload)
   - Response status (200, 401, 500)
   - Response body (error message)

#### Backend Debug
```bash
# Add logs to server.js
console.log('Request received:', req.url);
console.log('User:', req.user);
console.log('Error:', error);

# Check logs while running
npm run dev
```

#### Frontend Debug
```javascript
// Add to components
console.log('Route data:', routeData);
console.log('Error:', error);
console.log('Token:', localStorage.getItem('token'));

// In DevTools Console
localStorage.getItem('token')
fetch('http://localhost:5000/api/health')
```

---

### 🧪 Testing Checklist

Before considering the app ready:

#### Backend
- [ ] Server starts without errors
- [ ] MongoDB connects successfully
- [ ] Seed script runs and creates data
- [ ] `/api/health` endpoint responds
- [ ] Login endpoint accepts valid credentials
- [ ] Login endpoint rejects invalid credentials
- [ ] Route creation endpoint returns valid route
- [ ] CORS headers allow frontend requests

#### Frontend
- [ ] App loads without console errors
- [ ] Login page renders correctly
- [ ] Can login with valid credentials
- [ ] Redirects to correct dashboard
- [ ] Dashboard loads without errors
- [ ] Map displays correctly
- [ ] Can generate route
- [ ] Route markers display on map
- [ ] Distance and duration show
- [ ] Visit order displays correctly

#### Integration
- [ ] Complete login → route creation flow works
- [ ] Error messages display appropriately
- [ ] No console errors during normal usage
- [ ] Can refresh page without losing state
- [ ] Logout works correctly
- [ ] Multiple bin collection shows on map

---

### 🚨 Emergency Fixes

#### Everything broken - Start fresh
```bash
# Stop all servers (Ctrl+C)

# Delete database
mongosh
use cleancity
db.dropDatabase()
exit

# Clear frontend cache
cd frontend
rm -rf node_modules/.vite
npm cache clean --force

# Restart
npm run dev  # terminal 1
cd backend && npm run dev  # terminal 2
npm run seed  # terminal 3
```

#### Clear All Local Data
```javascript
// In browser console
localStorage.clear()
sessionStorage.clear()
indexedDB.deleteDatabase('vite-app')
// Refresh page
```

#### Reset Database
```bash
mongosh
use cleancity
db.dropDatabase()
exit

npm run seed  # Repopulate
```

---

### 📊 Performance Debugging

#### Slow Route Generation
1. Check OSRM API response time (Network tab)
2. Check database query speed
3. Check if many bins assigned
4. Reduce number of bins

#### Map Loading Slowly
1. Check OpenStreetMap tiles loading
2. Check Leaflet libraries loading
3. Verify internet connection
4. Check browser memory usage

#### Page Freezing
1. Check for infinite loops in code
2. Look for memory leaks in DevTools
3. Check for excessive renders in React
4. Use React DevTools to profile

---

### 📞 Getting Help

If you still have issues:

1. **Check the logs**
   - Backend console
   - Browser console (F12)
   - Network tab

2. **Review documentation**
   - SETUP_GUIDE.md
   - QUICK_START.md
   - TECHNICAL_DOCS.md

3. **Verify configuration**
   - .env file contents
   - MongoDB connection
   - Port availability

4. **Check sample data**
   - Run `npm run seed`
   - Verify data exists in database

5. **Try the sample flow**
   - Use credentials from seed script
   - Login as driver1 / driver123
   - Create a route

6. **Update dependencies**
   ```bash
   npm update
   npm audit fix
   ```

---

### 🎓 Understanding the Flow

```
User Login
    ↓
POST /api/auth/login
    ↓
Backend verifies credentials
    ↓
Generate JWT token
    ↓
Frontend stores token in localStorage
    ↓
Redirect to dashboard
    ↓
POST /api/driver/create-route (with token)
    ↓
Backend finds driver and assigned bins
    ↓
Optimization algorithm creates route
    ↓
OSRM API called for distances
    ↓
Frontend receives route data
    ↓
Map displays with markers and polyline
    ↓
User sees optimized route!
```

### If any step fails, check that step's error message in console.

---

**Last Updated**: February 2026
**Version**: 1.0.0
