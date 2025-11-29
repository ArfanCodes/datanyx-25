# 📘 DataNyx Backend Master Guide: Supabase + Prisma

This guide covers the complete production setup for connecting your Node.js/Express backend to Supabase PostgreSQL using Prisma.

---

## 1️⃣ Supabase + Prisma Connection

### **The Connection String**

Supabase provides two connection types. For a production app, you **must** use both:

1.  **Transaction Mode (Port 5432)**: Used for **migrations** (schema changes).
2.  **Session Mode (Port 6543)**: Used for **application queries** (high performance connection pooling).

### **Setting up `.env`**

Create a `.env` file in your `backend` root.

**Variables Explanation:**
*   `[YOUR-PASSWORD]`: The password you set when creating the Supabase project.
    *   ⚠️ **CRITICAL**: If your password has special characters (e.g., `#`, `@`, `/`), you **MUST** URL-encode them.
    *   Example: `Pass@123` -> `Pass%40123`
*   `[PROJECT-REF]`: Your Supabase project ID (e.g., `iwedvgyucyqaghirtxbl`).
*   `[REGION]`: Your AWS region (e.g., `ap-southeast-1`).

**Correct `.env` Format:**

```env
# 1. APPLICATION QUERIES (Pooler - Port 6543)
# Use this for the main app. Add ?pgbouncer=true to handle prepared statements.
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

# 2. MIGRATIONS (Direct - Port 5432)
# Use this for 'npx prisma migrate'. Bypass the pooler.
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
```

### **How to Reset DB Password**
If you forgot your password:
1.  Go to **Supabase Dashboard** -> **Settings** (⚙️) -> **Database**.
2.  Under "Database Password", click **Reset Database Password**.
3.  Update your `.env` file immediately after.

### **Verifying the Connection**
Run this command to pull the current schema from the DB. If it works, your connection is valid.
```bash
npx prisma db pull
```

---

## 2️⃣ Prisma Migration Steps

These are the exact commands to manage your database schema.

### **1. Initialize Prisma**
(Only needed once at the start)
```bash
npm install prisma --save-dev
npx prisma init
```

### **2. Run Migrations (Development)**
Use this whenever you change `schema.prisma`. It updates the DB and generates the client.
```bash
# Syntax: npx prisma migrate dev --name <descriptive-name>
npx prisma migrate dev --name init_schema
```

### **3. Validate Schema Sync**
To check if your local schema matches the database:
```bash
npx prisma migrate status
```

### **4. Regenerate Client**
If you pull changes or manually edit node_modules (rare), force a client update:
```bash
npx prisma generate
```

---

## 3️⃣ Backend Structure

We use a **Layered Architecture** for scalability and maintainability.

```text
/backend
  ├── package.json          # Dependencies and scripts
  ├── .env                  # Environment variables (gitignored)
  ├── prisma/
  │   ├── schema.prisma     # Database models
  │   └── seed.ts           # Test data generator
  └── src/
      ├── app.ts            # Express app setup (middleware, routes)
      ├── server.ts         # Entry point (starts server)
      │
      ├── config/           # Configuration (Env vars, DB connection)
      │   └── prisma.ts     # Instantiates PrismaClient
      │
      ├── routes/           # API Route Definitions
      │   ├── auth.routes.ts
      │   └── transactions.routes.ts
      │
      ├── controllers/      # Request Handling (Req/Res logic)
      │   ├── auth.controller.ts
      │   └── transactions.controller.ts
      │
      ├── services/         # Business Logic (Database calls)
      │   ├── auth.service.ts
      │   └── transactions.service.ts
      │
      ├── middleware/       # Interceptors
      │   ├── auth.middleware.ts  # Validates JWT tokens
      │   └── validate.middleware.ts # Zod validation
      │
      └── utils/            # Helpers
          └── responses.ts  # Standardized API responses
```

