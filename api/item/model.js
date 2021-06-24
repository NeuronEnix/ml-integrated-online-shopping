const mongoose = require( 'mongoose' );

const itemSchema = new mongoose.Schema ({

    // Data
    shopID:  { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, uppercase: true, required: true },
    rating: { default: { sum: 0, count: 0 } },
    description: { type: String, uppercase: true, required: true },
    subDetail: {
        type : [ {
            price: Number,
            stock: Number,
            selectable: {},
            _id:false,
        } ],
        required: true,
    },

});

itemSchema.index( { shopID: 1, name: 1 }, { unique: true } );

const ItemModel = mongoose.model( 'items', itemSchema ) ;
module.exports = ItemModel;
