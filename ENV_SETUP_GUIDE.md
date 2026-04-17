# 🔑 Complete Environment Variables Guide

This guide helps you get ALL the API keys and set up your `.env` file correctly.

---

## 📋 Table of Contents
1. [MongoDB Setup](#1-mongodb-setup)
2. [Razorpay Setup](#2-razorpay-setup)
3. [Cloudinary Setup](#3-cloudinary-setup)
4. [Gmail Setup](#4-gmail-setup)
5. [OpenAI Setup](#5-openai-setup-optional)
6. [Verify Setup](#6-verify-setup)

---

## 1️⃣ MongoDB Setup

### Option A: MongoDB Atlas (Recommended - Free Cloud Database)

**Time: 5 minutes**

1. **Sign Up**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up with Google/GitHub or email
   - Verify email

2. **Create Organization & Project**
   - Click "Create an Organization"
   - Name: "SK ToursiQ"
   - Click "Create Organization"
   - Click "New Project"
   - Name: "Travel Backend"

3. **Create Cluster**
   - Click "Build a Cluster"
   - Choose **FREE** tier (M0 Sandbox)
   - Cloud Provider: **AWS** (recommended)
   - Region: Choose closest to you
   - Cluster Name: "sktours-cluster"
   - Click "Create Cluster" (takes 3-5 minutes)

4. **Create Database User**
   - Left sidebar → Database Access
   - Click "Add New Database User"
   - Authentication Method: **Password**
   - Username: `sktours_admin`
   - Password: Click "Autogenerate Secure Password" (SAVE THIS!)
   - Database User Privileges: **Read and write to any database**
   - Click "Add User"

5. **Whitelist IP Address**
   - Left sidebar → Network Access
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm
   - *Note: For production, restrict to your server's IP*

6. **Get Connection String**
   - Left sidebar → Database
   - Click "Connect" on your cluster
   - Click "Connect your application"
   - Driver: **Node.js**, Version: **4.1 or later**
   - Copy the connection string
   - Should look like:
     ```
     mongodb+srv://sktours_admin:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
     ```

7. **Update Connection String**
   - Replace `<password>` with the password you saved
   - Add database name after `.net/`: `sktours`
   - Final string:
     ```
     mongodb+srv://sktours_admin:YOUR_PASSWORD@cluster.mongodb.net/sktours?retryWrites=true&w=majority
     ```

8. **Add to .env**
   ```env
   MONGODB_URI=mongodb+srv://sktours_admin:YOUR_PASSWORD@cluster.mongodb.net/sktours?retryWrites=true&w=majority
   ```

### Option B: Local MongoDB

**Time: 10 minutes**

1. **Install MongoDB**

   **macOS:**
   ```bash
   brew tap mongodb/brew
   brew install mongodb-community@7.0
   ```

   **Ubuntu/Debian:**
   ```bash
   wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   ```

   **Windows:**
   - Download: https://www.mongodb.com/try/download/community
   - Run installer

2. **Start MongoDB**

   **macOS:**
   ```bash
   brew services start mongodb-community@7.0
   ```

   **Ubuntu/Debian:**
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

   **Windows:**
   - MongoDB runs as a service automatically

3. **Verify MongoDB is Running**
   ```bash
   mongosh
   ```
   If you see MongoDB shell, it's working!

4. **Add to .env**
   ```env
   MONGODB_URI=mongodb://localhost:27017/sktours
   ```

---

## 2️⃣ Razorpay Setup

**Time: 5 minutes** | **Cost: Free (Test Mode)**

1. **Sign Up**
   - Go to: https://dashboard.razorpay.com/signup
   - Enter business email
   - Verify email
   - Complete profile (use dummy data for testing)

2. **Skip KYC** (for testing)
   - You can use test mode without KYC
   - For production, complete KYC verification

3. **Get Test Keys**
   - Dashboard → Settings (gear icon) → API Keys
   - Under "Test Mode", click "Generate Test Keys"
   - You'll see:
     - **Key ID**: `rzp_test_xxxxxxxxxxxx`
     - **Key Secret**: `xxxxxxxxxxxxxxxx`
   - Click "Copy" for both

4. **Add to .env**
   ```env
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
   ```

5. **For Production** (Later)
   - Complete KYC
   - Switch to "Live Mode"
   - Generate Live Keys
   - Update .env with live keys

---

## 3️⃣ Cloudinary Setup

**Time: 3 minutes** | **Cost: Free (25GB, 25k transformations/month)**

1. **Sign Up**
   - Go to: https://cloudinary.com/users/register/free
   - Sign up with Google or email
   - Verify email

2. **Get Credentials**
   - After login, you'll see Dashboard
   - Under "Account Details", you'll see:
     - **Cloud Name**: `your_cloud_name`
     - **API Key**: `123456789012345`
     - **API Secret**: `xxxxxxxxxxxxxxxx` (click eye icon to reveal)
   - Click copy icons to copy each

3. **Add to .env**
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=123456789012345
   CLOUDINARY_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
   ```

4. **Optional: Create Upload Preset**
   - Settings → Upload
   - Scroll to "Upload presets"
   - Click "Add upload preset"
   - Preset name: `sktours`
   - Signing Mode: **Signed**
   - Folder: `sktours`
   - Save

---

## 4️⃣ Gmail Setup

**Time: 3 minutes** | **Cost: Free**

### Prerequisites:
- Gmail account
- 2-Step Verification enabled

### Steps:

1. **Enable 2-Step Verification**
   - Go to: https://myaccount.google.com/security
   - Scroll to "2-Step Verification"
   - Click "Get Started"
   - Follow instructions (you'll need your phone)

2. **Create App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Or: Google Account → Security → 2-Step Verification → App passwords
   - You might need to enter your Google password

3. **Generate Password**
   - Select app: **Mail**
   - Select device: **Other (Custom name)**
   - Name: `SK ToursiQ Backend`
   - Click "Generate"

4. **Copy Password**
   - You'll see a 16-character password like: `abcd efgh ijkl mnop`
   - **IMPORTANT**: Copy this password WITHOUT SPACES
   - Result: `abcdefghijklmnop`
   - You can't see this password again!

5. **Add to .env**
   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=abcdefghijklmnop
   EMAIL_FROM=SK ToursiQ <noreply@sktours.com>
   ```

### Alternative: SendGrid (For Production)

**Time: 5 minutes** | **Cost: Free (100 emails/day)**

1. **Sign Up**
   - Go to: https://signup.sendgrid.com/
   - Complete registration

2. **Verify Email**
   - Check your email and verify

3. **Create API Key**
   - Settings → API Keys
   - Click "Create API Key"
   - Name: `SK ToursiQ Backend`
   - Permissions: **Full Access**
   - Create & View
   - Copy the API key (starts with `SG.`)

4. **Add to .env**
   ```env
   EMAIL_SERVICE=sendgrid
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   EMAIL_FROM=SK ToursiQ <noreply@sktours.com>
   ```

---

## 5️⃣ OpenAI Setup (Optional)

**Time: 3 minutes** | **Cost: Free $5 credit for new accounts**

### If You Want AI-Powered Features:

1. **Sign Up**
   - Go to: https://platform.openai.com/signup
   - Sign up with Google or email
   - Verify email

2. **Add Payment Method** (Required, even for free tier)
   - Settings → Billing
   - Add credit card
   - You get $5 free credit
   - Charges only if you exceed free tier

3. **Create API Key**
   - Settings → API Keys
   - Click "Create new secret key"
   - Name: `SK ToursiQ Backend`
   - Click "Create secret key"
   - Copy the key (starts with `sk-`)
   - **IMPORTANT**: You can't see this key again!

4. **Add to .env**
   ```env
   OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   OPENAI_MODEL=gpt-4-turbo-preview
   ```

### Skip OpenAI:
If you don't want AI features, just leave these commented out in .env:
```env
# OPENAI_API_KEY=
# OPENAI_MODEL=gpt-4-turbo-preview
```

---

## 6️⃣ Verify Setup

### Check Your .env File

It should look like this:

```env
# ================================
# SERVER CONFIGURATION
# ================================
PORT=5000
NODE_ENV=development

# ================================
# DATABASE CONFIGURATION
# ================================
MONGODB_URI=mongodb+srv://sktours_admin:YOUR_PASSWORD@cluster.mongodb.net/sktours?retryWrites=true&w=majority

# ================================
# JWT CONFIGURATION
# ================================
JWT_SECRET=your_generated_secret_from_setup_script
JWT_EXPIRE=24h

# ================================
# RAZORPAY PAYMENT GATEWAY
# ================================
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx

# ================================
# CLOUDINARY IMAGE UPLOAD
# ================================
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx

# ================================
# EMAIL SERVICE
# ================================
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
EMAIL_FROM=SK ToursiQ <noreply@sktours.com>

# ================================
# FRONTEND CONFIGURATION
# ================================
FRONTEND_URL=http://localhost:3000

# ================================
# OPENAI (Optional)
# ================================
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-4-turbo-preview
```

### Test Each Service

1. **Test MongoDB Connection**
   ```bash
   npm run dev
   ```
   Look for: `MongoDB Connected: ...`

2. **Test Cloudinary**
   - Start server
   - Try creating a package with image upload

3. **Test Email**
   - Create a new user (signup)
   - Check email for welcome message
   - Check spam folder if not in inbox

4. **Test Razorpay**
   - Try adding money to wallet
   - You'll see Razorpay test checkout

5. **Test Complete Flow**
   ```bash
   # 1. Create user
   curl -X POST http://localhost:5000/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@test.com","password":"Test1234!","confirmPassword":"Test1234!"}'

   # 2. Login
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@test.com","password":"Test1234!"}'
   ```

---

## ✅ Checklist

Before starting development, ensure:

- [ ] .env file created
- [ ] MongoDB URI added (test connection successful)
- [ ] JWT_SECRET generated and added
- [ ] Razorpay keys added (test keys for development)
- [ ] Cloudinary credentials added
- [ ] Gmail/SendGrid configured
- [ ] Frontend URL set
- [ ] OpenAI key added (or commented out if not using)
- [ ] Dependencies installed (`npm install`)
- [ ] Server starts without errors (`npm run dev`)
- [ ] Can create and login user
- [ ] Email sending works (check spam)

---

## 🔒 Security Notes

### DO NOT:
- ❌ Commit .env to Git
- ❌ Share API keys publicly
- ❌ Use test keys in production
- ❌ Use weak JWT secrets
- ❌ Allow 0.0.0.0/0 in production MongoDB

### DO:
- ✅ Use .env for all secrets
- ✅ Use different keys for dev/prod
- ✅ Rotate keys regularly
- ✅ Use environment variables on hosting platform
- ✅ Enable 2FA on all accounts
- ✅ Monitor API usage

---

## 🆘 Troubleshooting

### MongoDB Connection Failed
```
Error: connect ECONNREFUSED
```
**Solution:**
- Check MongoDB is running: `brew services list`
- Check connection string is correct
- For Atlas: Check IP is whitelisted

### Razorpay Keys Invalid
```
Error: Invalid key id or key secret
```
**Solution:**
- Make sure you copied test keys (not live keys)
- Check for extra spaces
- Regenerate keys if needed

### Cloudinary Upload Failed
```
Error: Must supply api_key
```
**Solution:**
- Verify all 3 credentials are set
- Check for typos
- Try regenerating API secret

### Email Sending Failed
```
Error: Invalid login
```
**Solution:**
- Use App Password (not regular password)
- Enable 2FA first
- Remove spaces from password
- Check username is full email

### OpenAI API Error
```
Error: Incorrect API key
```
**Solution:**
- Check key starts with `sk-`
- Verify billing is set up
- Check you have credits remaining

---

## 📞 Need Help?

1. **MongoDB**: https://www.mongodb.com/docs/atlas/
2. **Razorpay**: https://razorpay.com/docs/
3. **Cloudinary**: https://cloudinary.com/documentation
4. **Gmail**: https://support.google.com/mail/answer/185833
5. **OpenAI**: https://platform.openai.com/docs

---

**You're all set! 🎉**

Once all keys are configured, run:
```bash
npm run dev
```

And start building! 🚀
