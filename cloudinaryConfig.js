const cloudinary = require('cloudinary').v2;
const multer = require('multer');
require('dotenv').config();

// Safely resolve version differences for multer-storage-cloudinary package export strategy
const multerStorageCloudinary = require('multer-storage-cloudinary');

// If version 4+ uses destructuring, fallback uses default or direct assignment matrix
const CloudinaryStorage = multerStorageCloudinary.CloudinaryStorage || 
                          (multerStorageCloudinary.default ? multerStorageCloudinary.default.CloudinaryStorage : null) || 
                          multerStorageCloudinary;

// Configure Cloudinary credentials safely
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Instantiate storage system safely using validated dynamic constructor mapping
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'campuscart_products',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
  },
});

const upload = multer({ storage: storage });
module.exports = upload;