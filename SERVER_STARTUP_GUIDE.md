# 🚀 Server Startup Guide

## Running Both Servers

You need to run **TWO separate servers** for the app to work:

### 1. Backend Server (Express API)
```bash
cd backend
npm run dev
```
**Port**: 3000  
**URL**: http://localhost:3000  
**Health Check**: http://localhost:3000/health

### 2. Frontend Server (Expo/React Native)
```bash
# From the ROOT directory (datanyx-25)
npx expo start
```
**Port**: 8081 (Metro Bundler)  
**Expo Go**: Scan QR code with your phone

---

## ⚠️ Common Mistakes

### ❌ WRONG: Running Expo from backend folder
```bash
cd backend
npx expo start  # This will FAIL!
```

### ✅ CORRECT: Running Expo from root folder
```bash
# Make sure you're in datanyx-25 folder
npx expo start  # This works!
```

---

## 📁 Directory Structure

```
datanyx-25/                  ← Run Expo from HERE
├── backend/                 ← Run npm run dev from HERE
│   ├── src/
│   ├── prisma/
│   └── package.json
├── src/
├── App.tsx
└── package.json
```

---

## 🔧 Troubleshooting

### Backend won't start
```bash
cd backend
npm install
npm run dev
```

### Frontend won't start
```bash
# From root directory
npm install
npx expo start
```

### Port already in use
**Backend (3000)**:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Frontend (8081)**:
```bash
# Windows
netstat -ano | findstr :8081
taskkill /PID <PID> /F
```

---

## ✅ Verify Both Servers Running

### Check Backend
Open browser: http://localhost:3000/health

Should see:
```json
{
  "status": "ok",
  "message": "DataNyx API is running"
}
```

### Check Frontend
Terminal should show:
```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go
```

---

## 📱 Testing on Phone

1. Install **Expo Go** app from Play Store/App Store
2. Make sure phone is on **same WiFi** as computer
3. Scan QR code from terminal
4. App should load on your phone

---

## 🎯 Quick Start Commands

**Terminal 1 (Backend)**:
```bash
cd c:\Projects\PESO\datanyx-25\backend
npm run dev
```

**Terminal 2 (Frontend)**:
```bash
cd c:\Projects\PESO\datanyx-25
npx expo start
```

---

## 🔥 Both Servers Running Successfully!

You should see:

**Terminal 1**:
```
✅ Database connected successfully
🚀 Server is running on port 3000
```

**Terminal 2**:
```
› Metro waiting on exp://192.168.x.x:8081
› Press a │ open Android
```

**Now you're ready to test the gamification features!** 🎉
