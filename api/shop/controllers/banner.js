const ShopModel = require('../model');

const { resOk, resErr, resErrType } = require('../../../handlers/responseHandler');

module.exports.addBanner = async ( req, res, next ) => {
    try {
        console.log( req.file );
        const shopDoc = await ShopModel.findById( req.user.shopID );

        if ( !shopDoc )
            return resErr( res, resErrType.resNotFound, { infoToClient: "Shop Not Found" } );
        shopDoc.banner.push( req.file.filename );
        await shopDoc.save();
        return resOk( res );
        
    } catch ( err ) {
        return next( { _AT: __filename, err } );
    }
}

module.exports.listBanner = async ( req, res, next ) => {
    try {
        
        const shopDoc = await ShopModel.findById( req.user.shopID );

        if ( !shopDoc )
            return resErr( res, resErrType.resNotFound, { infoToClient: "Shop Not Found" } );

        return resOk( res, shopDoc.banner );
        
    } catch ( err ) {
        return next( { _AT: __filename, err } );
    }
}

