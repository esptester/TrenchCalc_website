/**
 * Point Cloud Loader Module
 * Handles loading PLY, PCD, and binary point cloud formats
 */

(function() {
  'use strict';
  
  /**
   * Load PLY file from URL
   * @param {string} url - URL to PLY file
   * @returns {Promise<Array>} Array of point cloud data
   */
  async function loadPLY(url) {
    console.log('Loading PLY from:', url);
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const buffer = await response.arrayBuffer();
      const text = new TextDecoder('utf-8').decode(buffer);
      
      // Parse PLY format
      const lines = text.split('\n');
      const vertices = [];
      
      let readingVertices = false;
      let vertexCount = 0;
      let properties = [];
      let headerComplete = false;
      
      for (const line of lines) {
        const trimmed = line.trim();
        
        if (trimmed.startsWith('element vertex')) {
          vertexCount = parseInt(trimmed.split(' ')[2]);
        }
        
        if (trimmed.startsWith('property float')) {
          properties.push(trimmed.split(' ')[2]);
        }
        
        if (trimmed.startsWith('end_header')) {
          headerComplete = true;
          readingVertices = true;
          continue;
        }
        
        if (readingVertices && trimmed && !trimmed.startsWith('comment')) {
          const values = trimmed.split(/\s+/).map(parseFloat);
          
          if (values.length >= 3) {
            const point = {
              x: values[0],
              y: values[1],
              z: values[2],
              r: values.length > 3 ? Math.floor(values[3] * 255) : 128,
              g: values.length > 4 ? Math.floor(values[4] * 255) : 128,
              b: values.length > 5 ? Math.floor(values[5] * 255) : 128
            };
            vertices.push(point);
          }
        }
      }
      
      console.log(`✅ Loaded ${vertices.length} points from PLY`);
      return vertices;
      
    } catch (err) {
      console.error('Failed to load PLY:', err);
      throw err;
    }
  }
  
  /**
   * Load binary point cloud format
   * @param {string} url - URL to binary point cloud
   * @returns {Promise<Array>} Array of point cloud data
   */
  async function loadBinaryPointCloud(url) {
    console.log('Loading binary point cloud from:', url);
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const buffer = await response.arrayBuffer();
      const view = new DataView(buffer);
      
      const points = [];
      const pointSize = 17; // x, y, z (3*4) + intensity (4) + classification (1) = 17 bytes
      
      for (let i = 0; i < buffer.byteLength; i += pointSize) {
        const x = view.getFloat32(i, true);
        const y = view.getFloat32(i + 4, true);
        const z = view.getFloat32(i + 8, true);
        const intensity = view.getFloat32(i + 12, true);
        const classification = view.getUint8(i + 16);
        
        points.push({
          x, y, z,
          intensity,
          classification,
          r: 128, g: 128, b: 128
        });
      }
      
      console.log(`✅ Loaded ${points.length} points from binary`);
      return points;
      
    } catch (err) {
      console.error('Failed to load binary point cloud:', err);
      throw err;
    }
  }
  
  /**
   * Detect file format from URL or content
   * @param {string} url - URL to file
   * @returns {string} Format type ('ply', 'pcd', 'binary')
   */
  function detectFormat(url) {
    if (url.endsWith('.ply')) return 'ply';
    if (url.endsWith('.pcd')) return 'pcd';
    if (url.endsWith('.bin') || url.endsWith('.dat')) return 'binary';
    return 'unknown';
  }
  
  /**
   * Load point cloud - auto-detect format
   * @param {string} url - URL to point cloud
   * @returns {Promise<Array>} Array of point cloud data
   */
  async function loadPointCloud(url) {
    const format = detectFormat(url);
    
    switch (format) {
      case 'ply':
        return await loadPLY(url);
      case 'binary':
        return await loadBinaryPointCloud(url);
      case 'pcd':
        throw new Error('PCD format not yet implemented');
      default:
        throw new Error(`Unknown point cloud format: ${format}`);
    }
  }
  
  // Export to global scope
  window.PointCloudLoader = {
    loadPLY,
    loadBinaryPointCloud,
    loadPointCloud,
    detectFormat
  };
  
})();

