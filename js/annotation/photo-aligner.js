/**
 * Photo-Aligner Module
 * Handles photo-to-3D coordinate mapping, camera intrinsics, and selection
 * Based on your Flutter lidar_photo_fusion.dart implementation
 */

(function() {
  'use strict';
  
  /**
   * Camera pose and intrinsics
   */
  class CameraPose {
    constructor(options) {
      this.position = options.position || { x: 0, y: 0, z: 0 };
      this.rotation = options.rotation || { x: 0, y: 0, z: 0 }; // Euler angles in radians
      this.fov = options.fov || 60.0; // Field of view in degrees
      this.intrinsics = options.intrinsics || null; // Optional: full camera matrix
      
      // Intrinsics matrix (K)
      // [fx  0  cx]
      // [ 0 fy  cy]
      // [ 0  0   1]
      this.fx = options.fx;
      this.fy = options.fy;
      this.cx = options.cx;
      this.cy = options.cy;
    }
    
    /**
     * Create from JSON
     */
    static fromJSON(json) {
      return new CameraPose({
        position: json.position,
        rotation: json.rotation,
        fov: json.fov,
        fx: json.fx,
        fy: json.fy,
        cx: json.cx,
        cy: json.cy,
        intrinsics: json.intrinsics
      });
    }
  }
  
  /**
   * Project 3D point to 2D image coordinates
   * Based on lidar_photo_fusion.dart _projectPointToImage
   * 
   * @param {Object} point - {x, y, z}
   * @param {CameraPose} cameraPose - Camera pose and parameters
   * @param {number} imageWidth - Image width in pixels
   * @param {number} imageHeight - Image height in pixels
   * @returns {Object|null} Projected 2D point {x, y} or null if behind camera
   */
  function projectPointToImage(point, cameraPose, imageWidth, imageHeight) {
    // Transform to camera space
    const toCameraSpace = {
      x: point.x - cameraPose.position.x,
      y: point.y - cameraPose.position.y,
      z: point.z - cameraPose.position.z
    };
    
    // Apply rotation (Euler angles)
    const rotated = applyRotation(toCameraSpace, cameraPose.rotation);
    
    // Check if point is in front of camera
    if (rotated.z <= 0) return null;
    
    // Perspective projection
    let x, y;
    
    if (cameraPose.intrinsics) {
      // Use provided intrinsics matrix
      const K = cameraPose.intrinsics;
      x = (K[0] * rotated.x / rotated.z) + K[2];
      y = (K[4] * rotated.y / rotated.z) + K[5];
    } else if (cameraPose.fx && cameraPose.fy && cameraPose.cx && cameraPose.cy) {
      // Use explicit focal length and principal point
      x = (rotated.x / rotated.z) * cameraPose.fx + cameraPose.cx;
      y = (rotated.y / rotated.z) * cameraPose.fy + cameraPose.cy;
    } else {
      // Fallback: use FOV
      const fov = cameraPose.fov || 60.0;
      const focalLength = imageWidth / (2.0 * Math.tan(fov * Math.PI / 360.0));
      x = (rotated.x / rotated.z) * focalLength + imageWidth / 2.0;
      y = (rotated.y / rotated.z) * focalLength + imageHeight / 2.0;
    }
    
    return { x, y };
  }
  
  /**
   * Apply rotation matrix to point (from Euler angles)
   * 
   * @param {Object} point - {x, y, z}
   * @param {Object} rotation - {x, y, z} Euler angles in radians
   * @returns {Object} Rotated point {x, y, z}
   */
  function applyRotation(point, rotation) {
    const { x: rx, y: ry, z: rz } = rotation;
    
    // Rotation around X axis
    const cosX = Math.cos(-rx);
    const sinX = Math.sin(-rx);
    const x1 = point.x;
    const y1 = point.y * cosX - point.z * sinX;
    const z1 = point.y * sinX + point.z * cosX;
    
    // Rotation around Y axis
    const cosY = Math.cos(-ry);
    const sinY = Math.sin(-ry);
    const x2 = x1 * cosY - z1 * sinY;
    const y2 = y1;
    const z2 = x1 * sinY + z1 * cosY;
    
    // Rotation around Z axis
    const cosZ = Math.cos(-rz);
    const sinZ = Math.sin(-rz);
    const x3 = x2 * cosZ - y2 * sinZ;
    const y3 = x2 * sinZ + y2 * cosZ;
    const z3 = z2;
    
    return { x: x3, y: y3, z: z3 };
  }
  
  /**
   * Unproject 2D image coordinate to 3D ray
   * Inverse of projectPointToImage
   * 
   * @param {Object} imagePoint - {x, y} in pixels
   * @param {CameraPose} cameraPose - Camera pose
   * @param {number} imageWidth - Image width
   * @param {number} imageHeight - Image height
   * @param {number} depth - Optional depth estimate
   * @returns {Object} 3D ray {origin, direction} or point if depth provided
   */
  function unprojectImageTo3D(imagePoint, cameraPose, imageWidth, imageHeight, depth = null) {
    const { x: imgX, y: imgY } = imagePoint;
    
    // Convert pixel coords to normalized camera coords
    let camX, camY;
    
    if (cameraPose.intrinsics) {
      const K = cameraPose.intrinsics;
      camX = (imgX - K[2]) / K[0];
      camY = (imgY - K[5]) / K[4];
    } else if (cameraPose.fx && cameraPose.fy && cameraPose.cx && cameraPose.cy) {
      camX = (imgX - cameraPose.cx) / cameraPose.fx;
      camY = (imgY - cameraPose.cy) / cameraPose.fy;
    } else {
      const fov = cameraPose.fov || 60.0;
      const focalLength = imageWidth / (2.0 * Math.tan(fov * Math.PI / 360.0));
      camX = (imgX - imageWidth / 2.0) / focalLength;
      camY = (imgY - imageHeight / 2.0) / focalLength;
    }
    
    // Create ray in camera space
    const direction = normalize({ x: camX, y: camY, z: 1.0 });
    
    // Transform to world space
    const worldDirection = applyInverseRotation(direction, cameraPose.rotation);
    const worldOrigin = cameraPose.position;
    
    if (depth !== null) {
      // If depth provided, return actual 3D point
      return {
        x: worldOrigin.x + worldDirection.x * depth,
        y: worldOrigin.y + worldDirection.y * depth,
        z: worldOrigin.z + worldDirection.z * depth
      };
    }
    
    return {
      origin: worldOrigin,
      direction: worldDirection
    };
  }
  
  /**
   * Apply inverse rotation (for unprojection)
   */
  function applyInverseRotation(point, rotation) {
    const { x: rx, y: ry, z: rz } = rotation;
    
    // Inverse rotations (opposite order, opposite angles)
    const cosZ = Math.cos(rz);
    const sinZ = Math.sin(rz);
    const x1 = point.x * cosZ - point.y * sinZ;
    const y1 = point.x * sinZ + point.y * cosZ;
    const z1 = point.z;
    
    const cosY = Math.cos(ry);
    const sinY = Math.sin(ry);
    const x2 = x1 * cosY - z1 * sinY;
    const y2 = y1;
    const z2 = x1 * sinY + z1 * cosY;
    
    const cosX = Math.cos(rx);
    const sinX = Math.sin(rx);
    const x3 = x2;
    const y3 = y2 * cosX - z2 * sinX;
    const z3 = y2 * sinX + z2 * cosX;
    
    return { x: x3, y: y3, z: z3 };
  }
  
  /**
   * Normalize vector
   */
  function normalize(vec) {
    const length = Math.sqrt(vec.x ** 2 + vec.y ** 2 + vec.z ** 2);
    if (length < 1e-10) return { x: 0, y: 0, z: 0 };
    return {
      x: vec.x / length,
      y: vec.y / length,
      z: vec.z / length
    };
  }
  
  /**
   * Find points in photo click region
   * 
   * @param {Array} points - All 3D points
   * @param {Object} photoClick - {x, y} in photo pixels
   * @param {CameraPose} cameraPose - Camera pose
   * @param {number} imageWidth - Photo width
   * @param {number} imageHeight - Photo height
   * @param {number} clickRadius - Selection radius in pixels
   * @returns {Array} Indices of points within selection region
   */
  function findPointsInPhotoClick(points, photoClick, cameraPose, imageWidth, imageHeight, clickRadius = 10) {
    const selectedIndices = [];
    
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      
      // Project 3D point to 2D
      const projected = projectPointToImage(point, cameraPose, imageWidth, imageHeight);
      
      if (!projected) continue; // Behind camera
      
      // Check if within click radius
      const dx = projected.x - photoClick.x;
      const dy = projected.y - photoClick.y;
      const distance = Math.sqrt(dx ** 2 + dy ** 2);
      
      if (distance <= clickRadius) {
        selectedIndices.push(i);
      }
    }
    
    return selectedIndices;
  }
  
  /**
   * Grow selection based on spatial proximity
   * 
   * @param {Array} points - All 3D points
   * @param {Array} seedIndices - Starting point indices
   * @param {number} radius - Grow radius in meters
   * @returns {Array} Expanded point indices
   */
  function growSelection(points, seedIndices, radius = 0.1) {
    const expanded = new Set(seedIndices);
    const queue = [...seedIndices];
    
    while (queue.length > 0) {
      const idx = queue.shift();
      const point = points[idx];
      
      // Find nearby points
      for (let i = 0; i < points.length; i++) {
        if (expanded.has(i)) continue;
        
        const dx = points[i].x - point.x;
        const dy = points[i].y - point.y;
        const dz = points[i].z - point.z;
        const distance = Math.sqrt(dx ** 2 + dy ** 2 + dz ** 2);
        
        if (distance <= radius) {
          expanded.add(i);
          queue.push(i);
        }
      }
    }
    
    return Array.from(expanded);
  }
  
  /**
   * Grow selection based on color similarity
   * 
   * @param {Array} points - All 3D points with color info
   * @param {Array} seedIndices - Starting point indices
   * @param {number} colorThreshold - Max color distance (0-1)
   * @returns {Array} Expanded point indices
   */
  function growSelectionByColor(points, seedIndices, colorThreshold = 0.1) {
    const expanded = new Set(seedIndices);
    const queue = [...seedIndices];
    
    // Get average color of seed points
    let avgR = 0, avgG = 0, avgB = 0;
    for (const idx of seedIndices) {
      if (points[idx].r !== undefined) avgR += points[idx].r;
      if (points[idx].g !== undefined) avgG += points[idx].g;
      if (points[idx].b !== undefined) avgB += points[idx].b;
    }
    avgR /= seedIndices.length;
    avgG /= seedIndices.length;
    avgB /= seedIndices.length;
    
    while (queue.length > 0) {
      const idx = queue.shift();
      
      // Find nearby points with similar color
      for (let i = 0; i < points.length; i++) {
        if (expanded.has(i)) continue;
        if (!points[i].r) continue;
        
        const colorDist = Math.sqrt(
          (points[i].r - avgR) ** 2 +
          (points[i].g - avgG) ** 2 +
          (points[i].b - avgB) ** 2
        );
        
        if (colorDist <= colorThreshold) {
          // Also check spatial proximity
          const dx = points[i].x - points[idx].x;
          const dy = points[i].y - points[idx].y;
          const dz = points[i].z - points[idx].z;
          const spatialDist = Math.sqrt(dx ** 2 + dy ** 2 + dz ** 2);
          
          if (spatialDist < 0.2) { // Max 20cm away
            expanded.add(i);
            queue.push(i);
          }
        }
      }
    }
    
    return Array.from(expanded);
  }
  
  /**
   * Batch project multiple points (optimized)
   */
  function projectPointsBatch(points, cameraPose, imageWidth, imageHeight) {
    const results = [];
    
    for (const point of points) {
      const projected = projectPointToImage(point, cameraPose, imageWidth, imageHeight);
      results.push(projected);
    }
    
    return results;
  }
  
  // Export to global scope
  window.PhotoAligner = {
    CameraPose,
    projectPointToImage,
    unprojectImageTo3D,
    findPointsInPhotoClick,
    growSelection,
    growSelectionByColor,
    projectPointsBatch
  };
  
})();

