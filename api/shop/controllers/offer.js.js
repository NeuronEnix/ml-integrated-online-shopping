const ShopModel = require('../model');
const mongoose = require( "mongoose" );
const ItemModel = require( "../../item/model" );

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
        const onSaleItems = [];

        for ( item of shopDoc.onSale ){
            const curItem = await ItemModel.findOne( { _id: item.itemID } );
            onSaleItems.push({
                itemID: item.itemID, offer: item.offer,
                price: curItem.subDetail[0].price,
                name: curItem.name,
            })            
        }
        
        return resOk( res, onSaleItems );
        
    } catch ( err ) {
        return next( { _AT: __filename, err } );
    }
}

