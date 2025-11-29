# DataNyx Backend API

Production-ready Node.js backend for the **Peso** finance intelligence app.

## 🚀 Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcrypt
- **Validation**: Zod
- **Development**: tsx (TypeScript executor)

## 📁 Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Auto-generated migrations
├── src/
│   ├── config/                # Configuration files
│   ├── routes/                # API routes
│   ├── controllers/           # Request handlers
│   ├── services/              # Business logic
│   ├── middleware/            # Express middleware
│   ├── utils/                 # Utility functions
│   ├── constants/             # Constants and enums
│   ├── types/                 # TypeScript types
│   ├── app.ts                 # Express app setup
│   └── server.ts              # Server entry point
├── .env.example               # Environment variables template
├── package.json
└── tsconfig.json
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Update the following variables:
- `DATABASE_URL`: Your PostgreSQL connection string
- `JWT_SECRET`: A secure random string for JWT signing
- `ALLOWED_ORIGINS`: Comma-separated list of allowed origins

### 3. Setup Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio to view database
npm run prisma:studio
```

### 4. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Onboarding
- `POST /api/onboarding` - Complete onboarding
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

## 🔐 Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 🗄️ Database Schema

The Prisma schema includes:

- **User & Profile**: User authentication and onboarding data
- **Transactions**: Income, expenses, EMI, subscriptions
- **EMI**: Loan and EMI tracking
- **Subscriptions**: Recurring subscription management
- **Leaks**: Money leak detection and tracking
- **StabilityLog**: Financial stability scoring
- **Budget**: Category-wise budget tracking
- **SavingsGoal**: Financial goals and progress
- **Notifications**: User notifications

## 🧪 Development

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Database Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Create and run migration
npm run prisma:migrate

# Open Prisma Studio
npm run prisma:studio
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` |
| `PORT` | Server port | `3000` |
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `ALLOWED_ORIGINS` | CORS allowed origins | `http://localhost:8081` |

## 🚨 Error Handling

The API uses standardized error responses:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error (dev only)"
}
```

## 📊 Features

- ✅ JWT Authentication
- ✅ Request Validation with Zod
- ✅ Money Leak Detection Algorithm
- ✅ Financial Stability Scoring
- ✅ Transaction Categorization
- ✅ EMI & Subscription Tracking
- ✅ Budget Management
- ✅ Savings Goal Tracking
- ✅ CORS Protection
- ✅ Error Handling Middleware
- ✅ TypeScript Strict Mode

## 📄 License

MIT

---

Built with ❤️ for DataNyx
