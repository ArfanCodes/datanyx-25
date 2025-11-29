# 📱 DataNyx API Integration & Deployment Guide

This guide covers how to connect your React Native frontend to the backend and deploy the API to production.

---

## 🔌 Frontend Integration (React Native)

### **1. Setup API Client**
Create `src/services/api.ts` in your React Native project.

```typescript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your local IP for dev (e.g., 192.168.1.5)
// Use production URL for release
const API_URL = __DEV__ 
  ? 'http://192.168.1.X:3000/api' 
  : 'https://your-production-app.railway.app/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Authorization header to every request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('supabase_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### **2. Authentication Flow**

#### **Signup**
```typescript
const signup = async (email, password, fullName, phone) => {
  try {
    const response = await api.post('/auth/signup', {
      email,
      password,
      full_name: fullName,
      phone_number: phone,
    });
    
    const { token, user } = response.data.data;
    
    // Store token securely
    await AsyncStorage.setItem('supabase_token', token);
    await AsyncStorage.setItem('user_data', JSON.stringify(user));
    
    return user;
  } catch (error) {
    console.error(error.response?.data?.error || 'Signup failed');
    throw error;
  }
};
```

#### **Login**
```typescript
const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    
    const { session, user } = response.data.data;
    
    // Store token
    await AsyncStorage.setItem('supabase_token', session.access_token);
    await AsyncStorage.setItem('user_data', JSON.stringify(user));
    
    return user;
  } catch (error) {
    console.error(error.response?.data?.error || 'Login failed');
    throw error;
  }
};
```

### **3. Fetching Data**

#### **Get Profile**
```typescript
const getProfile = async () => {
  const response = await api.get('/profile');
  return response.data.data;
};
```

#### **Get Transactions**
```typescript
const getTransactions = async (month) => {
  // month format: '2025-01'
  const response = await api.get(`/transactions?month=${month}`);
  return response.data.data;
};
```

#### **Add Transaction**
```typescript
const addTransaction = async (type, amount, category, note) => {
  const response = await api.post('/transactions', {
    type, // 'expense', 'income', 'emi', 'subscription'
    amount: parseFloat(amount),
    category,
    note,
    date: new Date().toISOString(),
  });
  return response.data.data;
};
```

---

## 🚀 Deployment Instructions

### **1. Running Local Backend**

1.  Ensure PostgreSQL is connected (check `.env`).
2.  Start server:
    ```bash
    npm run dev
    ```
3.  Server runs on `http://localhost:3000`.

### **2. Testing with Postman**

1.  **Signup**: POST `http://localhost:3000/api/auth/signup`
    *   Body: `{"email": "test@test.com", "password": "password", "full_name": "Test", "phone_number": "1234567890"}`
2.  **Login**: POST `http://localhost:3000/api/auth/login`
    *   Body: `{"email": "test@test.com", "password": "password"}`
    *   Copy `session.access_token` from response.
3.  **Protected Route**: GET `http://localhost:3000/api/profile`
    *   Header: `Authorization: Bearer <YOUR_TOKEN>`

### **3. Deploying to Railway (Recommended)**

1.  Push code to GitHub.
2.  Create project on [Railway](https://railway.app).
3.  Connect GitHub repo.
4.  Set Environment Variables in Railway:
    *   `DATABASE_URL`: (Pooler URL from Supabase)
    *   `DIRECT_URL`: (Direct URL from Supabase)
    *   `SUPABASE_URL`: Your Supabase URL
    *   `SUPABASE_ANON_KEY`: Your Supabase Anon Key
    *   `NODE_ENV`: `production`
5.  Deploy!

### **4. Connecting Mobile App to Production**

1.  Get your Railway URL (e.g., `https://datanyx-backend.up.railway.app`).
2.  Update `API_URL` in your React Native `api.ts` file.
3.  Rebuild your mobile app.

---

## 🛡️ Security Notes

*   **Tokens**: JWT tokens expire. Handle 401 errors in your axios interceptor to redirect to login or refresh token.
*   **SSL**: Always use HTTPS in production.
*   **Validation**: All inputs are validated with Zod on the backend.
