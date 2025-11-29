# 🚀 Production Deployment Guide

## Overview

This guide covers deploying your DataNyx backend to production with Supabase PostgreSQL.

## 📋 Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations tested locally
- [ ] API endpoints tested
- [ ] Authentication working
- [ ] CORS configured for production domain
- [ ] JWT secret is secure (32+ characters)
- [ ] Error logging configured

## 🌐 Deployment Platforms

### Option 1: Railway (Recommended)

**Pros**: Easy setup, automatic deployments, PostgreSQL support
**Pricing**: Free tier available

#### Steps:

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your repository

3. **Add Environment Variables**
   ```
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=your-supabase-pooler-url?pgbouncer=true
   DIRECT_URL=your-supabase-direct-url
   JWT_SECRET=your-secure-secret
   ALLOWED_ORIGINS=https://your-app.com
   ```

4. **Configure Build**
   - Build Command: `npm run build`
   - Start Command: `npm start`

5. **Deploy**
   - Railway will auto-deploy on git push

### Option 2: Render

**Pros**: Free tier, easy setup
**Pricing**: Free tier available

#### Steps:

1. Go to [render.com](https://render.com)
2. Create "New Web Service"
3. Connect GitHub repo
4. Configure:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
5. Add environment variables
6. Deploy

### Option 3: Vercel (Serverless)

**Note**: Requires adapting to serverless functions

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in project directory
3. Follow prompts

### Option 4: DigitalOcean App Platform

**Pros**: Full control, scalable
**Pricing**: Starts at $5/month

1. Create account on DigitalOcean
2. Create new App
3. Connect GitHub
4. Configure build settings
5. Add environment variables
6. Deploy

## 🔐 Environment Variables for Production

```env
# Environment
NODE_ENV=production
PORT=3000

# Database - Use Supabase Production URLs
DATABASE_URL="postgresql://postgres.PROJECT:PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.PROJECT:PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=1"

# JWT - MUST be different from development
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your-production-secret-minimum-32-characters-long
JWT_EXPIRES_IN=7d

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# CORS - Your production domains
ALLOWED_ORIGINS=https://your-app.com,https://www.your-app.com,https://app.your-domain.com

# Optional: Error Tracking
SENTRY_DSN=your-sentry-dsn
```

## 📦 Pre-Deployment Steps

### 1. Build Locally
```bash
npm run build
```

### 2. Test Production Build
```bash
NODE_ENV=production npm start
```

### 3. Run Migrations on Production Database

**IMPORTANT**: Use DIRECT_URL for migrations, not pooled connection

```bash
# Set production DATABASE_URL temporarily
export DATABASE_URL="your-production-direct-url"

# Run migrations
npx prisma migrate deploy

# Unset
unset DATABASE_URL
```

### 4. Generate Prisma Client for Production
```bash
npx prisma generate
```

## 🔒 Security Best Practices

### 1. Secure JWT Secret

Generate a strong secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Enable HTTPS Only

In production, always use HTTPS. Most platforms handle this automatically.

### 3. Rate Limiting

Add rate limiting to prevent abuse:

```bash
npm install express-rate-limit
```

```typescript
// src/app.ts
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 4. Helmet for Security Headers

```bash
npm install helmet
```

```typescript
// src/app.ts
import helmet from 'helmet';
app.use(helmet());
```

### 5. Environment Variable Validation

Already implemented in `src/config/env.ts`

## 📊 Monitoring & Logging

### Option 1: Sentry (Error Tracking)

```bash
npm install @sentry/node
```

```typescript
// src/server.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### Option 2: LogRocket

For session replay and monitoring

### Option 3: Datadog

For comprehensive monitoring

## 🗄️ Database Management in Production

### Backup Strategy

Supabase automatically backs up your database daily. For additional safety:

1. Enable Point-in-Time Recovery in Supabase
2. Export database periodically:
   ```bash
   pg_dump $DATABASE_URL > backup.sql
   ```

### Migration Strategy

1. **Test migrations locally first**
2. **Backup database before migration**
3. **Run migration during low-traffic period**
4. **Monitor for errors**

```bash
# Production migration
npx prisma migrate deploy
```

### Rollback Plan

If migration fails:
```bash
# Restore from backup
psql $DATABASE_URL < backup.sql
```

## 🚦 Health Checks

Add health check endpoint (already implemented):

```
GET /health
```

Configure your platform to ping this endpoint.

## 📈 Scaling Considerations

### Horizontal Scaling

Most platforms support auto-scaling based on:
- CPU usage
- Memory usage
- Request count

### Database Connection Pooling

Already configured with Supabase pooler (port 6543)

### Caching

Consider adding Redis for:
- Session storage
- API response caching
- Rate limiting

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Railway
        run: railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

## 📱 Connecting Mobile App

Update your React Native app's API URL:

```typescript
// src/config/api.ts
const API_URL = __DEV__
  ? 'http://localhost:3000/api'
  : 'https://your-production-api.com/api';
```

## ✅ Post-Deployment Checklist

- [ ] API is accessible at production URL
- [ ] Health check endpoint responds
- [ ] Database migrations applied
- [ ] Authentication works
- [ ] CORS allows your frontend domain
- [ ] Error logging is working
- [ ] Monitoring is set up
- [ ] Backup strategy in place
- [ ] SSL certificate is valid
- [ ] Environment variables are set correctly

## 🆘 Troubleshooting

### Issue: Database Connection Timeout

**Solution**: Check if using pooled connection (port 6543) with `?pgbouncer=true`

### Issue: CORS Errors

**Solution**: Add your frontend domain to `ALLOWED_ORIGINS`

### Issue: 502 Bad Gateway

**Solution**: Check if server is running and PORT is correct

### Issue: Migrations Failing

**Solution**: Use DIRECT_URL (port 5432) for migrations, not pooled connection

## 📚 Resources

- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)
- [Supabase Production Checklist](https://supabase.com/docs/guides/platform/going-into-prod)
- [Prisma Production Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)

---

**Your backend is production-ready! 🚀**
