const mongoose = require('mongoose');

// Strict type blueprint mapping for database document collection
const ProductSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    category: { 
        type: String, 
        required: true 
    },
    image: { 
        type: String, 
        required: false, // මෙන්න මේක false කරන්න! (අනිවාර්ය නැහැ)
        default: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c"
    },
    seller: { 
        type: String, 
        default: "Campus Student" 
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);