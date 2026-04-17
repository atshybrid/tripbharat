# 🔧 PostgreSQL (Neon DB) Setup Guide

## ⚠️ Connection Error Fix

You're getting: `password authentication failed for user 'neondb_owner'`

This means the password in your connection string is incorrect or expired.

---

## ✅ How to Get Correct Connection String

### Option 1: From Neon Dashboard (Recommended)

1. **Login to Neon**
   - Go to: https://console.neon.tech
   - Login with your account

2. **Select Your Project**
   - Click on "tripbharat" project (or your project name)

3. **Get Connection String**
   - You'll see "Connection Details" or "Connect" section
   - Click "Connection string" dropdown
   - Select: **Node.js** or **Pooler**
   - Copy the FULL connection string shown

4. **Update .env File**
   ```env
   POSTGRES_URI=postgresql://[THE_STRING_YOU_JUST_COPIED]
   ```

### Option 2: Reset Password

If you can't find the connection string:

1. Go to Neon Dashboard → Settings → Reset Password
2. Generate new password
3. Rebuild connection string:
   ```
   postgresql://[username]:[new_password]@[host]/[database]?sslmode=require
   ```

---

## 📝 Current vs Correct Format

**Your current (may be wrong):**
```
postgresql://neondb_owner:npg_4CeNj3VMXmJg@ep-lingering-fire-aiyplley-pooler.us-east-1.aws.neon.tech/tripbharat?sslmode=require
```

**Should look like:**
```
postgresql://neondb_owner:[ACTUAL_PASSWORD]@ep-lingering-fire-aiyplley-pooler.us-east-1.aws.neon.tech/tripbharat?sslmode=require
```

---

## 🔑 Connection String Breakdown

```
postgresql://[username]:[password]@[host]/[database]?[options]
           ↓          ↓            ↓         ↓         ↓
       neondb_owner  PASSWORD   ep-ling... tripbharat sslmode=require
```

---

## 🧪 Test Connection

After updating .env:

```bash
npm run dev
```

**Success looks like:**
```
✓ PostgreSQL Connected: tripbharat
✓ PostgreSQL models initialized
✓ Server running on port 5000
```

**Failure looks like:**
```
✗ password authentication failed
```

---

## 🔄 Switch Back to MongoDB Temporarily

If you want to continue development while fixing PostgreSQL:

**In .env file:**
```env
# Switch database type
DB_TYPE=mongodb
MONGODB_URI=mongodb://localhost:27017/sktours
```

Then you can fix PostgreSQL connection later!

---

## 🆘 Still Not Working?

### Check These:

1. **Password has special characters?**
   - URL encode them:
     - `@` → `%40`
     - `#` → `%23`
     - `&` → `%26`
     - `?` → `%3F`
     - `=` → `%3D`

2. **Using wrong endpoint?**
   - Neon has 2 endpoints:
     - **Direct**: `ep-xxx.region.aws.neon.tech` (slower, no pooler)
     - **Pooled**: `ep-xxx-pooler.region.aws.neon.tech` (faster, recommended)
   
   Use **pooler** endpoint!

3. **Database doesn't exist?**
   - Create database in Neon Dashboard:
     - Dashboard → Databases → Create Database
     - Name: `tripbharat`

---

## ✨ Quick Fix Commands

**If you want to use MongoDB instead:**
```bash
cd /Volumes/Storage/kaburlu_softwares/Travel/Travel_nodejs
```

Edit .env:
```env
DB_TYPE=mongodb
MONGODB_URI=mongodb://localhost:27017/tripbharat
```

Start MongoDB:
```bash
brew services start mongodb-community@7.0
```

Run server:
```bash
npm run dev
```

---

## 📞 Need the Correct String?

1. Go to Neon Dashboard
2. Find your exact connection string
3. Copy it EXACTLY as shown
4. Paste in .env

That's it! 🎉
