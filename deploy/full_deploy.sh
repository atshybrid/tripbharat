#!/bin/bash
# SK ToursiQ — Full Droplet Setup (Backend + Frontend + Nginx)
# Run as root on Ubuntu 22.04 AFTER server_setup.sh completes
set -e

DROPLET_IP="168.144.93.18"
BACKEND_DIR="/var/www/sktours-api"
FRONTEND_DIR="/var/www/sktours-frontend"
FRONTEND_REPO="https://github.com/YOUR_ORG/travel_nextjs.git"   # update this
BACKEND_REPO="https://github.com/YOUR_ORG/Travel_nodejs.git"     # update this

echo "=========================================="
echo " SK ToursiQ — Full Deploy"
echo " Droplet: ${DROPLET_IP}"
echo "=========================================="

# ── 1. Install Nginx ─────────────────────────
echo "[1] Installing Nginx..."
apt-get install -y nginx
systemctl enable nginx

# ── 2. Deploy Backend ─────────────────────────
echo "[2] Deploying backend..."
mkdir -p $BACKEND_DIR
if [ -d "$BACKEND_DIR/.git" ]; then
  cd $BACKEND_DIR && git pull
else
  git clone $BACKEND_REPO $BACKEND_DIR
fi
cd $BACKEND_DIR
npm install --production
cp /root/.env.production .env

# Seed admin user
npm run seed:admin || true

# Start / restart backend with PM2
pm2 describe sktours-api > /dev/null 2>&1 && pm2 restart sktours-api || \
  pm2 start server.js --name sktours-api --env production
pm2 save

# ── 3. Deploy Frontend ────────────────────────
echo "[3] Deploying frontend..."
mkdir -p $FRONTEND_DIR
if [ -d "$FRONTEND_DIR/.git" ]; then
  cd $FRONTEND_DIR && git pull
else
  git clone $FRONTEND_REPO $FRONTEND_DIR
fi
cd $FRONTEND_DIR
npm install
cp /root/.env.frontend .env.local
npm run build

# Start / restart frontend with PM2
pm2 describe sktours-frontend > /dev/null 2>&1 && pm2 restart sktours-frontend || \
  pm2 start npm --name sktours-frontend -- start
pm2 save

# ── 4. Configure Nginx ────────────────────────
echo "[4] Configuring Nginx..."
cp /root/nginx.conf /etc/nginx/sites-available/sktours
ln -sf /etc/nginx/sites-available/sktours /etc/nginx/sites-enabled/sktours
rm -f /etc/nginx/sites-enabled/default

nginx -t && systemctl reload nginx

# ── 5. Firewall — open port 80, keep 5000/3000 internal ──
echo "[5] Updating firewall..."
ufw allow 80/tcp
ufw delete allow 3000/tcp 2>/dev/null || true
ufw reload

echo ""
echo "=========================================="
echo " Done!"
echo " Frontend : http://${DROPLET_IP}"
echo " API      : http://${DROPLET_IP}/api"
echo " API Docs : http://${DROPLET_IP}/api-docs"
echo "=========================================="
