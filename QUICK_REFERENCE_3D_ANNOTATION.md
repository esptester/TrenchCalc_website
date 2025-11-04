# Quick Reference: 3D LiDAR Annotation

## 🎯 What You Built

**Professional 3D point cloud annotation tool** for labeling LiDAR scans with photogrammetry support.

---

## 📁 Key Files

```
lidar-annotation.html          Main interface (1,130 lines)
js/annotation/
  ├── photo-aligner.js         Camera model & projection (371 lines)
  ├── point-cloud-loader.js    PLY/PCD loader (157 lines)
  ├── labeler.js               Label management (164 lines)
  ├── ransac-helpers.js        Auto-detection (270 lines)
  └── submitter.js             Backend API (185 lines)
```

**Total: 2,277 lines of production code**

---

## 🚀 Quick Start

### 1. Open in Browser
```
file:///C:/path/to/lidar-annotation.html
```

### 2. Set API URL
```
API Base URL: https://api.engsitetools.com
```

### 3. Load Task
```
Click: "Load Next Task"
```

### 4. Annotate
```
1. Click on photo to select 3D points
2. Choose label class
3. Click "Apply Label to Selected"
4. Repeat
5. Click "Submit All Labels"
```

---

## 🎮 Controls

| Control | Action |
|---------|--------|
| **Photo click** | Select 3D points at click |
| **"Grow Selection"** | Expand by 10cm radius |
| **"Apply Label"** | Label selected points |
| **← → arrows** | Navigate photos |
| **"Auto-detect Pipes"** | RANSAC cylinder fitting |
| **"Clear Selection"** | Deselect all |

---

## 📋 Label Classes

| Class | Color | Impact |
|-------|-------|--------|
| ground | Brown | Reference plane |
| pipe | Red | Subtract from volume |
| headwall | Red | Subtract from volume |
| shoring | Red | Subtract from volume |
| person | Orange | Ignore (temporary) |
| equipment | Orange | Ignore (temporary) |
| air | Blue | Needs backfill |

---

## 🔧 Camera Poses

Your backend should return:

```json
{
  "photos": [
    {
      "url": "https://s3.../photo.jpg",
      "pose": {
        "position": {"x": 1.5, "y": 2.0, "z": 3.0},
        "rotation": {"x": 0.1, "y": 0.2, "z": 0.0},
        "fx": 800, "fy": 800,  // OR full intrinsics K matrix
        "cx": 320, "cy": 240
      }
    }
  ]
}
```

**Supports:** COLMAP, Agisoft, RealityCapture, ARKit, drones

---

## 📊 API Endpoints

### Get Next Task
```
GET /annotation/tasks/next
Response: { taskId, pointCloudUrl, photos, ... }
```

### Submit Labels
```
POST /annotation/tasks/{taskId}/labels
Body: { labels: { pointIdx → class }, ... }
```

---

## ✅ What Works

- ✅ Photo display
- ✅ Photo navigation
- ✅ Camera pose parsing
- ✅ 3D→2D projection
- ✅ Photo click selection
- ✅ Spatial growing
- ✅ Label application
- ✅ Statistics
- ✅ Backend integration

---

## ⚠️ What's TODO

- ⏳ Actual Potree point cloud loading
- ⏳ Visual feedback (highlighting)
- ⏳ RANSAC button integration
- ⏳ Undo/redo
- ⏳ Keyboard shortcuts

---

## 🐛 Common Issues

### Point cloud won't load
**Fix:** Wire up PLY loader in `loadPointCloud()`

### Photo click does nothing
**Check:** Are photos loaded? Camera poses valid?

### Selection too small/large
**Adjust:** `clickRadius` in photo-click handler

### Slow performance
**Optimize:** Add Octree for 500k+ points

---

## 📖 Full Docs

1. **LIDAR_ANNOTATION_README.md** - Complete guide
2. **QUICKSTART_3D_ANNOTATION.md** - Testing
3. **ROBUSTNESS_GUIDE_3D_PHOTOGRAMMETRY.md** - Deep dive
4. **PHOTOGRAMMETRY_ENHANCEMENTS.md** - New features

---

**Status:** ✅ Foundation ready, needs point cloud loading  
**Next:** Wire up Potree with real data

