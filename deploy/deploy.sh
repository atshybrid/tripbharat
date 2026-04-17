#!/bin/bash
# SK ToursiQ — Deploy / Update Script
# Run as root on the droplet after first setup
set -e

APP_DIR="/var/www/sktours-api"
echo "Deploying SK ToursiQ to ${APP_DIR}..."

# Pull latest code
cd "$APP_DIR"
git pull origin main

# Install / update dependencies
npm install --production

# Restart app via PM2
pm2 restart sktours-api --update-env || pm2 start server.js --name sktours-api
pm2 save

echo "Deploy complete. App status:"
pm2 status sktours-api
