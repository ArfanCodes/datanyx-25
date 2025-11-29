# Supabase Connection Fix Guide

## ✅ Solution Steps

### Step 1: Update your `.env` file

You need **TWO** connection strings for Supabase:

```env
# Pooled connection (port 6543) - for app queries
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD_HERE@db.iwedvgyucyqaghirtxbl.supabase.co:6543/postgres?pgbouncer=true"

# Direct connection (port 5432) - for migrations
DIRECT_URL="postgresql://postgres:YOUR_PASSWORD_HERE@db.iwedvgyucyqaghirtxbl.supabase.co:5432/postgres"
```

### Step 2: URL-Encode Your Password

**CRITICAL**: If your password contains special characters, you MUST encode them:

| Character | Encoded As |
|-----------|------------|
| `@` | `%40` |
| `#` | `%23` |
| `$` | `%24` |
| `%` | `%25` |
| `&` | `%26` |
| `+` | `%2B` |
| `:` | `%3A` |
| `/` | `%2F` |
| `?` | `%3F` |
| `=` | `%3D` |

**Example:**
- If your password is `Pass@123#` 
- It becomes: `Pass%40123%23`

### Step 3: Get Your Actual Password from Supabase

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **Settings** (gear icon in sidebar)
4. Go to **Database** section
5. Under **Connection string**, click **URI**
6. Copy the connection string - it will look like:
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@[HOST]:6543/postgres
   ```
7. Extract the password from between `:` and `@`

### Step 4: Check if Database is Paused

Supabase free tier databases pause after 7 days of inactivity:

1. Go to your Supabase dashboard
2. Look for a message saying "Database is paused"
3. If paused, click **Restore** or **Resume**
4. Wait 1-2 minutes for it to start

### Step 5: Test Connection

Run the test script:

```bash
node test-connection.js
```

If successful, you'll see:
```
✅ Database connection successful!
📊 PostgreSQL version: ...
```

### Step 6: Run Migrations

Once connection works:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

## 🔍 Common Issues

### Issue 1: "Can't reach database server"
**Cause**: Wrong port or password encoding
**Fix**: 
- Use port 6543 for DATABASE_URL
- Use port 5432 for DIRECT_URL
- URL-encode your password

### Issue 2: "Database is paused"
**Cause**: Supabase free tier auto-pauses
**Fix**: Resume database from dashboard

### Issue 3: "Authentication failed"
**Cause**: Wrong password or not URL-encoded
**Fix**: 
- Get fresh password from Supabase
- Encode special characters
- Don't include `postgres.` prefix in password

### Issue 4: "SSL connection required"
**Cause**: Missing SSL parameter
**Fix**: Add `?sslmode=require` to connection string

## 📝 Complete Example

Here's a complete working example:

```env
# If your Supabase project ref is: iwedvgyucyqaghirtxbl
# And your password is: MyPass@123

DATABASE_URL="postgresql://postgres:MyPass%40123@db.iwedvgyucyqaghirtxbl.supabase.co:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:MyPass%40123@db.iwedvgyucyqaghirtxbl.supabase.co:5432/postgres"
```

## 🚀 Quick Commands

```bash
# 1. Test connection
node test-connection.js

# 2. Generate Prisma Client
npx prisma generate

# 3. Run migrations
npx prisma migrate dev --name init

# 4. Open Prisma Studio (optional)
npx prisma studio

# 5. Start dev server
npm run dev
```

## 💡 Pro Tips

1. **Never commit `.env`** - it's in .gitignore for a reason
2. **Use environment variables** in production
3. **Keep `.env.example` updated** for team members
4. **Test connection** before running migrations
5. **Backup your database** before major schema changes

## 🆘 Still Having Issues?

1. Check Supabase status: https://status.supabase.com
2. Verify your project is not paused
3. Try using Supabase's connection string directly from dashboard
4. Check firewall/antivirus settings
5. Try from a different network

---

Need more help? Check the Supabase docs: https://supabase.com/docs/guides/database/connecting-to-postgres
