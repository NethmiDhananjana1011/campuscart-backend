const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    campusId: { type: String, required: true },
    // 🌟 Roles 3 හඳුන්වා දෙන කොටස (Default එක 'buyer' ලෙස සෙට් වේ)
    role: { type: String, enum: ['buyer', 'seller', 'admin'], default: 'buyer' }
});

// දැනටමත් මොඩල් එකක් හදලා තියෙනවා නම් ඒක ගන්නවා, නැත්නම් අලුතින් හදනවා
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);