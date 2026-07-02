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

            // 🌟 වෙනස තියෙන්නේ මෙතනයි: req.file.secure_url එකෙන් සැබෑ Cloudinary ලින්ක් එක ගන්නවා
            let imageUrl = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c";
            
            if (req.file && req.file.secure_url) {
                imageUrl = req.file.secure_url; // Cloudinary සැබෑ CDN secure ලින්ක් එක
            } else if (req.file && req.file.path) {
                imageUrl = req.file.path; // Fallback එකක් විදිහට path එකත් චෙක් කරනවා
            }

            const newProduct = new Product({
                title: title ? title.trim() : "Untitled Product",
                description: description ? description.trim() : "No description",
                price: price ? Number(price) : 0,
                category: category,
                image: imageUrl, // දැන් සැබෑ ෆොටෝ ලින්ක් එක ඩේටාබේස් එකට යනවා
                seller: seller || "Campus Student"
            });

            const savedProduct = await newProduct.save();
            console.log("=== PRODUCT SAVED SUCCESSFULLY WITH REAL IMAGE ===", savedProduct);
            return res.status(201).json({ success: true, product: savedProduct });

        } catch (error) {
            console.error("Database Save Error:", error.message);
            return res.status(500).json({ error: "Failed to save product in database" });
        }
    });
});

// GET: Fetch all products for Dashboard
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET: Fetch products only belongs to a specific seller
router.get('/seller/:senderName', async (req, res) => {
    try {
        const sellerProducts = await Product.find({ seller: req.params.senderName }).sort({ createdAt: -1 });
        res.json(sellerProducts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE: Remove a product by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }
        return res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        console.error("Delete error:", error.message);
        res.status(500).json({ error: "Server failed to delete item" });
    }
});

// PUT: Update product details (Title and Price)
router.put('/:id', async (req, res) => {
    try {
        const { title, price } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { title: title.trim(), price: Number(price) },
            { new: true } // අලුත් දත්ත ටික ආපහු දෙනවා
        );

        if (!updatedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }
        return res.status(200).json({ success: true, product: updatedProduct });
    } catch (error) {
        console.error("Update error:", error.message);
        res.status(500).json({ error: "Server failed to update item" });
    }
});

module.exports = router;