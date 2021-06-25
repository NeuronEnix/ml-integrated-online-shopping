const ShopModel = require('../model');

const { resOk, resErr, resErrType } = require('../../../handlers/responseHandler');

module.exports.applyOffer = async ( req, res, next ) => {
    try {
        
        const shopDoc = await ShopModel.findById( req.user.shopID );

        if ( !shopDoc )
            return resErr( res, resErrType.resNotFound, { infoToClient: "Shop Not Found" } );

        shopDoc.onSale = req.body;
        
        await shopDoc.save();
        return resOk( res );
        
    } catch ( err ) {
        return next( { _AT: __filename, err } );
    }
}

module.exports.listOffer = async ( req, res, next ) => {
    try {
        
        const shopDoc = await ShopModel.findById( req.user.shopID );

        if ( !shopDoc )
            return resErr( res, resErrType.resNotFound, { infoToClient: "Shop Not Found" } );

        return resOk( res, shopDoc.onSale );
        
    } catch ( err ) {
        return next( { _AT: __filename, err } );
    }
}

