const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sellerName: { type: String, required: true },
    paymentMethod: { type: String, enum: ['COD', 'Online Transfer'], required: true },
    buyerPhone: { type: String, required: true },
    deliveryLocation: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Completed', 'Cancelled'], default: 'Pending' },
    cancellationReason: { type: String, default: '' },
    isArchived: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
    
});

module.exports = mongoose.model('Order', orderSchema);