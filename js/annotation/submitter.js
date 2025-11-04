/**
 * Annotation Submission Module
 * Handles submitting labels to backend API
 */

(function() {
  'use strict';
  
  /**
   * Submit annotations to backend
   * @param {string} apiBase - API base URL
   * @param {string} taskId - Task ID
   * @param {Object} labels - Labels object (pointIdx -> class)
   * @param {string} token - Auth token
   * @returns {Promise<Object>} Response data
   */
  async function submitAnnotations(apiBase, taskId, labels, token = '') {
    const url = `${apiBase}/annotation/tasks/${encodeURIComponent(taskId)}/labels`;
    
    const payload = {
      taskId: taskId,
      labels: labels,
      timestamp: new Date().toISOString(),
      metadata: {
        totalLabels: Object.keys(labels).length,
        classes: [...new Set(Object.values(labels))]
      }
    };
    
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      return data;
      
    } catch (err) {
      console.error('Submission failed:', err);
      throw err;
    }
  }
  
  /**
   * Get next annotation task from backend
   * @param {string} apiBase - API base URL
   * @param {string} token - Auth token
   * @returns {Promise<Object>} Task data
   */
  async function getNextTask(apiBase, token = '') {
    const url = `${apiBase}/annotation/tasks/next`;
    
    const headers = {
      'Accept': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: headers
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      return data;
      
    } catch (err) {
      console.error('Failed to fetch task:', err);
      throw err;
    }
  }
  
  /**
   * Skip annotation task
   * @param {string} apiBase - API base URL
   * @param {string} taskId - Task ID
   * @param {string} reason - Skip reason
   * @param {string} token - Auth token
   * @returns {Promise<Object>} Response data
   */
  async function skipTask(apiBase, taskId, reason = 'Skipped by annotator', token = '') {
    const url = `${apiBase}/annotation/tasks/${encodeURIComponent(taskId)}/skip`;
    
    const payload = {
      taskId: taskId,
      reason: reason,
      timestamp: new Date().toISOString()
    };
    
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      return data;
      
    } catch (err) {
      console.error('Skip failed:', err);
      throw err;
    }
  }
  
  /**
   * Get annotation statistics
   * @param {string} apiBase - API base URL
   * @param {string} token - Auth token
   * @returns {Promise<Object>} Statistics
   */
  async function getStats(apiBase, token = '') {
    const url = `${apiBase}/annotation/stats`;
    
    const headers = {
      'Accept': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: headers
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      return data;
      
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      throw err;
    }
  }
  
  // Export to global scope
  window.AnnotationSubmitter = {
    submitAnnotations,
    getNextTask,
    skipTask,
    getStats
  };
  
})();

