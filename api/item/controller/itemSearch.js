const ItemModel = require( "../model" );
const ShopModel = require( "../../shop/model" );
const { resOk, resErr, resErrType } = require('../../../handlers/responseHandler');
const mongoose = require("mongoose");


module.exports = async (req, res, next ) => {

    try {

        const { itemName } = req.query;
        const { shopID } = req.user;
        const regExItemName = ".*" + itemName.split("").join( ".*" ) + ".*" ; 

        console.log( regExItemName );

        const itemList = await ItemModel.aggregate([
            { $match : { shopID: mongoose.Types.ObjectId( shopID ), name : new RegExp( regExItemName ),  } },
            { $sort:{ name:1 } },
            { $project: { 
                name:1, itemID: "$_id", img:1,
                rating: { $divide: [ "$rateSum", { $cond: [ { $eq: [ "$rateCount", 0 ] }, 1, "$rateCount" ] } ] },
                _id:0,
            } },
        ]);

        const itemListByCategory = await ItemModel.aggregate([
            { $match : { shopID: mongoose.Types.ObjectId( shopID ), category : new RegExp( regExItemName ),  } },
            { $sort:{ name:1 } },
            { $project: { 
                name:1, itemID: "$_id", img:1,
                rating: { $divide: [ "$rateSum", { $cond: [ { $eq: [ "$rateCount", 0 ] }, 1, "$rateCount" ] } ] },
                _id:0,
            } },
        ]);

        for ( eachItem of itemListByCategory )
            if ( !itemList.find( item => String(eachItem.itemID) == String( item.itemID ) ) )
                itemList.push( eachItem );

        for ( item of itemList )
            item.price = (await ItemModel.findById( item.itemID )).subDetail[0].price;
        
        return resOk( res, { itemList, onSale: (await ShopModel.findById( shopID )).onSale } ) ;

    } catch( err ) {

        return next( { _AT: __filename, err } );

    }

};
