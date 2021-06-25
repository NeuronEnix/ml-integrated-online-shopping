const mongoose = require( 'mongoose' );

const orderSchema = new mongoose.Schema ({

    // Data
    shopID: { type: mongoose.Schema.Types.ObjectId, required: true },
    userID: { type: mongoose.Schema.Types.ObjectId, required: true },
    itemID: { type: mongoose.Schema.Types.ObjectId, required: true },
    subID: { type: mongoose.Schema.Types.ObjectId, required: true },
    qty: { type: Number, required: true },
    tracking: { type: Number, default: 0 },
    
    // Meta
    creAt: { type: Date, default: Date.now },

});

const OrderModel = mongoose.model( 'orders', orderSchema ) ;
module.exports = OrderModel;
