/**
 * RANSAC Helper Functions
 * Auto-detection for pipes (cylinders) and planes
 */

(function() {
  'use strict';
  
  /**
   * Detect pipe/cylinder using RANSAC
   * @param {Array} points - Array of {x, y, z}
   * @param {Object} options - Configuration options
   * @returns {Object|null} Detected cylinder or null
   */
  function detectCylinder(points, options = {}) {
    const {
      maxIterations = 1000,
      inlierThreshold = 0.05,
      minInliers = 50
    } = options;
    
    if (points.length < 10) return null;
    
    let bestCylinder = null;
    let bestInliers = [];
    
    for (let i = 0; i < maxIterations; i++) {
      // Randomly sample 3 points
      const sample = getRandomSample(points, 3);
      
      // Fit cylinder through these points
      const cylinder = fitCylinder(sample);
      if (!cylinder) continue;
      
      // Count inliers (points close to cylinder)
      const inliers = [];
      for (const point of points) {
        const distance = distanceToCylinder(point, cylinder);
        if (distance < inlierThreshold) {
          inliers.push(point);
        }
      }
      
      // Update best model
      if (inliers.length >= minInliers && inliers.length > bestInliers.length) {
        bestInliers = inliers;
        bestCylinder = cylinder;
      }
    }
    
    if (bestCylinder && bestInliers.length >= minInliers) {
      return {
        type: 'cylinder',
        model: bestCylinder,
        inliers: bestInliers,
        confidence: bestInliers.length / points.length
      };
    }
    
    return null;
  }
  
  /**
   * Fit cylinder through 3 points
   * @param {Array} points - 3 points
   * @returns {Object|null} Cylinder model or null
   */
  function fitCylinder(points) {
    if (points.length !== 3) return null;
    
    const [p1, p2, p3] = points;
    
    // Calculate axis direction (direction of line through p1 and p2)
    const axis = {
      x: p2.x - p1.x,
      y: p2.y - p1.y,
      z: p2.z - p1.z
    };
    
    const length = Math.sqrt(axis.x ** 2 + axis.y ** 2 + axis.z ** 2);
    if (length < 0.001) return null;
    
    // Normalize axis
    axis.x /= length;
    axis.y /= length;
    axis.z /= length;
    
    // Calculate radius (perpendicular distance from p3 to axis)
    const v = {
      x: p3.x - p1.x,
      y: p3.y - p1.y,
      z: p3.z - p1.z
    };
    
    const dot = v.x * axis.x + v.y * axis.y + v.z * axis.z;
    const proj = {
      x: p1.x + dot * axis.x,
      y: p1.y + dot * axis.y,
      z: p1.z + dot * axis.z
    };
    
    const radius = Math.sqrt(
      (p3.x - proj.x) ** 2 + (p3.y - proj.y) ** 2 + (p3.z - proj.z) ** 2
    );
    
    if (radius < 0.01 || radius > 10) return null;
    
    return {
      axis: axis,
      point: p1,
      radius: radius,
      length: length
    };
  }
  
  /**
   * Calculate distance from point to cylinder
   * @param {Object} point - {x, y, z}
   * @param {Object} cylinder - Cylinder model
   * @returns {number} Distance
   */
  function distanceToCylinder(point, cylinder) {
    const v = {
      x: point.x - cylinder.point.x,
      y: point.y - cylinder.point.y,
      z: point.z - cylinder.point.z
    };
    
    const dot = v.x * cylinder.axis.x + v.y * cylinder.axis.y + v.z * cylinder.axis.z;
    const proj = {
      x: cylinder.point.x + dot * cylinder.axis.x,
      y: cylinder.point.y + dot * cylinder.axis.y,
      z: cylinder.point.z + dot * cylinder.axis.z
    };
    
    const distance = Math.sqrt(
      (point.x - proj.x) ** 2 + (point.y - proj.y) ** 2 + (point.z - proj.z) ** 2
    );
    
    return Math.abs(distance - cylinder.radius);
  }
  
  /**
   * Detect plane using RANSAC
   * @param {Array} points - Array of {x, y, z}
   * @param {Object} options - Configuration options
   * @returns {Object|null} Detected plane or null
   */
  function detectPlane(points, options = {}) {
    const {
      maxIterations = 1000,
      inlierThreshold = 0.1,
      minInliers = 50
    } = options;
    
    if (points.length < 10) return null;
    
    let bestPlane = null;
    let bestInliers = [];
    
    for (let i = 0; i < maxIterations; i++) {
      // Randomly sample 3 points
      const sample = getRandomSample(points, 3);
      
      // Fit plane through these points
      const plane = fitPlane(sample);
      if (!plane) continue;
      
      // Count inliers
      const inliers = [];
      for (const point of points) {
        const distance = distanceToPlane(point, plane);
        if (distance < inlierThreshold) {
          inliers.push(point);
        }
      }
      
      // Update best model
      if (inliers.length >= minInliers && inliers.length > bestInliers.length) {
        bestInliers = inliers;
        bestPlane = plane;
      }
    }
    
    if (bestPlane && bestInliers.length >= minInliers) {
      return {
        type: 'plane',
        model: bestPlane,
        inliers: bestInliers,
        confidence: bestInliers.length / points.length
      };
    }
    
    return null;
  }
  
  /**
   * Fit plane through 3 points
   * @param {Array} points - 3 points
   * @returns {Object|null} Plane model or null
   */
  function fitPlane(points) {
    if (points.length !== 3) return null;
    
    const [p1, p2, p3] = points;
    
    // Calculate normal vector
    const v1 = { x: p2.x - p1.x, y: p2.y - p1.y, z: p2.z - p1.z };
    const v2 = { x: p3.x - p1.x, y: p3.y - p1.y, z: p3.z - p1.z };
    
    const normal = {
      x: v1.y * v2.z - v1.z * v2.y,
      y: v1.z * v2.x - v1.x * v2.z,
      z: v1.x * v2.y - v1.y * v2.x
    };
    
    const length = Math.sqrt(normal.x ** 2 + normal.y ** 2 + normal.z ** 2);
    if (length < 0.001) return null;
    
    // Normalize normal
    normal.x /= length;
    normal.y /= length;
    normal.z /= length;
    
    // Calculate d in ax + by + cz + d = 0
    const d = -(normal.x * p1.x + normal.y * p1.y + normal.z * p1.z);
    
    return {
      normal: normal,
      d: d,
      point: p1
    };
  }
  
  /**
   * Calculate distance from point to plane
   * @param {Object} point - {x, y, z}
   * @param {Object} plane - Plane model
   * @returns {number} Distance
   */
  function distanceToPlane(point, plane) {
    return Math.abs(
      plane.normal.x * point.x + 
      plane.normal.y * point.y + 
      plane.normal.z * point.z + 
      plane.d
    );
  }
  
  /**
   * Get random sample from array
   * @param {Array} array - Source array
   * @param {number} size - Sample size
   * @returns {Array} Sample array
   */
  function getRandomSample(array, size) {
    const shuffled = array.slice().sort(() => 0.5 - Math.random());
    return shuffled.slice(0, size);
  }
  
  // Export to global scope
  window.RANSACHelpers = {
    detectCylinder,
    detectPlane,
    fitCylinder,
    fitPlane,
    distanceToCylinder,
    distanceToPlane
  };
  
})();

