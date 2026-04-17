# 📋 Setup Checklist - SK ToursiQ Backend

## ✅ Initial Setup (Completed)

- [x] Project structure created
- [x] package.json with all dependencies
- [x] .env.example with all configurations
- [x] Database models (7 models)
- [x] Middleware (auth, admin, upload, validation, error handling)
- [x] Utilities (logger, email service, image upload, helpers)
- [x] Configuration files (database, cloudinary, razorpay, openai)
- [x] Server files (server.js, app.js)
- [x] Authentication controller (COMPLETE)
- [x] Package controller (COMPLETE)
- [x] All route files created

---

## ⚙️ Environment Configuration

### Step 1: Copy and Configure .env
```bash
cp .env.example .env
```

### Step 2: Required Environment Variables

#### Mandatory (Must Configure):
- [ ] `MONGODB_URI` - MongoDB connection string
- [ ] `JWT_SECRET` - Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- [ ] `FRONTEND_URL` - Your frontend URL (http://localhost:3000)
- [ ] `RAZORPAY_KEY_ID` - From Razorpay dashboard
- [ ] `RAZORPAY_KEY_SECRET` - From Razorpay dashboard
- [ ] `CLOUDINARY_CLOUD_NAME` - From Cloudinary console
- [ ] `CLOUDINARY_API_KEY` - From Cloudinary console
- [ ] `CLOUDINARY_API_SECRET` - From Cloudinary console
- [ ] `EMAIL_USER` - Your Gmail address
- [ ] `EMAIL_PASSWORD` - Gmail App Password (16 characters)

#### Optional (Recommended):
- [ ] `OPENAI_API_KEY` - For AI-powered recommendations
- [ ] `NODE_ENV` - Set to 'production' for live
- [ ] `PORT` - Server port (default 5000)

---

## 🗄️ Database Setup

### Option 1: Local MongoDB
```bash
# Install MongoDB
# macOS: brew install mongodb-community
# Ubuntu: sudo apt install mongodb

# Start MongoDB
# macOS: brew services start mongodb-community
# Ubuntu: sudo systemctl start mongod

# In .env:
MONGODB_URI=mongodb://localhost:27017/sktours
```

### Option 2: MongoDB Atlas (Recommended for Production)
1. [ ] Sign up at https://www.mongodb.com/cloud/atlas
2. [ ] Create cluster (Free tier available)
3. [ ] Create database user
4. [ ] Whitelist IP: 0.0.0.0/0 (all IPs)
5. [ ] Get connection string
6. [ ] Update .env with connection string

---

## 🔐 API Keys Setup

### 1. Razorpay Payment Gateway
- [ ] Sign up: https://dashboard.razorpay.com/signup
- [ ] Verify email and phone
- [ ] Go to Settings → API Keys
- [ ] Generate Test Keys (for development)
- [ ] Copy Key ID and Key Secret to .env
- [ ] **For Production:** Generate Live Keys

### 2. Cloudinary Image Storage
- [ ] Sign up: https://cloudinary.com/users/register/free
- [ ] Verify email
- [ ] Go to Dashboard
- [ ] Copy Cloud Name, API Key, API Secret
- [ ] Paste in .env

### 3. Gmail for Email Service
- [ ] Enable 2-Factor Authentication in Google Account
- [ ] Go to: https://myaccount.google.com/apppasswords
- [ ] Select App: Mail, Device: Other (Node.js App)
- [ ] Generate password
- [ ] Copy 16-character password (ignore spaces)
- [ ] Add to .env as EMAIL_PASSWORD

### 4. OpenAI (Optional - AI Features)
- [ ] Sign up: https://platform.openai.com/signup
- [ ] Go to API Keys section
- [ ] Create new secret key
- [ ] Copy key (starts with sk-)
- [ ] Add to .env as OPENAI_API_KEY

---

## 📦 Installation & Running

### Install Dependencies
```bash
npm install
```

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Verify Server is Running
```bash
curl http://localhost:5000/health
```

Expected Response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-02-05T10:30:00.000Z",
  "environment": "development"
}
```

---

## 🧪 Testing the Setup

### 1. Test Health Endpoint
```bash
curl http://localhost:5000/health
```

### 2. Test User Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test1234!",
    "confirmPassword": "Test1234!",
    "phone": "+91 9876543210"
  }'
```

