const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// POST: Place order
router.post('/place-order', async (req, res) => {
    try {
        const { product, buyer, sellerName, paymentMethod, buyerPhone, deliveryLocation } = req.body;
        console.log("Order Data Received:", req.body); // සර්වර් එකේ Terminal එකේ මේක පේනවද බලන්න

        if (!buyer) return res.status(400).json({ error: "Buyer ID is missing" });

        const newOrder = new Order({ product, buyer, sellerName, paymentMethod, buyerPhone, deliveryLocation });
        await newOrder.save();
        res.status(201).json({ success: true, order: newOrder });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// GET: Buyer orders
router.get('/buyer/:buyerId', async (req, res) => {
    try {
        const orders = await Order.find({ buyer: req.params.buyerId }).populate('product');
        res.json(orders);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// GET: Seller orders
router.get('/seller/:sellerName', async (req, res) => {
    try {
        const decoded = decodeURIComponent(req.params.sellerName);
        const orders = await Order.find({ sellerName: { $regex: new RegExp("^" + decoded + "$", "i") } })
            .populate('product');
        res.json(orders);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// PUT: Status update
router.put('/:id/status', async (req, res) => {
    try {
        const { status, cancellationReason } = req.body;
        const update = { status };
        if (cancellationReason) update.cancellationReason = cancellationReason;
        const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
        res.json({ success: true, order });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// PUT: Archive
router.put('/:id/archive', async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, { isArchived: true }, { new: true });
        res.json({ success: true, order });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

module.exports = router;