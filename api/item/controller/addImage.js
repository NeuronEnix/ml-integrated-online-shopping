const fs = require('fs');
const path = require( "path" );
const ItemModel = require( "../model" );
const { resOk, resErr, resErrType } = require('../../../handlers/responseHandler');


module.exports = async (req, res, next ) => {

    try {
        const { itemName } = req.body;
        const { shopID } = req.user;

        if ( req.user.typ != 'a' )
            return resErr( res, resErrType.unAuthorized,
                { infoToClient: "You Are Not Authorized to Add Item" }
            );

        const itemDoc = await ItemModel.findOne( { name: itemName, shopID }, { img: 1 } );

        if ( !itemDoc )
            return resErr( res, resErrType.resNotFound, { infoToClient: "Invalid Item Name" } );
        try {
            
            if ( itemDoc.img ) // Delete previous images
                itemDoc.img.forEach( img => fs.unlinkSync( path.join( __dirname, "../../../", "img", img ) ) );

        } catch ( err ) {
            // no such file or directory == -4058
            // if that is not the error then re throw error
            if ( err.errno != -4058 ) 
                throw err;
        }
        
        const imgFileNameList = req.files.img.map( eachImg => eachImg.filename );
        itemDoc.img = imgFileNameList;

        await itemDoc.save();
        return resOk( res );
        
    } catch( err ) {

        return next( { _AT: __filename, err } );

    }

};
