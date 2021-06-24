const ItemModel = require( "../model" );
const { resOk, resErr, resErrType } = require('../../../handlers/responseHandler');


module.exports = async (req, res, next ) => {

    try {

        if ( req.user.typ != 'a' )
            return resErr( res, resErrType.unAuthorized,
                { infoToClient: "You Are Not Authorized to Add Item" }
            );

        // const imgFileNameList = req.files.img.map( eachImg => eachImg.filename );

        const itemDoc = new ItemModel();
        Object.assign( itemDoc, req.body );
        
        // itemDoc.img = imgFileNameList;
        itemDoc.shopID = req.user.shopID;

        await itemDoc.save();
        return resOk( res );
        
    } catch( err ) {

        if ( err.code === 11000 )
            return resErr( res, resErrType.duplicateErr, { infoToClient: 'Item Name Already Exist' } );
        return next( { _AT: __filename, err } );

    }

};
