const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: 'djyky3svp', 
  api_key: '489234116552563',
  api_secret: 'Z1j4CyzOxAa-8-Aeud2gXooh1GI'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'campuscart_products',
    allowed_formats: ['jpg', 'png', 'jpeg']
  },
});

const upload = multer({ storage: storage });
module.exports = upload;