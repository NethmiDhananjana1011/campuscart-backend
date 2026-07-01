const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const upload = require('../cloudinaryConfig'); // Cloudinary Config එක ඉම්පෝට් කරනවා

// POST: Add new product with Real Cloudinary Image Upload
router.post('/add', (req, res) => {
    // upload.single('image') එකෙන් Frontend එකේ දාපු 'image' කියන file එක Cloudinary එකට අප්ලෝඩ් කරනවා
    upload.single('image')(req, res, async function (err) {
        if (err) {
            console.error("Multer/Cloudinary Upload Error:", err);
            return res.status(400).json({ error: "Image upload failed", details: err.message });
        }

        try {
            console.log("FORM BODY RECEIVED:", req.body);
            console.log("UPLOADED FILE OBJECT:", req.file);

            const { title, description, price, category, seller } = req.body;

            // Cloudinary එකෙන් දෙන සැබෑ රූපයේ URL එක ගන්නවා. නැත්නම් Placeholder එකක් දෙනවා.
            let imageUrl = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c";
            if (req.file && req.file.path) {
                imageUrl = req.file.path; // Cloudinary CDN secure URL link
            }

            const newProduct = new Product({
                title: title ? title.trim() : "Untitled Product",
                description: description ? description.trim() : "No description",
                price: price ? Number(price) : 0,
                category: category,
                image: imageUrl,
                seller: seller || "Campus Student"
            });

            const savedProduct = await newProduct.save();
            return res.status(201).json({ success: true, product: savedProduct });

        } catch (error) {
            console.error("Database Save Error:", error.message);
            return res.status(500).json({ error: "Failed to save product in database" });
        }
    });
});

router.get('/', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;