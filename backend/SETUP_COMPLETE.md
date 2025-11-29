# 🎉 Backend Setup Complete - Next Steps

## ✅ What's Done

1. ✅ Database connected to Supabase PostgreSQL
2. ✅ Prisma schema with 10 models migrated
3. ✅ Prisma Client generated
4. ✅ All backend routes, controllers, and services created
5. ✅ Authentication middleware with JWT
6. ✅ Validation with Zod
7. ✅ Error handling middleware
8. ✅ Seed script ready

## 🔧 Final Setup Steps

### Step 1: Fix DATABASE_URL for Seeding

Add `?pgbouncer=true` to your DATABASE_URL in `.env`:

```env
DATABASE_URL="postgresql://postgres.iwedvgyucyqaghirtxbl:Supabase2025ProjectKey@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

### Step 2: Seed the Database

```bash
npm run db:seed
```

This will create:
- Test user (email: test@datanyx.com, password: password123)
- Sample profile
- 5 transactions
- 1 EMI
- 3 subscriptions
- 1 budget
- 1 savings goal
- 1 stability log

### Step 3: Start the Development Server

```bash
npm run dev
```

Server will start on `http://localhost:3000`

### Step 4: Test the API

#### Health Check
```bash
curl http://localhost:3000/health
```

#### Register a New User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "password123",
    "name": "New User"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@datanyx.com",
    "password": "password123"
  }'
```

Save the `token` from the response!

#### Get Dashboard (Protected Route)
```bash
curl http://localhost:3000/api/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Get Transactions
```bash
curl http://localhost:3000/api/transactions \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Create Transaction
```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 500,
    "category": "food",
    "type": "expense",
    "description": "Lunch"
  }'
```

## 📊 Available API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Onboarding
- `POST /api/onboarding` - Complete profile setup
- `GET /api/onboarding` - Get user profile
- `PUT /api/onboarding` - Update profile

### Dashboard
- `GET /api/dashboard` - Get dashboard summary
- `GET /api/dashboard/stats` - Get statistics

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/:id` - Get transaction by ID
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Leaks
- `GET /api/leaks` - Get all detected leaks
- `GET /api/leaks/detect` - Detect new leaks
- `DELETE /api/leaks/:id` - Delete leak

### Stability
- `GET /api/stability` - Get latest stability score
- `GET /api/stability/history` - Get score history
- `POST /api/stability/calculate` - Calculate new score

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `DELETE /api/user/account` - Delete account

## 🔐 Authentication Flow

1. User registers or logs in
2. Backend returns JWT token
3. Frontend stores token (AsyncStorage in React Native)
4. Frontend sends token in `Authorization: Bearer <token>` header
5. Backend validates token in auth middleware
6. Backend extracts user ID and processes request

## 🗄️ Database Management

### View Database
```bash
npm run prisma:studio
```
Opens Prisma Studio at `http://localhost:5555`

### Create Migration
```bash
npx prisma migrate dev --name description_of_change
```

### Reset Database (WARNING: Deletes all data)
```bash
npx prisma migrate reset
```

### Generate Prisma Client (after schema changes)
```bash
npm run prisma:generate
```

## 🚀 Production Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3000
DATABASE_URL="your-production-pooler-url?pgbouncer=true"
DIRECT_URL="your-production-direct-url"
JWT_SECRET="generate-a-secure-random-32-byte-string"
ALLOWED_ORIGINS="https://your-app.com,https://www.your-app.com"
```

### Build for Production
```bash
npm run build
npm start
```

### Run Migrations on Production
```bash
npx prisma migrate deploy
```

## 📝 Connecting Frontend (React Native)

### 1. Create API Client

```typescript
// src/services/api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = __DEV__ 
  ? 'http://localhost:3000/api' 
  : 'https://your-production-api.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@datanyx_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### 2. Update Auth Store

```typescript
// Replace mock API calls in authStore.ts with real ones
import api from '../services/api';

login: async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  const { token, user } = response.data.data;
  
  await AsyncStorage.setItem('@datanyx_auth_token', token);
  await AsyncStorage.setItem('@datanyx_user', JSON.stringify(user));
  
  set({ token, user, isAuthenticated: true });
},
```

### 3. Fetch Dashboard Data

```typescript
const { data } = await api.get('/dashboard');
console.log(data.data); // Dashboard summary
```

## 🎯 Next Steps

1. ✅ Add `?pgbouncer=true` to DATABASE_URL
2. ✅ Run `npm run db:seed`
3. ✅ Run `npm run dev`
4. ✅ Test API endpoints with curl or Postman
5. ✅ Connect React Native frontend
6. ✅ Implement real Supabase Auth (optional)
7. ✅ Deploy to production

## 📚 Additional Resources

- [Prisma Docs](https://www.prisma.io/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Express Docs](https://expressjs.com)
- [Zod Docs](https://zod.dev)

---

**Your backend is ready to go! 🚀**
