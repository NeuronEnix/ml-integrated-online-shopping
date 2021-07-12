const mongoose = require( 'mongoose' );

const rateSchema = new mongoose.Schema ({

    // Data
    shopID: { type: mongoose.Schema.Types.ObjectId, required: true },
    orderID: { type: mongoose.Schema.Types.ObjectId, required: true },
    userID: { type: mongoose.Schema.Types.ObjectId, required: true },
    itemID: { type: mongoose.Schema.Types.ObjectId, required: true },
    subID: { type: mongoose.Schema.Types.ObjectId, required: true },
    rate: { type: Number, default: 0 },
    
    // Meta
    creAt: { type: Date, default: Date.now },

});

rateSchema.index( { shopID: 1, userID: 1, itemID: 1, orderID:1 }, { unique: true } );

const RateModel = mongoose.model( 'rates', rateSchema ) ;
module.exports = RateModel;
