const ItemModel = require( "../model" );
const { resOk, resErr, resErrType } = require('../../../handlers/responseHandler');


module.exports = async (req, res, next ) => {

    try {

        const { itemID } = req.query;
        const { shopID } = req.user;

        const itemDoc = await ItemModel.findOne( { _id: itemID, shopID }, { __v: 0, __id: 0,  } ).lean();

        if ( !itemDoc )
            return resErr( res, resErrType.resNotFound, { infoToClient: "Item You are looking for is not available." } );
        
        return resOk( res, itemDoc );

    } catch( err ) {

        if ( err.code === 11000 )
            return resErr( res, resErrType.duplicateErr, { infoToClient: 'Item Name Already Exist' } );
        return next( { _AT: __filename, err } );

    }

};
