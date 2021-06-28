const ItemModel = require( "../model" );
const { resOk, resErr, resErrType } = require('../../../handlers/responseHandler');
const mongoose = require("mongoose");


module.exports = async (req, res, next ) => {

    try {

        const { itemName } = req.query;
        const { shopID } = req.user;
        const regExItemName = ".*" + itemName.split("").join( ".*" ) + ".*" ; 
        console.log( regExItemName );
        const itemList = await ItemModel.aggregate([
            { $match : { shopID: mongoose.Types.ObjectId( shopID ) , name : new RegExp( regExItemName ),  } },
            { $sort:{ name:1 } },
            { $limit: 10 } ,
            { $project: { name:1, itemID: "$_id", _id:0 } },
        ]);
    
        return resOk( res, itemList ) ;

    } catch( err ) {

        return next( { _AT: __filename, err } );

    }

};
