/**
 * Admin Seed Script
 * Creates a default admin user if one doesn't already exist.
 *
 * Usage:
 *   node src/scripts/seedAdmin.js
 *   or
 *   npm run seed:admin
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const DB_TYPE = process.env.DB_TYPE || 'mongodb';

// Default admin credentials — override via env vars
const ADMIN_NAME     = process.env.SEED_ADMIN_NAME     || 'Super Admin';
const ADMIN_EMAIL    = process.env.SEED_ADMIN_EMAIL    || 'admin@sktours.com';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'Admin@12345';
const ADMIN_PHONE    = process.env.SEED_ADMIN_PHONE    || '9999999999';

async function seedAdmin() {
  if (DB_TYPE === 'postgresql') {
    await seedPostgres();
  } else {
    await seedMongo();
  }
}

/* ─── PostgreSQL ─────────────────────────────────────────────── */
async function seedPostgres() {
  const { connectPostgreSQL, syncTables } = require('../config/postgresql');
  const { initModels } = require('../models/postgres');

  console.log('Connecting to PostgreSQL...');
  await connectPostgreSQL();
  const { User } = initModels();
  await syncTables();

  const existing = await User.findOne({ where: { email: ADMIN_EMAIL } });
  if (existing) {
    console.log(`✔  Admin already exists: ${ADMIN_EMAIL}`);
    process.exit(0);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

  const admin = await User.create({
    name:         ADMIN_NAME,
    email:        ADMIN_EMAIL,
    password:     hashedPassword,
    phone:        ADMIN_PHONE,
    role:         'admin',
    referralCode: crypto.randomBytes(5).toString('hex').toUpperCase(),
    isEmailVerified: true,
    isActive:     true
  });

  console.log('✔  Admin created successfully!');
  console.log('   ID    :', admin.id);
  console.log('   Name  :', admin.name);
  console.log('   Email :', admin.email);
  console.log('   Role  :', admin.role);
  console.log('\n  Login credentials:');
  console.log(`   Email    : ${ADMIN_EMAIL}`);
  console.log(`   Password : ${ADMIN_PASSWORD}`);
  process.exit(0);
}

/* ─── MongoDB ─────────────────────────────────────────────────── */
async function seedMongo() {
  const mongoose = require('mongoose');

  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);

  const User = require('../models/User');

  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    console.log(`✔  Admin already exists: ${ADMIN_EMAIL}`);
    await mongoose.disconnect();
    process.exit(0);
  }

  const admin = await User.create({
    name:      ADMIN_NAME,
    email:     ADMIN_EMAIL,
    password:  ADMIN_PASSWORD,   // model's pre-save hook hashes it
    phone:     ADMIN_PHONE,
    role:      'admin',
    isVerified: true
  });

  console.log('✔  Admin created successfully!');
  console.log('   ID    :', admin._id);
  console.log('   Name  :', admin.name);
  console.log('   Email :', admin.email);
  console.log('   Role  :', admin.role);
  console.log('\n  Login credentials:');
  console.log(`   Email    : ${ADMIN_EMAIL}`);
  console.log(`   Password : ${ADMIN_PASSWORD}`);
  await mongoose.disconnect();
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
