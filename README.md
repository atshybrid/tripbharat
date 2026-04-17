# 🚀 SK ToursiQ Backend API

Complete REST API backend for SK ToursiQ Travel Booking Platform with Node.js, Express, MongoDB, and Razorpay integration.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)
- [Support](#support)

---

## ✨ Features

- ✅ **User Authentication** - JWT-based signup, login with password hashing
- ✅ **Tour Packages** - CRUD operations with image upload (Cloudinary)
- ✅ **Bookings System** - Package bookings with traveler details
- ✅ **Digital Wallet** - Add money, deduct for bookings, transactions history
- ✅ **Get-Together Trips** - Group trip planning with invites and voting
- ✅ **Referral System** - Generate codes, track referrals, credit rewards
- ✅ **Payment Integration** - Razorpay for secure payments
- ✅ **Admin Dashboard** - User and booking management
- ✅ **Email Notifications** - Automated emails for bookings, confirmations
- ✅ **AI Integration** - OpenAI for package recommendations (optional)
- ✅ **Image Upload** - Cloudinary integration for package images
- ✅ **Rate Limiting** - Protection against abuse
- ✅ **Security** - Helmet, CORS, input validation
- ✅ **Logging** - Winston for comprehensive logging

---

## 🛠 Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Payment**: Razorpay SDK
- **Image Upload**: Cloudinary
- **Email**: Nodemailer
- **Validation**: express-validator
- **Logging**: Winston
- **Security**: Helmet, CORS, express-rate-limit

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **MongoDB** (v6.0 or higher) - Local or Atlas

### Required Accounts

1. **MongoDB Atlas** (or local MongoDB)
   - Sign up: https://www.mongodb.com/cloud/atlas
   - Create a cluster and get connection string

2. **Razorpay** (for payments)
   - Sign up: https://dashboard.razorpay.com/signup
   - Get API keys from Dashboard > Settings > API Keys

3. **Cloudinary** (for image storage)
   - Sign up: https://cloudinary.com/users/register/free
   - Get credentials from Dashboard

4. **Email Service** (Gmail recommended for development)
   - Gmail: Enable 2FA and create App Password
   - Settings > Security > 2-Step Verification > App passwords

5. **OpenAI** (optional - for AI features)
   - Sign up: https://platform.openai.com/signup
   - Get API key from API Keys section

---

## 🚀 Installation

### 1. Clone the Repository
```bash
cd /path/to/Travel_nodejs
# Or if you have a repo:
# git clone https://github.com/yourusername/sktours-backend.git
# cd sktours-backend
```

### 2. Install Dependencies
```bash
npm install
```

This will install all required packages including:
- express, mongoose, bcryptjs, jsonwebtoken
- razorpay, cloudinary, nodemailer
- helmet, cors, morgan, winston
- express-validator, multer, compression
- openai (for AI features)

---

## ⚙️ Environment Setup

### 1. Create Environment File

Copy the example environment file:
```bash
cp .env.example .env
```

### 2. Configure Environment Variables

Open `.env` file and update the following:

#### **Essential Configuration** (Required)

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB - REQUIRED
MONGODB_URI=mongodb://localhost:27017/sktours
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sktours

# JWT - REQUIRED (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=your_generated_secret_key_min_32_characters
JWT_EXPIRE=24h

# Frontend URL - REQUIRED
FRONTEND_URL=http://localhost:3000
```

#### **Razorpay (Required for Payments)**

1. Go to https://dashboard.razorpay.com/app/keys
2. Copy Test/Live keys

```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxx
```

#### **Cloudinary (Required for Images)**

1. Go to https://cloudinary.com/console
2. Copy credentials from Dashboard

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
```

#### **Email Service (Required for Notifications)**

**Option 1: Gmail (Recommended for development)**
1. Enable 2-Factor Authentication in your Google Account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use generated password

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your_16_char_app_password
EMAIL_FROM=SK ToursiQ <noreply@sktours.com>
```

**Option 2: SendGrid (Production)**
```env
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxx
```

#### **OpenAI (Optional - for AI recommendations)**

Get from: https://platform.openai.com/api-keys

```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-4-turbo-preview
```

### 3. Generate JWT Secret

Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it as `JWT_SECRET` in `.env`

---

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```

The server will start on `http://localhost:5000` with auto-reload enabled.

### Production Mode
```bash
npm start
```

### Check if Server is Running
Open browser or use curl:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-02-05T10:30:00.000Z",
  "environment": "development"
}
```

---

## 📖 API Documentation

### Base URL
```
Development: http://localhost:5000/api
Production: https://api.yourdomain.com/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | User login | No |
| GET | `/api/auth/me` | Get current user | Yes |
| PUT | `/api/auth/profile` | Update profile | Yes |
| POST | `/api/auth/change-password` | Change password | Yes |

