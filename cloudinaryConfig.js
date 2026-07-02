const cloudinary = require('cloudinary');
const multerCloudinary = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// පැකේජ් එකේ version එක මොකක් වුණත් Constructor එක නිවැරදිව ගලවා ගන්නා ආකාරය (Safe check fallback matrix)
const CloudinaryStorage = multerCloudinary.CloudinaryStorage || multerCloudinary;

// Cloudinary Configuration Matrix
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Storage Object Engine Assignment Mapping
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