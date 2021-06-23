const ShopModel = require('../model');

const { resOk, resErr, resErrType } = require('../../../handlers/responseHandler');

module.exports = async ( req, res, next ) => {
    try {

        const shopDoc = await ShopModel.findById( req.user.shopID );
        Object.assign( shopDoc, req.body );
        await shopDoc.save();
        return resOk( res );
        
    } catch ( err ) {
        return next( { _AT: __filename, err } );
    }
}