**Folder Purpose:**
*   **Routes**: Define endpoints (e.g., `POST /login`) and link them to controllers.
*   **Controllers**: Extract data from requests (`req.body`), call services, and send responses (`res.json`).
*   **Services**: Contain the "brain" of the app. They talk to Prisma/DB and handle logic.
*   **Middleware**: Runs before controllers (e.g., checking if a user is logged in).

---

## 4️⃣ How to Test “Supabase is Done”

### **1. Test DB Connection (Internal)**
Run the seed script. It attempts to connect, write, and read data.
```bash
npm run db:seed
```
*Success Output*: `✅ Database seeded successfully!`

### **2. Test CRUD Operations**
Use the built-in Prisma Studio GUI to inspect and manipulate data directly.
```bash
npx prisma studio
```
*   Opens at `http://localhost:5555`.
*   Click on `User` or `Transaction` tables to verify data exists.

### **3. Check Row-Level Security (RLS)**
*   **Note**: Since we are using Prisma with the `postgres` superuser, Supabase RLS policies are **bypassed** by default.
*   **Security**: We handle security in the **Middleware** (`auth.middleware.ts`) by validating JWT tokens and ensuring users can only access their own data via `where: { userId }` clauses in services.

### **4. Test API from Mobile/Postman**
1.  **Start Server**: `npm run dev`
2.  **Login**:
    *   POST `http://localhost:3000/api/auth/login`
    *   Body: `{"email": "test@datanyx.com", "password": "password123"}`
3.  **Copy Token**: Copy the `token` string from the response.
4.  **Test Protected Route**:
    *   GET `http://localhost:3000/api/dashboard`
    *   Header: `Authorization: Bearer <YOUR_TOKEN>`

---

## 5️⃣ Deployment Guide

### **Recommended: Railway (Best for Node + Postgres)**

1.  **Push Code**: Push your `backend` folder to GitHub.
2.  **Create Project**: Login to Railway -> New Project -> Deploy from GitHub.
3.  **Variables**: Add the following variables in Railway settings:
    *   `DATABASE_URL`: (Your Session Mode URL from .env)
    *   `DIRECT_URL`: (Your Transaction Mode URL from .env)
    *   `JWT_SECRET`: (A long random string)
    *   `NODE_ENV`: `production`
    *   `NPM_FLAGS`: `--legacy-peer-deps` (sometimes needed)
4.  **Build Command**: `npm run build`
5.  **Start Command**: `npm start`

### **Alternative: Render**

1.  Create a **Web Service**.
2.  Connect GitHub repo.
3.  **Environment**: Node.
4.  **Build Command**: `npm install && npm run build`.
5.  **Start Command**: `npm start`.
6.  Add Environment Variables (same as above).

### **Production Migration**
**Crucial**: Do not run `migrate dev` in production. Run `migrate deploy`.
Add this to your build command or run it manually via Railway CLI:
```bash
npx prisma migrate deploy
```

### **Health Check Endpoint**
We have configured a health check at:
`GET /health`
*   **Response**: `{"status": "ok", "message": "DataNyx API is running"}`
*   Use this for uptime monitoring (e.g., UptimeRobot).

### **Connecting Mobile App**
In your React Native `src/config/api.ts` (or similar):

```typescript
const DEV_URL = 'http://192.168.x.x:3000/api'; // Your local IP
const PROD_URL = 'https://your-railway-app.up.railway.app/api';

export const API_URL = __DEV__ ? DEV_URL : PROD_URL;
```

---

## 6️⃣ Final Checklist

*   [ ] `.env` contains both `DATABASE_URL` (6543) and `DIRECT_URL` (5432).
*   [ ] `schema.prisma` has `directUrl = env("DIRECT_URL")`.
*   [ ] `npm run db:seed` runs without errors.
*   [ ] `npm run dev` starts the server on port 3000.
*   [ ] `/health` endpoint returns 200 OK.