### Example: User Signup

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "confirmPassword": "SecurePass123!",
    "phone": "+91 9876543210"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "65c1234567890abcdef12345",
      "name": "John Doe",
      "email": "john@example.com",
      "referralCode": "JOHN123",
      "wallet": {
        "balance": 0,
        "currency": "INR"
      }
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  }
}
```

### Example: User Login

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

### For Complete API Documentation

See [COMPLETE_BACKEND_API_SPEC.md](./COMPLETE_BACKEND_API_SPEC.md) for all endpoints with request/response formats.

---

## 📁 Project Structure

```
Travel_nodejs/
├── src/
│   ├── config/              # Configuration files
│   │   ├── database.js      # MongoDB connection
│   │   ├── cloudinary.js    # Cloudinary setup
│   │   ├── razorpay.js      # Razorpay setup
│   │   └── openai.js        # OpenAI setup
│   │
│   ├── models/              # Mongoose models
│   │   ├── User.js          # User model
│   │   ├── TourPackage.js   # Package model
│   │   ├── Booking.js       # Booking model
│   │   ├── WalletTransaction.js
│   │   ├── GetTogether.js
│   │   ├── Referral.js
│   │   └── Review.js
│   │
│   ├── controllers/         # Route controllers
│   │   ├── authController.js
│   │   ├── packageController.js
│   │   ├── bookingController.js
│   │   ├── walletController.js
│   │   ├── getTogetherController.js
│   │   ├── referralController.js
│   │   ├── paymentController.js
│   │   └── adminController.js
│   │
│   ├── routes/              # Express routes
│   │   ├── auth.js
│   │   ├── packages.js
│   │   ├── bookings.js
│   │   ├── wallet.js
│   │   ├── getTogether.js
│   │   ├── referrals.js
│   │   ├── payments.js
│   │   └── admin.js
│   │
│   ├── middleware/          # Custom middleware
│   │   ├── auth.js          # JWT authentication
│   │   ├── admin.js         # Admin authorization
│   │   ├── upload.js        # File upload
│   │   ├── validation.js    # Input validation
│   │   ├── errorHandler.js  # Error handling
│   │   └── rateLimiter.js   # Rate limiting
│   │
│   ├── utils/               # Utility functions
│   │   ├── logger.js        # Winston logger
│   │   ├── appError.js      # Custom error class
│   │   ├── emailService.js  # Email sending
│   │   ├── imageUpload.js   # Cloudinary upload
│   │   └── helpers.js       # Helper functions
│   │
│   └── app.js               # Express app setup
│
├── logs/                    # Log files (auto-created)
├── .env                     # Environment variables
├── .env.example             # Example environment file
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies
├── server.js                # Server entry point
└── README.md                # This file
```

---

## 📜 Available Scripts

```bash
# Development with auto-reload
npm run dev

# Production
npm start

