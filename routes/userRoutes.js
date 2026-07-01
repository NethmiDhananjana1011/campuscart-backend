const express = require('express');
const router = express.Router();
// User මොඩල් එකක් දැනට නැත්නම් සරල Schema එකක් මෙතනින්ම හදමු, තිබේ නම් ඉහළින් require කරගන්න
const mongoose = require('mongoose');

const UserSchema = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    campusId: { type: String, required: true }
}));

// 1. REGISTER ROUTE
router.post('/register', async (req, res) => {
    try {
        console.log("=== REGISTER REQUEST RECEIVED ===", req.body);
        const { name, email, password, campusId } = req.body;

        if (!name || !email || !password || !campusId) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Email එක කලින් රෙජිස්ටර් වෙලාද බලනවා
        const existingUser = await UserSchema.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }

        const newUser = new UserSchema({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: password, // Production වලදී bcrypt දාන්න, දැනට සරලව සේව් කරමු
            campusId: campusId.trim()
        });

        await newUser.save();
        return res.status(201).json({ success: true, message: "User registered successfully" });

    } catch (error) {
        console.error("Register Error:", error.message);
        return res.status(500).json({ error: "Registration failed on server" });
    }
});

// 2. LOGIN ROUTE (Strict Payload Strategy)
router.post('/login', async (req, res) => {
    try {
        console.log("=== LOGIN REQUEST RECEIVED ===", req.body);
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const user = await UserSchema.findOne({ email: email.toLowerCase().trim() });
        if (!user || user.password !== password) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Frontend එක බලාපොරොත්තු වෙන 'token' සහ 'user.name' ව්‍යුහය 100% ක් නිවැරදිව මෙතනින් දෙනවා
        return res.status(200).json({
            success: true,
            token: "mock-jwt-token-campuscart-" + user._id, // Temporary token fallback matrix
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login Error:", error.message);
        return res.status(500).json({ error: "Server authentication crash" });
    }
});

module.exports = router;