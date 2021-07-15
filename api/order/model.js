const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    // Data
    shopID: { type: mongoose.Schema.Types.ObjectId, required: true },
    userID: { type: mongoose.Schema.Types.ObjectId, required: true },
    itemID: { type: mongoose.Schema.Types.ObjectId, required: true },
    subID: { type: mongoose.Schema.Types.ObjectId, required: true },
    qty: { type: Number, required: true },
    status: { type: Number, default: 4 },
    price: { type: Number, default: 0 },
    offer: { type: Number, default: 0 },
    userRating: { type: Number, default: 0 },

    // Meta
    creAt: { type: Date, default: Date.now },
});

const OrderModel = mongoose.model("orders", orderSchema);
module.exports = OrderModel;
