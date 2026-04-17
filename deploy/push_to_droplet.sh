#!/bin/bash
# SK ToursiQ — Push local code to droplet via rsync (no Git needed)
# Run from your Mac: bash deploy/push_to_droplet.sh
set -e

SERVER="root@168.144.93.18"
SSH_KEY="$HOME/.ssh/id_rsa"
BACKEND_SRC="/Volumes/Storage/kaburlu_softwares/Travel/Travel_nodejs/"
FRONTEND_SRC="/Volumes/Storage/kaburlu_softwares/Travel/travel_nextjs/"
BACKEND_DEST="/var/www/sktours-api"
FRONTEND_DEST="/var/www/sktours-frontend"

echo "== Uploading backend..."
rsync -avz --progress \
  --exclude 'node_modules' --exclude '.git' --exclude 'logs' \
  --exclude '.env' \
  -e "ssh -i $SSH_KEY -o StrictHostKeyChecking=no" \
  $BACKEND_SRC $SERVER:$BACKEND_DEST/

echo "== Uploading frontend..."
rsync -avz --progress \
  --exclude 'node_modules' --exclude '.git' --exclude '.next' \
  --exclude '.env.local' \
  -e "ssh -i $SSH_KEY -o StrictHostKeyChecking=no" \
  $FRONTEND_SRC $SERVER:$FRONTEND_DEST/

echo "== Uploading env files..."
scp -i $SSH_KEY -o StrictHostKeyChecking=no \
  deploy/.env.production $SERVER:$BACKEND_DEST/.env
scp -i $SSH_KEY -o StrictHostKeyChecking=no \
  deploy/.env.frontend $SERVER:$FRONTEND_DEST/.env.local
scp -i $SSH_KEY -o StrictHostKeyChecking=no \
  deploy/nginx.conf $SERVER:/root/nginx.conf

echo "== Running remote setup..."
ssh -i $SSH_KEY -o StrictHostKeyChecking=no $SERVER bash << 'EOF'

# Install Nginx if missing
which nginx || (apt-get install -y nginx && systemctl enable nginx)

# Backend
echo "-- Backend: installing & restarting..."
cd /var/www/sktours-api
npm install --production
npm run seed:admin 2>/dev/null || true
pm2 describe sktours-api > /dev/null 2>&1 \
  && pm2 restart sktours-api \
  || pm2 start server.js --name sktours-api
pm2 save

# Frontend — clear .next to avoid stale build artifacts, then build
echo "-- Frontend: building..."
cd /var/www/sktours-frontend
npm install
rm -rf .next
if NODE_OPTIONS="--max-old-space-size=1536" npm run build; then
  pm2 describe sktours-frontend > /dev/null 2>&1 \
    && pm2 restart sktours-frontend \
    || pm2 start npm --name sktours-frontend -- start
  pm2 save
  echo "✓ Frontend build succeeded"
else
  echo "⚠ Frontend build failed — keeping previous running version"
fi

# Nginx config
cp /root/nginx.conf /etc/nginx/sites-available/sktours
ln -sf /etc/nginx/sites-available/sktours /etc/nginx/sites-enabled/sktours
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# Firewall
ufw allow 80/tcp
ufw reload

echo ""
echo "✓ Backend  : http://168.144.93.18/api"
echo "✓ Frontend : http://168.144.93.18"
echo "✓ API Docs : http://168.144.93.18/api-docs"
EOF

echo ""
echo "== Deploy complete! =="
echo "   Frontend : http://168.144.93.18"
echo "   API      : http://168.144.93.18/api"
