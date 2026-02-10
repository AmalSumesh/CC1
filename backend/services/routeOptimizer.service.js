/**
 * Route Optimizer Service
 * Uses a nearest neighbor algorithm with priority consideration
 */

const DEPOT = { lat: 12.9716, lng: 77.5946 };

// Calculate distance between two points (Haversine formula)
const calculateDistance = (point1, point2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((point2.lat - point1.lat) * Math.PI) / 180;
  const dLng = ((point2.lng - point1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((point1.lat * Math.PI) / 180) *
      Math.cos((point2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Optimize route using nearest neighbor algorithm with priority consideration
 * @param {Array} dustbins - Array of dustbin objects with location, fillLevel, priority
 * @returns {Array} - Optimized order of dustbins
 */
export const optimizeRoute = (dustbins) => {
  if (!dustbins || dustbins.length === 0) {
    return [];
  }

  // Sort by priority (higher first) and fill level (higher first)
  const sortedByPriority = [...dustbins].sort(
    (a, b) => b.priority - a.priority || b.fillLevel - a.fillLevel
  );

  const optimizedRoute = [];
  const visited = new Set();
  let currentLocation = DEPOT;

  // Greedy nearest neighbor algorithm with priority weighting
  while (visited.size < sortedByPriority.length) {
    let nextBin = null;
    let minScore = Infinity;

    for (const bin of sortedByPriority) {
      if (visited.has(bin._id?.toString())) continue;

      const distance = calculateDistance(currentLocation, {
        lat: bin.location.lat,
        lng: bin.location.lng,
      });

      // Score considers distance and priority
      // Lower score = better choice
      const priorityWeight = 1 / (bin.priority + 1); // Lower priority weight = higher priority
      const fillWeight = 1 - bin.fillLevel / 100; // Lower fill weight = more full
      const score = distance * (1 + priorityWeight * 0.5 + fillWeight * 0.5);

      if (score < minScore) {
        minScore = score;
        nextBin = bin;
      }
    }

    if (nextBin) {
      optimizedRoute.push(nextBin);
      visited.add(nextBin._id?.toString());
      currentLocation = {
        lat: nextBin.location.lat,
        lng: nextBin.location.lng,
      };
    }
  }

  return optimizedRoute;
};
