const express = require('express');
const router = express.Router();
const User = require('../models/User'); // නිවැරදිව මොඩල් එක ඉම්පෝට් කරගන්නවා
const bcrypt = require('bcryptjs'); // 🌟 1. Bcryptjs ලයිබ්‍රරි එක ඉම්පෝට් කරගන්නවා

// 1. REGISTER ROUTE (🔒 Password Encrypted)
router.post('/register', async (req, res) => {
    try {
        console.log("=== REGISTER REQUEST RECEIVED ===", req.body);
        const { name, email, password, campusId, role } = req.body;

        if (!name || !email || !password || !campusId) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Email එක කලින් රෙජිස්ටර් වෙලාද බලනවා
        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }

        // 🌟 2. පාස්වර්ඩ් එක ආරක්ෂිතව හැෂ් (Encrypt) කරන කොටස
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword, // 🌟 සාමාන්‍ය පාස්වර්ඩ් එක වෙනුවට හැෂ් කරපු එක සේව් කරනවා
            campusId: campusId.trim(),
            role: role || 'buyer' // Frontend එකෙන් role එක ආවේ නැත්නම් default buyer වෙනවා
        });

        await newUser.save();
        return res.status(201).json({ success: true, message: "User registered successfully" });

    } catch (error) {
        console.error("Register Error:", error.message);
        return res.status(500).json({ error: "Registration failed on server", details: error.message });
    }
});

// 2. LOGIN ROUTE (🔒 Password Comparison Verified)
router.post('/login', async (req, res) => {
    try {
        console.log("=== LOGIN REQUEST RECEIVED ===", req.body);
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // 🌟 3. යූසර් ගහපු සාමාන්‍ය පාස්වර්ඩ් එක ඩේටාබේස් එකේ තියෙන හැෂ් පාස්වර්ඩ් එක සමඟ සසඳා බලන කොටස
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // 🌟 ලොග් වෙද්දී 'userRole' සහ 'userName' ලෝකල් ස්ටෝරේජ් එකට දාගන්න සේරම විස්තර Frontend එකට යවනවා
        return res.status(200).json({
            success: true,
            token: "mock-jwt-token-campuscart-" + user._id, 
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role // මෙන්න මෙයා අනිවාර්යයෙන්ම යනවා
            }
        });

    } catch (error) {
        console.error("Login Error:", error.message);
        return res.status(500).json({ error: "Server authentication crash" });
    }
});

// 🌟 1. GET: සිස්ටම් එකේ ඉන්න ඔක්කොම යූසර්ලාව ඇඩ්මින් ඩෑෂ්බෝඩ් එකට ලබාගැනීම
router.get('/', async (req, res) => {
    try {
        // ඇඩ්මින්ලාව හැර Buyers සහ Sellers ලාව විතරක් ලිස්ට් එකට ගන්නවා (Password එක නැතුව)
        const users = await User.find({ role: { $ne: 'admin' } }).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🌟 2. DELETE: ඇඩ්මින් විසින් වංචනික ගිණුම් පද්ධතියෙන් ඉවත් කිරීම
router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;


