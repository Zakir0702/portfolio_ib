const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');

const LARGE_VIDEO_THRESHOLD_BYTES = Number(process.env.CLOUDINARY_LARGE_UPLOAD_THRESHOLD_BYTES || 20 * 1024 * 1024);

function slug(value) {
  return String(value || 'media')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'media';
}

function buildCloudinaryUploadOptions({ type, key }) {
  const resourceType = type === 'image' ? 'image' : 'video';
  const options = {
    resource_type: resourceType,
    folder: process.env.CLOUDINARY_FOLDER || 'portfolio_ib',
    public_id: `${slug(key)}-${Date.now()}`,
    overwrite: false,
    timeout: Number(process.env.CLOUDINARY_UPLOAD_TIMEOUT_MS || 300000),
  };

  if (resourceType === 'video') {
    options.eager = [{ width: 900, crop: 'scale', format: 'jpg' }];
  }

  return options;
}

function uploadBufferToCloudinary(buffer, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

function uploadFileToCloudinary(filePath, options) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_large(filePath, options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
}

function shouldUseLargeUpload({ type, size }) {
  return type === 'video' && Number(size || 0) >= LARGE_VIDEO_THRESHOLD_BYTES;
}

function resultToMediaRecord(result, metadata) {
  return {
    id: result.public_id,
    public_id: result.public_id,
    key: metadata.key,
    type: metadata.type,
    title: metadata.title,
    category: metadata.category,
    url: result.secure_url,
    poster: result.eager?.[0]?.secure_url || null,
    format: result.format,
    size: result.bytes,
    width: result.width || null,
    height: result.height || null,
    duration: result.duration || null,
    source: 'cloudinary',
  };
}

async function uploadMediaBuffer(buffer, metadata) {
  const options = buildCloudinaryUploadOptions(metadata);
  const result = await uploadBufferToCloudinary(buffer, options);
  return resultToMediaRecord(result, metadata);
}

async function uploadMediaFile(filePath, metadata) {
  const options = {
    ...buildCloudinaryUploadOptions(metadata),
    chunk_size: Number(process.env.CLOUDINARY_CHUNK_SIZE || 6000000),
  };
  const result = await uploadFileToCloudinary(filePath, options);
  return resultToMediaRecord(result, metadata);
}

async function deleteCloudinaryMedia(publicId, type) {
  return cloudinary.uploader.destroy(publicId, {
    resource_type: type === 'image' ? 'image' : 'video',
  });
}

module.exports = {
  buildCloudinaryUploadOptions,
  uploadBufferToCloudinary,
  uploadFileToCloudinary,
  shouldUseLargeUpload,
  resultToMediaRecord,
  uploadMediaBuffer,
  uploadMediaFile,
  deleteCloudinaryMedia,
};
