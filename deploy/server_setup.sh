#!/bin/bash
# SK ToursiQ — Server Bootstrap Script
# Run as root on Ubuntu 22.04
set -e

echo "=========================================="
echo " SK ToursiQ Server Setup"
echo "=========================================="

# ── 1. System Update ──────────────────────────
echo "[1/7] Updating system..."
apt-get update -y && apt-get upgrade -y
apt-get install -y curl git ufw build-essential

# ── 2. Node.js 20 LTS ─────────────────────────
echo "[2/7] Installing Node.js 20 LTS..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
node -v && npm -v

# ── 3. PM2 ────────────────────────────────────
echo "[3/7] Installing PM2..."
npm install -g pm2
pm2 startup systemd -u root --hp /root | tail -1 | bash || true

# ── 4. PostgreSQL 15 ──────────────────────────
echo "[4/7] Installing PostgreSQL 15..."
apt-get install -y postgresql postgresql-contrib
systemctl enable postgresql
systemctl start postgresql

# ── 5. Create DB + user ───────────────────────
echo "[5/7] Creating database and user..."
DB_NAME="tripbharat"
DB_USER="sktours_user"
DB_PASS="Sktours@DB2026!"

sudo -u postgres psql -c "DO \$\$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename = '${DB_USER}') THEN
    CREATE USER ${DB_USER} WITH ENCRYPTED PASSWORD '${DB_PASS}';
  END IF;
END \$\$;"

sudo -u postgres psql -c "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1 || \
  sudo -u postgres createdb -O ${DB_USER} ${DB_NAME}

sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};"
sudo -u postgres psql -d ${DB_NAME} -c "GRANT ALL ON SCHEMA public TO ${DB_USER};"

# ── 6. Secure PostgreSQL ──────────────────────
echo "[6/7] Securing PostgreSQL (localhost only)..."
PG_CONF=$(sudo -u postgres psql -c "SHOW config_file;" -t | xargs)
PG_HBA=$(sudo -u postgres psql -c "SHOW hba_file;" -t | xargs)

# Allow local connection with password for sktours_user
grep -qF "host  ${DB_NAME}  ${DB_USER}" "$PG_HBA" || \
  echo "host  ${DB_NAME}  ${DB_USER}  127.0.0.1/32  md5" >> "$PG_HBA"

systemctl reload postgresql

# ── 7. Firewall ───────────────────────────────
echo "[7/7] Configuring firewall..."
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3000/tcp    # app port
ufw --force enable

echo ""
echo "=========================================="
echo " Setup complete!"
echo " DB_NAME : ${DB_NAME}"
echo " DB_USER : ${DB_USER}"
echo " DB_PASS : ${DB_PASS}"
echo " DB_URL  : postgresql://${DB_USER}:${DB_PASS}@127.0.0.1:5432/${DB_NAME}"
echo "=========================================="
