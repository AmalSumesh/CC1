import Driver from '../models/Driver.js';
import Dustbin from '../models/Dustbin.js';
import Route from '../models/Route.js';
import { optimizeRoute } from '../services/routeOptimizer.service.js';

const DEPOT = { lat: 12.9716, lng: 77.5946, name: 'DEPOT' };

/**
 * Create an optimized garbage collection route for the driver
 */
export const createOptimizedRoute = async (req, res) => {
  try {
    console.log('Creating route for driver:', req.user.id);
    
    const driver = await Driver.findById(req.user.id).populate('assignedBins');
    console.log('Driver found:', driver?.username, 'Bins:', driver?.assignedBins?.length);
    
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    if (!driver.assignedBins || driver.assignedBins.length === 0) {
      return res.status(400).json({ message: 'No dustbins assigned to this driver' });
    }

    // Optimize the route based on priority and location
    const optimizedBins = optimizeRoute(driver.assignedBins);
    console.log('Route optimized:', optimizedBins.map(b => b.binCode));

    // Build route with depot at start and end
    const route = [
      DEPOT,
      ...optimizedBins.map(b => ({ 
        lat: b.location.lat, 
        lng: b.location.lng,
        binCode: b.binCode,
        fillLevel: b.fillLevel,
        priority: b.priority
      })),
      DEPOT
    ];

    const visitOrder = optimizedBins.map(b => b.binCode);

    // Create OSRM route string
    const coordsString = route.map(p => `${p.lng},${p.lat}`).join(';');
    console.log('OSRM request:', coordsString);

    // Fetch route details from OSRM
    let totalDistance = 0;
    let totalDuration = 0;

    try {
      const osrmResponse = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`
      );
      const osrmData = await osrmResponse.json();
      console.log('OSRM response:', osrmData.code);

      if (osrmData.routes && osrmData.routes[0]) {
        totalDistance = osrmData.routes[0].distance / 1000; // Convert to km
        totalDuration = osrmData.routes[0].duration / 60; // Convert to minutes
        console.log('Distance:', totalDistance, 'Duration:', totalDuration);
      }
    } catch (error) {
      console.error('OSRM routing error:', error.message);
      // Continue without OSRM data if API fails
    }

    // Save the route to database
    const savedRoute = await Route.create({ 
      driver: driver._id, 
      visitOrder,
      totalDistance: Math.round(totalDistance * 100) / 100,
      totalDuration: Math.ceil(totalDuration)
    });
    console.log('Route saved to database:', savedRoute._id);

    res.json({ 
      route, 
      visitOrder,
      totalDistance: totalDistance > 0 ? totalDistance.toFixed(2) : '0.00',
      totalDuration: totalDuration > 0 ? Math.ceil(totalDuration) : 0,
      routeId: savedRoute._id
    });
  } catch (error) {
    console.error('Error creating optimized route:', error);
    res.status(500).json({ 
      message: 'Error creating optimized route', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};