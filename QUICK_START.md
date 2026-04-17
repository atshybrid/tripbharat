# 🚀 Quick Start Guide - SK ToursiQ Backend

## ⚡ Get Up and Running in 5 Minutes!

### Step 1: Install Dependencies (1 minute)
```bash
npm install
```

### Step 2: Setup Environment (2 minutes)

1. **Copy environment file:**
```bash
cp .env.example .env
```

2. **Edit `.env` file and add these ESSENTIAL values:**

```env
# MongoDB (Required)
MONGODB_URI=mongodb://localhost:27017/sktours

# JWT Secret (Required) - Generate with command below
JWT_SECRET=paste_generated_secret_here

# Frontend URL (Required)
FRONTEND_URL=http://localhost:3000

# Razorpay (Get from dashboard.razorpay.com)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxx

# Cloudinary (Get from cloudinary.com/console)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx

# Email - Gmail (Enable 2FA and create App Password)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your_16_char_app_password
```

3. **Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the output and paste it as `JWT_SECRET` in `.env`

### Step 3: Start the Server (1 minute)

```bash
npm run dev
```

You should see:
```
Server running in development mode on port 5000
MongoDB Connected: localhost
API URL: http://localhost:5000/api
```

### Step 4: Test the API (1 minute)

Open browser or run:
```bash
curl http://localhost:5000/health
```

Expected:
```json
{
  "success": true,
  "message": "Server is running"
}
```

---

## 🧪 Test User Signup & Login

### Create a Test User
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test1234!",
    "confirmPassword": "Test1234!"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234!"
  }'
```

Copy the `token` from response. Use it for protected routes:

```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📝 What's Next?

The following controllers need implementation (currently return 501):
- ✅ **authController.js** - FULLY IMPLEMENTED
- ✅ **packageController.js** - FULLY IMPLEMENTED
- ⚠️ **bookingController.js** - Needs implementation
- ⚠️ **walletController.js** - Needs implementation
- ⚠️ **getTogetherController.js** - Needs implementation
- ⚠️ **referralController.js** - Needs implementation
- ⚠️ **paymentController.js** - Needs implementation
- ⚠️ **adminController.js** - Needs implementation

---

## 🔑 Getting API Keys

### 1. MongoDB Atlas (Free - 5 minutes)
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up / Login
3. Create New Project → Build a Cluster (Free tier)
4. Database Access → Add User (username, password)
5. Network Access → Add IP Address (0.0.0.0/0 for all)
6. Connect → Connect your application
7. Copy connection string
8. Replace `<password>` with your password
9. Paste in `.env` as `MONGODB_URI`

### 2. Razorpay (Free Test Mode - 3 minutes)
1. Go to https://dashboard.razorpay.com/signup
2. Complete signup
3. Dashboard → Settings → API Keys
4. Generate Test Keys
5. Copy Key ID and Secret
6. Paste in `.env`

### 3. Cloudinary (Free - 3 minutes)
1. Go to https://cloudinary.com/users/register/free
2. Sign up
3. Dashboard → Copy:
   - Cloud Name
   - API Key
   - API Secret
4. Paste in `.env`

### 4. Gmail App Password (2 minutes)
1. Enable 2-Step Verification: https://myaccount.google.com/security
2. Go to App passwords: https://myaccount.google.com/apppasswords
3. Select app: Mail, Device: Other (Node.js)
4. Generate → Copy 16-character password (no spaces)
5. Paste in `.env` as `EMAIL_PASSWORD`

### 5. OpenAI (Optional - 2 minutes)
1. Go to https://platform.openai.com/signup
2. Sign up / Login
3. API Keys → Create new secret key
4. Copy key (starts with sk-)
5. Paste in `.env`

---

## 🐛 Common Issues

### "MongoDB connection failed"
**Solution:** Make sure MongoDB is running:
```bash
# macOS
brew services start mongodb-community

# Or use MongoDB Atlas (cloud)
```

### "JWT Secret missing"
**Solution:** Generate and add to `.env`:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### "Email sending failed"
**Solution:** 
- Use Gmail App Password (not regular password)
- Enable 2FA first
- No spaces in password

### "Port 5000 already in use"
**Solution:** Change port in `.env`:
```env
PORT=5001
```

---

## 📚 Documentation

- **Complete API Docs:** See README.md
- **API Spec:** See COMPLETE_BACKEND_API_SPEC.md (in frontend folder if exists)
- **Health Check:** http://localhost:5000/health
- **API Base:** http://localhost:5000/api

---

## ✅ Checklist Before Production

- [ ] MongoDB Atlas setup (not local)
- [ ] Strong JWT_SECRET (32+ characters)
- [ ] Razorpay LIVE keys (not test)
- [ ] Gmail/SendGrid for emails
- [ ] All environment variables set
- [ ] CORS configured for frontend domain
- [ ] Implement remaining controllers
- [ ] Test all endpoints
- [ ] Enable HTTPS
- [ ] Set NODE_ENV=production

---

**You're all set! Happy coding! 🎉**

For support, check README.md or create an issue.
