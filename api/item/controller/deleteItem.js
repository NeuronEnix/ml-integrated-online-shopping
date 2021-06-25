const ItemModel = require( "../model" );
const { resOk, resErr, resErrType } = require('../../../handlers/responseHandler');


module.exports = async (req, res, next ) => {

    try {
        
        const deletedDoc = await ItemModel.findOneAndDelete( { _id: req.body.itemID, shopID: req.user.shopID } );

        if ( !deletedDoc )
            return resErr( res, resErrType.resNotFound, { infoToClient: "The Item may have been already deleted" } );
        
        try {
        
            if ( deletedDoc.img ) // Delete previous images
                deletedDoc.img.forEach( img => fs.unlinkSync( path.join( __dirname, "../../../", "img", img ) ) );

        } catch ( err ) {
            // no such file or directory == -4058
            // if that is not the error then re throw error
            if ( err.errno != -4058 ) 
                throw err;
        }
        
        return resOk( res );
        
    } catch( err ) {

        return next( { _AT: __filename, err } );

    }

};
