const cloudinary = require('../config/cloudinary');
const logger = require('./logger');

// Upload single image to Cloudinary
const uploadImage = async (buffer, folder = 'sktours') => {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'image',
          transformation: [
            { width: 1200, height: 800, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) {
            logger.error(`Cloudinary upload error: ${error.message}`);
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        }
      );

      uploadStream.end(buffer);
    });
  } catch (error) {
    logger.error(`Image upload failed: ${error.message}`);
    throw error;
  }
};

// Upload multiple images
const uploadMultipleImages = async (files, folder = 'sktours') => {
  try {
    const uploadPromises = files.map(file => uploadImage(file.buffer, folder));
    return await Promise.all(uploadPromises);
  } catch (error) {
    logger.error(`Multiple image upload failed: ${error.message}`);
    throw error;
  }
};

// Delete image from Cloudinary
const deleteImage = async (imageUrl) => {
  try {
    // Extract public_id from URL
    const urlParts = imageUrl.split('/');
    const fileWithExtension = urlParts[urlParts.length - 1];
    const publicId = `${urlParts[urlParts.length - 2]}/${fileWithExtension.split('.')[0]}`;

    const result = await cloudinary.uploader.destroy(publicId);
    logger.info(`Image deleted: ${publicId}`);
    return result;
  } catch (error) {
    logger.error(`Image deletion failed: ${error.message}`);
    throw error;
  }
};

// Delete multiple images
const deleteMultipleImages = async (imageUrls) => {
  try {
    const deletePromises = imageUrls.map(url => deleteImage(url));
    return await Promise.all(deletePromises);
  } catch (error) {
    logger.error(`Multiple image deletion failed: ${error.message}`);
    throw error;
  }
};

module.exports = {
  uploadImage,
  uploadMultipleImages,
  deleteImage,
  deleteMultipleImages
};
