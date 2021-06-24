const mongoose = require( 'mongoose' );

const itemSchema = new mongoose.Schema ({

    // Data
    shopID:  { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, uppercase: true, required: true },
    rateSum: { type: Number, default: 0 },
    rateCount: { type: Number, default: 0 },
    description: { type: String, required: true },
    subDetail: {
        type : [ {
            price: Number,
            stock: Number,
            selectable: {},
            _id:false,
        } ],
        required: true,
    },
    img: Array,

});

itemSchema.index( { shopID: 1, name: 1 }, { unique: true } );

const ItemModel = mongoose.model( 'items', itemSchema ) ;
module.exports = ItemModel;
