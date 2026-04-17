#!/bin/bash
# ============================================================
# setup_domain.sh — Link tripbharatgo.com + api.tripbharatgo.com
# Run from project root: bash deploy/setup_domain.sh
# ============================================================
set -e

SERVER="root@168.144.93.18"
SSH_KEY="$HOME/.ssh/id_rsa"
BACKEND_DIR="/var/www/sktours-api"
FRONTEND_DIR="/var/www/sktours-frontend"

echo "== Uploading updated configs..."

# Upload nginx config with subdomain split
scp -i "$SSH_KEY" deploy/nginx.conf ${SERVER}:/etc/nginx/sites-available/sktours

# Upload updated backend env (FRONTEND_URL=https://tripbharatgo.com)
scp -i "$SSH_KEY" deploy/.env.production ${BACKEND_DIR}/../.env.tmp 2>/dev/null || \
  scp -i "$SSH_KEY" deploy/.env.production ${SERVER}:${BACKEND_DIR}/.env

# Upload updated frontend env (NEXT_PUBLIC_API_URL=https://api.tripbharatgo.com/api)
scp -i "$SSH_KEY" deploy/.env.frontend ${SERVER}:${FRONTEND_DIR}/.env.local

# Upload updated app.js (new CORS origins)
scp -i "$SSH_KEY" src/app.js ${SERVER}:${BACKEND_DIR}/src/app.js

echo "== Configuring nginx & SSL on server..."

ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no ${SERVER} bash << 'REMOTE'
set -e

# ── Nginx: reload with new subdomain split config ──────────────
ln -sf /etc/nginx/sites-available/sktours /etc/nginx/sites-enabled/sktours
nginx -t && systemctl reload nginx
echo "[nginx] Config OK, reloaded"

# ── Install Certbot if not already installed ───────────────────
if ! command -v certbot &>/dev/null; then
  apt-get update -qq
  apt-get install -y certbot python3-certbot-nginx
  echo "[certbot] Installed"
else
  echo "[certbot] Already installed"
fi

# ── Obtain/renew SSL certificates ──────────────────────────────
certbot --nginx \
  -d tripbharatgo.com \
  -d www.tripbharatgo.com \
  -d api.tripbharatgo.com \
  --non-interactive \
  --agree-tos \
  --email admin@tripbharatgo.com \
  --redirect
echo "[SSL] Certificates issued and HTTPS redirect enabled"

# ── Reload nginx after certbot modifies config ─────────────────
nginx -t && systemctl reload nginx
echo "[nginx] Reloaded after SSL setup"

# ── Restart backend (new CORS + env) ───────────────────────────
cd /var/www/sktours-api
pm2 restart sktours-api
echo "[PM2] sktours-api restarted"

# ── Rebuild frontend with new API URL ──────────────────────────
cd /var/www/sktours-frontend
npm run build
pm2 restart sktours-frontend
echo "[PM2] sktours-frontend rebuilt and restarted"

# ── Status check ───────────────────────────────────────────────
pm2 status

echo ""
echo "✓ Frontend : https://tripbharatgo.com"
echo "✓ API      : https://api.tripbharatgo.com/api"
echo "✓ API Docs : https://api.tripbharatgo.com/api-docs"
echo "✓ Health   : https://api.tripbharatgo.com/health"
REMOTE

echo ""
echo "== Domain setup complete!"
echo "   Frontend : https://tripbharatgo.com"
echo "   API      : https://api.tripbharatgo.com/api"
