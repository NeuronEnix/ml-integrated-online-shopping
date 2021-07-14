const ItemModel = require( "../model" );
const UserModel = require( "../../user/model" );
const ShopModel = require( "../../shop/model" );
const OrderModel = require( "../../order/model" );
const RateModel = require( "../../order/rate.model" );

const fs = require( "fs" );
const path = require( "path" );
const { resOk, resErr, resErrType } = require('../../../handlers/responseHandler');


module.exports = async (req, res, next ) => {

    try {
        const { itemID } = req.body;
        const { shopID, userID } = req.user;

        const deletedDoc = await ItemModel.findOneAndDelete( { _id: itemID, shopID } );

        if ( !deletedDoc )
            return resErr( res, resErrType.resNotFound, { infoToClient: "The Item may have been already deleted" } );
        
        const shopDoc = await ShopModel.findById( shopID );
        shopDoc.onSale = shopDoc.onSale.filter( item => String(item.itemID) != String(itemID) )
        await shopDoc.save();
        
        try {
        
            if ( deletedDoc.img ) // Delete previous images
                deletedDoc.img.forEach( img => fs.unlinkSync( path.join( __dirname, "..", "..", "..", "public", "item", img ) ) );
            console.log( __dirname )
        } catch ( err ) {
            // no such file or directory == -4058
            // if that is not the error then re throw error
            if ( err.errno != -4058 ) 
                throw err;
        }
        
        await RateModel.deleteMany({ itemID } );
        await OrderModel.deleteMany( { itemID } );

        const userDoc = await UserModel.findById( userID );
        userDoc.cart = userDoc.cart.filter( item => String(item.itemID) != String(itemID) )
        await userDoc.save();

        return resOk( res );
        
    } catch( err ) {

        return next( { _AT: __filename, err } );

    }

};
