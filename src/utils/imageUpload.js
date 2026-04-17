const cloudinary = require('../config/cloudinary');
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));
const path = require('path');
const crypto = require('crypto');
const logger = require('./logger');

const PROVIDER = () => process.env.IMAGE_PROVIDER || 'cloudinary';

// ── Cloudflare R2 client (S3-compatible) ─────────────────────
const getR2Client = () => new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
  }
});

// ── Generate unique filename ──────────────────────────────────
function genFileName(originalname = 'image.jpg') {
  const ext = path.extname(originalname) || '.jpg';
  return `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
}

// ── CLOUDINARY ────────────────────────────────────────────────
async function uploadCloudinary(buffer, folder = 'sktours') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { width: 1200, height: 800, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      },
      (err, result) => {
        if (err) { logger.error(`Cloudinary upload error: ${err.message}`); return reject(err); }
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

async function deleteCloudinary(imageUrl) {
  const parts = imageUrl.split('/');
  const file = parts[parts.length - 1];
  const folder = parts[parts.length - 2];
  const publicId = `${folder}/${file.split('.')[0]}`;
  return cloudinary.uploader.destroy(publicId);
}

// ── BUNNY CDN ─────────────────────────────────────────────────
async function uploadBunny(buffer, folder = 'sktours', originalname) {
  const zone = process.env.BUNNY_STORAGE_ZONE;
  const host = process.env.BUNNY_STORAGE_HOST || 'storage.bunnycdn.com';
  const apiKey = process.env.BUNNY_STORAGE_API_KEY;
  const cdnHost = process.env.BUNNY_CDN_HOSTNAME;

  const filename = `${folder}/${genFileName(originalname)}`;
  const url = `https://${host}/${zone}/${filename}`;

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      AccessKey: apiKey,
      'Content-Type': 'application/octet-stream'
    },
    body: buffer
  });

  if (!res.ok) {
    const err = await res.text();
    logger.error(`BunnyCDN upload error: ${err}`);
    throw new Error(`BunnyCDN upload failed: ${res.status}`);
  }

  return `https://${cdnHost}/${filename}`;
}

async function deleteBunny(imageUrl) {
  const zone = process.env.BUNNY_STORAGE_ZONE;
  const host = process.env.BUNNY_STORAGE_HOST || 'storage.bunnycdn.com';
  const apiKey = process.env.BUNNY_STORAGE_API_KEY;
  const cdnHost = process.env.BUNNY_CDN_HOSTNAME;

  // Extract path after CDN hostname
  const filePath = imageUrl.replace(`https://${cdnHost}/`, '');
  const url = `https://${host}/${zone}/${filePath}`;

  await fetch(url, { method: 'DELETE', headers: { AccessKey: apiKey } });
}

// ── CLOUDFLARE R2 ─────────────────────────────────────────────
async function uploadR2(buffer, folder = 'sktours', originalname) {
  const key = `${folder}/${genFileName(originalname)}`;
  const client = getR2Client();

  const upload = new Upload({
    client,
    params: {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: 'image/jpeg'
    }
  });

  await upload.done();
  return `${process.env.R2_PUBLIC_URL}/${key}`;
}

async function deleteR2(imageUrl) {
  const publicUrl = process.env.R2_PUBLIC_URL;
  const key = imageUrl.replace(`${publicUrl}/`, '');
  const client = getR2Client();
  await client.send(new DeleteObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: key }));
}

// ── PUBLIC API ─────────────────────────────────────────────────
const uploadImage = async (buffer, folder = 'sktours', originalname = 'image.jpg') => {
  const provider = PROVIDER();
  try {
    if (provider === 'bunny')       return await uploadBunny(buffer, folder, originalname);
    if (provider === 'r2')          return await uploadR2(buffer, folder, originalname);
    /* default: cloudinary */       return await uploadCloudinary(buffer, folder);
  } catch (error) {
    logger.error(`[${provider}] Image upload failed: ${error.message}`);
    throw error;
  }
};

const uploadMultipleImages = async (files, folder = 'sktours') => {
  return Promise.all(files.map(f => uploadImage(f.buffer, folder, f.originalname)));
};

const deleteImage = async (imageUrl) => {
  if (!imageUrl) return;
  const provider = PROVIDER();
  try {
    if (provider === 'bunny')  return await deleteBunny(imageUrl);
    if (provider === 'r2')     return await deleteR2(imageUrl);
    /* default: cloudinary */  return await deleteCloudinary(imageUrl);
  } catch (error) {
    logger.error(`[${provider}] Image delete failed: ${error.message}`);
  }
};

const deleteMultipleImages = async (imageUrls = []) => {
  return Promise.all(imageUrls.map(url => deleteImage(url)));
};

module.exports = { uploadImage, uploadMultipleImages, deleteImage, deleteMultipleImages };

