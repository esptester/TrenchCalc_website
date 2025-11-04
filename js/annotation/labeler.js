/**
 * Labeling Module
 * Handles point selection, labeling, and management
 */

(function() {
  'use strict';
  
  /**
   * Label manager
   */
  class LabelManager {
    constructor() {
      this.labels = {}; // pointIdx -> class
      this.selectedPoints = new Set();
    }
    
    /**
     * Add label to point(s)
     * @param {Array|Set} pointIndices - Point indices to label
     * @param {string} labelClass - Class label
     */
    labelPoints(pointIndices, labelClass) {
      for (const idx of pointIndices) {
        this.labels[idx] = labelClass;
      }
      this.onLabelsChanged();
    }
    
    /**
     * Remove label from point(s)
     * @param {Array|Set} pointIndices - Point indices to unlabel
     */
    unlabelPoints(pointIndices) {
      for (const idx of pointIndices) {
        delete this.labels[idx];
      }
      this.onLabelsChanged();
    }
    
    /**
     * Get points with specific label
     * @param {string} labelClass - Class label
     * @returns {Array} Point indices
     */
    getPointsByLabel(labelClass) {
      const result = [];
      for (const idx in this.labels) {
        if (this.labels[idx] === labelClass) {
          result.push(parseInt(idx));
        }
      }
      return result;
    }
    
    /**
     * Get label for point
     * @param {number} pointIdx - Point index
     * @returns {string|null} Label class or null
     */
    getLabel(pointIdx) {
      return this.labels[pointIdx] || null;
    }
    
    /**
     * Get label counts
     * @returns {Object} Counts by class
     */
    getLabelCounts() {
      const counts = {};
      for (const idx in this.labels) {
        const cls = this.labels[idx];
        counts[cls] = (counts[cls] || 0) + 1;
      }
      return counts;
    }
    
    /**
     * Clear all labels
     */
    clear() {
      this.labels = {};
      this.selectedPoints.clear();
      this.onLabelsChanged();
    }
    
    /**
     * Clear selection (but keep labels)
     */
    clearSelection() {
      this.selectedPoints.clear();
      if (this.onSelectionChanged) {
        this.onSelectionChanged();
      }
    }
    
    /**
     * Select points
     * @param {Array|Set} pointIndices - Point indices to select
     */
    selectPoints(pointIndices) {
      for (const idx of pointIndices) {
        this.selectedPoints.add(idx);
      }
      if (this.onSelectionChanged) {
        this.onSelectionChanged();
      }
    }
    
    /**
     * Deselect points
     * @param {Array|Set} pointIndices - Point indices to deselect
     */
    deselectPoints(pointIndices) {
      for (const idx of pointIndices) {
        this.selectedPoints.delete(idx);
      }
      if (this.onSelectionChanged) {
        this.onSelectionChanged();
      }
    }
    
    /**
     * Toggle selection
     * @param {number} pointIdx - Point index
     */
    toggleSelection(pointIdx) {
      if (this.selectedPoints.has(pointIdx)) {
        this.selectedPoints.delete(pointIdx);
      } else {
        this.selectedPoints.add(pointIdx);
      }
      if (this.onSelectionChanged) {
        this.onSelectionChanged();
      }
    }
    
    /**
     * Get selected points
     * @returns {Array} Selected point indices
     */
    getSelectedPoints() {
      return Array.from(this.selectedPoints);
    }
    
    /**
     * Get total label count
     * @returns {number} Total labeled points
     */
    getTotalCount() {
      return Object.keys(this.labels).length;
    }
    
    /**
     * Callback for when labels change
     */
    onLabelsChanged() {
      // Override in implementation
    }
  }
  
  // Export to global scope
  window.LabelManager = LabelManager;
  
})();

