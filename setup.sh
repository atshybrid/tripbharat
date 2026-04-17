#!/bin/bash

# SK ToursiQ Backend - Environment Setup Script
# This script helps you set up your .env file

echo "🚀 SK ToursiQ Backend - Environment Setup"
echo "=========================================="
echo ""

# Check if .env already exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 1
    fi
fi

echo "Let's set up your environment variables..."
echo ""

# Copy from example
cp .env.example .env

echo "✅ Created .env file from .env.example"
echo ""

# Generate JWT Secret
echo "📝 Generating JWT Secret..."
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
echo "✅ JWT Secret generated: $JWT_SECRET"
echo ""

# Update JWT_SECRET in .env file
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s|JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_chars|JWT_SECRET=$JWT_SECRET|g" .env
else
    # Linux
    sed -i "s|JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_chars|JWT_SECRET=$JWT_SECRET|g" .env
fi

echo "✅ JWT_SECRET has been set in .env file"
echo ""

# Ask for MongoDB URI
echo "🗄️  MongoDB Setup"
echo "Do you want to use:"
echo "1) Local MongoDB (mongodb://localhost:27017/sktours)"
echo "2) MongoDB Atlas (cloud)"
read -p "Enter choice (1 or 2): " mongo_choice

if [ "$mongo_choice" = "1" ]; then
    MONGODB_URI="mongodb://localhost:27017/sktours"
    echo "✅ Using local MongoDB"
elif [ "$mongo_choice" = "2" ]; then
    read -p "Enter MongoDB Atlas connection string: " MONGODB_URI
    echo "✅ MongoDB Atlas connection string saved"
else
    MONGODB_URI="mongodb://localhost:27017/sktours"
    echo "⚠️  Invalid choice. Using local MongoDB by default"
fi

# Update MongoDB URI in .env
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s|MONGODB_URI=mongodb://localhost:27017/sktours|MONGODB_URI=$MONGODB_URI|g" .env
else
    sed -i "s|MONGODB_URI=mongodb://localhost:27017/sktours|MONGODB_URI=$MONGODB_URI|g" .env
fi

echo ""

# Frontend URL
read -p "Enter Frontend URL (default: http://localhost:3000): " frontend_url
frontend_url=${frontend_url:-http://localhost:3000}

if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s|FRONTEND_URL=http://localhost:3000|FRONTEND_URL=$frontend_url|g" .env
else
    sed -i "s|FRONTEND_URL=http://localhost:3000|FRONTEND_URL=$frontend_url|g" .env
fi

echo "✅ Frontend URL set to: $frontend_url"
echo ""

echo "📋 Manual Setup Required:"
echo ""
echo "Please add the following to your .env file:"
echo ""
echo "1. Razorpay Keys (Get from: https://dashboard.razorpay.com/app/keys)"
echo "   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx"
echo "   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxx"
echo ""
echo "2. Cloudinary Credentials (Get from: https://cloudinary.com/console)"
echo "   CLOUDINARY_CLOUD_NAME=your_cloud_name"
echo "   CLOUDINARY_API_KEY=123456789012345"
echo "   CLOUDINARY_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx"
echo ""
echo "3. Email Configuration (Gmail App Password)"
echo "   EMAIL_USER=your-email@gmail.com"
echo "   EMAIL_PASSWORD=your_16_char_app_password"
echo ""
echo "4. OpenAI API Key (Optional - Get from: https://platform.openai.com/api-keys)"
echo "   OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
echo ""

echo "✅ Environment setup complete!"
echo ""
echo "📖 Next Steps:"
echo "1. Edit .env and add the remaining API keys"
echo "2. Install dependencies: npm install"
echo "3. Start the server: npm run dev"
echo ""
echo "For detailed setup instructions, see:"
echo "- README.md (Complete documentation)"
echo "- QUICK_START.md (5-minute setup guide)"
echo "- SETUP_CHECKLIST.md (Step-by-step checklist)"
echo ""
echo "🎉 Happy coding!"
