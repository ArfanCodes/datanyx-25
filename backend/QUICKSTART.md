# Quick Start Guide for DataNyx Backend

## Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

## Quick Setup (5 minutes)

### Step 1: Install dependencies
```bash
cd backend
npm install
```

### Step 2: Setup environment
```bash
# Copy the example env file
cp .env.example .env

# Edit .env and update:
# - DATABASE_URL with your PostgreSQL connection string
# - JWT_SECRET with a secure random string
```

### Step 3: Setup database
```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations to create tables
npm run prisma:migrate
```

### Step 4: Start development server
```bash
npm run dev
```

Your API will be running at `http://localhost:3000`

## Test the API

### Health Check
```bash
curl http://localhost:3000/health
```

### Register a user
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Next Steps

1. **Connect your frontend**: Update the API base URL in your React Native app
2. **Customize the schema**: Modify `prisma/schema.prisma` as needed
3. **Add more features**: Extend controllers and services
4. **Deploy**: Use platforms like Railway, Render, or Heroku

## Troubleshooting

### Database connection error
- Ensure PostgreSQL is running
- Check your DATABASE_URL in .env
- Verify database credentials

### Port already in use
- Change PORT in .env file
- Or kill the process using port 3000

### Prisma errors
- Run `npm run prisma:generate` after schema changes
- Run `npm run prisma:migrate` to apply migrations

## Documentation

- Full API docs: See README.md
- Prisma docs: https://www.prisma.io/docs
- Express docs: https://expressjs.com

Happy coding! 🚀