### 3. Test User Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234!"
  }'
```

### 4. Test Protected Route
```bash
# Copy token from login response, then:
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 5. Create Admin User
First, create a user, then manually update in MongoDB:
```javascript
// In MongoDB Compass or Shell:
db.users.updateOne(
  { email: "admin@sktours.com" },
  { $set: { role: "admin" } }
)
```

Or create directly with script:
```bash
# Create scripts/createAdmin.js
node scripts/createAdmin.js
```

---

## 🛠️ Implementation Status

### ✅ Fully Implemented Controllers:
1. **authController.js** - Complete authentication system
   - Signup with referral code support
   - Login with account locking after failed attempts
   - Get current user
   - Update profile with image upload
   - Change password
   - Forgot/Reset password

2. **packageController.js** - Complete package management
   - Get all packages with filters, pagination, sorting
   - Get package by ID
   - Create package (admin only)
   - Update package (admin only)
   - Delete package (admin only)

### ⚠️ Need Implementation (Templates Created):
3. **bookingController.js** - Needs implementation
4. **walletController.js** - Needs implementation
5. **getTogetherController.js** - Needs implementation
6. **referralController.js** - Needs implementation
7. **paymentController.js** - Needs implementation
8. **adminController.js** - Needs implementation

---

## 📝 Next Steps - Implementation Guide

### Priority 1: Wallet & Payment (Critical for Bookings)

#### walletController.js
```javascript
// Implement these functions:
1. getWalletBalance() - Fetch user wallet
2. getWalletTransactions() - List all transactions with pagination
3. addMoney() - Create Razorpay order
4. verifyPayment() - Verify signature and credit wallet
5. withdrawMoney() - Create withdrawal request
```

#### paymentController.js
```javascript
// Implement these functions:
1. createOrder() - Create Razorpay order for bookings
2. verifyPayment() - Verify payment signature
3. handleWebhook() - Process Razorpay webhooks
```

**Reference:** Check src/utils/helpers.js for `verifyRazorpaySignature()`

### Priority 2: Booking System

#### bookingController.js
```javascript
// Implement these functions:
1. createBooking() - Book package with payment
   - Validate package exists and has seats
   - Calculate pricing with taxes
   - Process payment (wallet or Razorpay)
   - Update package seats
   - Send confirmation email
   
2. getUserBookings() - Get user's bookings with pagination
3. getBookingById() - Get booking details
4. cancelBooking() - Cancel and refund
   - Calculate refund based on cancellation policy
   - Credit wallet if payment was made
   - Send cancellation email
```

**Reference:** Check src/utils/helpers.js for `calculateRefund()`

### Priority 3: Get-Together & Referral

#### getTogetherController.js
```javascript
// Implement these functions:
1. getAllTrips() - Get user's trips
2. getTripById() - Get trip details with participants
3. createTrip() - Create new group trip
   - Generate unique invite code
   - Create invite link
   - Send invitation emails
4. updateTrip() - Update trip (creator only)
5. addParticipant() - Add participant by email
6. joinTrip() - Join via invite code
7. voteForPackage() - Vote for package
8. confirmTrip() - Confirm and create group booking
```

#### referralController.js
```javascript
// Implement these functions:
1. getReferralInfo() - Get user's referral stats
2. applyReferralCode() - Apply code (for existing users)

// Note: Referral creation is handled in authController.signup
// Referral completion should be triggered in bookingController.createBooking
```

### Priority 4: Admin Dashboard

#### adminController.js
```javascript
// Implement these functions:
1. getDashboardStats() - Get overview stats
   - Total users, bookings, revenue
   - Today's bookings
   - Monthly revenue chart
   
2. getAllUsers() - Get all users with filters
3. getAllBookings() - Get all bookings with filters
4. updateBookingStatus() - Update booking status
```