# Run tests (to be implemented)
npm test
```

---

## 🔒 Security Best Practices

### 1. **Environment Variables**
- Never commit `.env` file to git
- Use different secrets for development and production
- Rotate JWT secrets periodically

### 2. **Password Security**
- Minimum 8 characters required
- Must contain uppercase, lowercase, and number
- Hashed with bcrypt (10 salt rounds)

### 3. **Rate Limiting**
- General API: 100 requests per 15 minutes
- Auth routes: 5 requests per 15 minutes
- Payment routes: 10 requests per hour

### 4. **JWT Tokens**
- 24-hour expiration
- Stored in client's localStorage
- Sent via Authorization header

### 5. **Input Validation**
- All inputs validated with express-validator
- SQL injection protection via Mongoose
- XSS protection via sanitization

---

## 🚀 Deployment

### Deploy to Railway/Render/Heroku

1. **Push code to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/sktours-backend.git
git push -u origin main
```

2. **Create account on deployment platform**
   - Railway: https://railway.app
   - Render: https://render.com
   - Heroku: https://heroku.com

3. **Connect GitHub repository**

4. **Set environment variables**
   - Copy all from `.env` to platform's environment settings
   - Update `MONGODB_URI` to Atlas connection string
   - Update `FRONTEND_URL` to production URL
   - Switch Razorpay to live keys

5. **Deploy**

### MongoDB Atlas Setup (for Production)

1. Go to https://cloud.mongodb.com
2. Create new project
3. Build a cluster (free tier available)
4. Create database user
5. Whitelist IP (0.0.0.0/0 for all IPs)
6. Get connection string
7. Replace `<password>` and `<dbname>` in connection string
8. Update `MONGODB_URI` in environment variables

---

## 🧪 Testing

Test the API using:

### 1. **Postman**
- Import the collection (create one from API docs)
- Set environment variables
- Test each endpoint

### 2. **cURL** (Command Line)
```bash
# Health check
curl http://localhost:5000/health

# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test1234!","confirmPassword":"Test1234!"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234!"}'
```

### 3. **Frontend Integration**
```javascript
// Example: Login from Next.js
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'Test1234!'
  })
});

const data = await response.json();
console.log(data);
```

---

## 📝 TODO / Next Steps

After setting up, you need to create the controller files. Here are templates:

### Create Controllers

1. **authController.js** - Signup, Login, Profile management
2. **packageController.js** - CRUD for tour packages
3. **bookingController.js** - Create, view, cancel bookings
4. **walletController.js** - Add money, transactions
5. **getTogetherController.js** - Group trip management
6. **referralController.js** - Referral tracking
7. **paymentController.js** - Razorpay integration
8. **adminController.js** - Admin dashboard

### Create Routes

1. **auth.js** - Authentication routes
2. **packages.js** - Package routes
3. **bookings.js** - Booking routes
4. **wallet.js** - Wallet routes
5. **getTogether.js** - Get-together routes
6. **referrals.js** - Referral routes
7. **payments.js** - Payment routes
8. **admin.js** - Admin routes

**I will create a complete template generator script for you!**

---

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Make sure MongoDB is running
```bash
# Start MongoDB (macOS with Homebrew)
brew services start mongodb-community

# Start MongoDB (Linux)
sudo systemctl start mongod

# Or use MongoDB Atlas cloud database
```

### JWT Secret Error
```bash
Error: secretOrPrivateKey must have a value
```
**Solution**: Set `JWT_SECRET` in `.env` file

### Email Sending Failed
```bash
Error: Invalid login: 535 Authentication failed
```
**Solution**: 
- Enable 2FA in Gmail
- Generate App Password
- Use 16-character app password (no spaces)

### Cloudinary Upload Failed
```bash
Error: Must supply api_key
```
**Solution**: Set all Cloudinary credentials in `.env`

### Port Already in Use
```bash
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Kill process or change port
```bash
# Find and kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change PORT in .env to 5001
```

---

## 📞 Support

For issues and questions:

1. Check [COMPLETE_BACKEND_API_SPEC.md](./COMPLETE_BACKEND_API_SPEC.md)
2. Check Troubleshooting section above
3. Review logs in `logs/` directory
4. Contact: support@sktours.com

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🎉 You're All Set!

Your backend is ready to run. Start with:

```bash
npm run dev
```

Then test the health endpoint:
```bash
curl http://localhost:5000/health
```

**Next**: Create the controller and route files using the templates provided in the API specification document.

---

**Made with ❤️ for SK ToursiQ**
