const mongoose = require( 'mongoose' );

const ObjectID = mongoose.Schema.Types.ObjectId;

const shopSchema = new mongoose.Schema ({

    // Data
    name: { type: String, uppercase: true },
    address: { type: String, uppercase: true },
    pinCode: { type: String, uppercase: true },
    onSale: { type: [ { _id: false, itemID: ObjectID, offer: Number } ] , default: [] },
    banner: { type: Array, default: [] },
    
    // Meta
    userID: { type: ObjectID, required: true },

});

shopSchema.index( { userID:1 }, { unique: true } );

const ShopModel = mongoose.model( 'shops', shopSchema ) ;
module.exports = ShopModel;
