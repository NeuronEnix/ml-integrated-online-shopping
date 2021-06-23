const mongoose = require( 'mongoose' );

const shopSchema = new mongoose.Schema ({

    // Data
    name: { type: String, uppercase: true },
    address: { type: String, uppercase: true },
    pinCode: { type: String, uppercase: true },
    
    // Meta
    userID: { type: mongoose.Schema.Types.ObjectId, required: true },

});

shopSchema.index( { userID:1 }, { unique: true } );

const ShopModel = mongoose.model( 'shops', shopSchema ) ;
module.exports = ShopModel;
