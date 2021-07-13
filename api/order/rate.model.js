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

rateSchema.statics.getAvgRating = async ( itemID ) => {
    const rateDoc = await RateModel.aggregate([
        { $match : { itemID: mongoose.Types.ObjectId( item.itemID ) } },
        { $group: {
            _id: null,
            avgRate: { $avg: "$rate" },
        }},
        { $sort: { avgRate: 1 } },
        { $project: { avgRate:1, _id: 0 } },
    ])
    if ( rateDoc.length == 1) return rateDoc[0].avgRate;
    return 0;
}

const RateModel = mongoose.model( 'rates', rateSchema ) ;
module.exports = RateModel;