---

## 🔍 Code Examples

### Example: Wallet Add Money (Razorpay Integration)
```javascript
exports.addMoney = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const userId = req.user.id;

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `wallet_${userId}_${Date.now()}`,
      notes: {
        userId,
        type: 'wallet_recharge'
      }
    });

    res.status(200).json({
      success: true,
      message: 'Payment initiated',
      data: {
        orderId: order.id,
        amount: amount,
        currency: 'INR',
        razorpayKey: process.env.RAZORPAY_KEY_ID
      }
    });
  } catch (error) {
    next(error);
  }
};
```

### Example: Verify Payment and Credit Wallet
```javascript
exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    // Verify signature
    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return next(new AppError('Invalid payment signature', 400));
    }

    // Get payment details
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    const amount = payment.amount / 100; // Convert from paise

    // Use transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Update wallet
      const user = await User.findById(req.user.id).session(session);
      const balanceBefore = user.wallet.balance;
      user.wallet.balance += amount;
      await user.save({ session });

      // Create transaction record
      const transaction = await WalletTransaction.create([{
        userId: req.user.id,
        type: 'credit',
        amount,
        description: 'Wallet recharge via Razorpay',
        balanceBefore,
        balanceAfter: user.wallet.balance,
        status: 'completed',
        paymentMethod: 'razorpay',
        metadata: {
          razorpay_order_id,
          razorpay_payment_id
        }
      }], { session });

      await session.commitTransaction();

      res.status(200).json({
        success: true,
        message: 'Payment verified and wallet credited',
        data: {
          transactionId: transaction[0]._id,
          amount,
          newBalance: user.wallet.balance
        }
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    next(error);
  }
};
```

---

## 🚀 Deployment Checklist

### Before Deployment:
- [ ] All controllers implemented
- [ ] All endpoints tested
- [ ] MongoDB Atlas configured
- [ ] Environment variables set on hosting platform
- [ ] Razorpay live keys configured
- [ ] Email service configured (SendGrid for production)
- [ ] CORS configured for production frontend URL
- [ ] NODE_ENV=production
- [ ] Implement remaining TODOs in controller files
- [ ] Add API rate limiting for production
- [ ] Enable HTTPS
- [ ] Set up logging service (Sentry, LogRocket)
- [ ] Create backup strategy for MongoDB

### Recommended Hosting Platforms:
1. **Railway** - https://railway.app (Easy deployment)
2. **Render** - https://render.com (Free tier available)
3. **Heroku** - https://heroku.com (Popular choice)
4. **DigitalOcean** - https://digitalocean.com (VPS option)
5. **AWS/Azure/GCP** - For enterprise-level

---

## 📞 Support & Resources

- **Main README:** [README.md](./README.md) - Complete documentation
- **Quick Start:** [QUICK_START.md](./QUICK_START.md) - 5-minute setup
- **API Spec:** Check frontend project for COMPLETE_BACKEND_API_SPEC.md
- **Logs:** Check `logs/` directory for error logs
- **MongoDB Docs:** https://docs.mongodb.com/
- **Razorpay Docs:** https://razorpay.com/docs/
- **Cloudinary Docs:** https://cloudinary.com/documentation

---

## ✅ Final Checklist

Before running:
- [ ] Dependencies installed (`npm install`)
- [ ] .env file created and configured
- [ ] MongoDB running (local or Atlas)
- [ ] All required API keys added
- [ ] JWT_SECRET generated
- [ ] Server starts without errors (`npm run dev`)
- [ ] Health endpoint responds
- [ ] Can create user (signup works)
- [ ] Can login user
- [ ] Email sending works (check spam folder)
- [ ] Image upload works (test package creation)

---

**You're ready to start implementing! 🎉**

Start with Priority 1 (Wallet & Payment) as they're critical for the booking system.

Use the authentication and package controllers as reference for implementation patterns.

Good luck! 🚀
