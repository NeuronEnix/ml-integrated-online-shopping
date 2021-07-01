const OrderModel = require('../model');
const UserModel = require( "../../user/model" );
const ShopModel = require( "../../shop/model" );
const ItemModel = require( "../../item/model" );

const { stripeCheckout } = require('../../../services/stripeCheckout' );
const { resOk, resErr, resErrType } = require('../../../handlers/responseHandler');

module.exports = async ( req, res, next ) => {
    try {
        const { userID, shopID } = req.user; 

        const userDoc = await UserModel.findById( userID ).lean();
        const cart = userDoc.cart;
        const shopDoc = await ShopModel.findById( shopID ).lean();

        let totPrice = 0;

        for ( item of cart ) {
            item.shopID = shopID;
            item.userID = userID;
            itemDoc = await ItemModel.findById( item.itemID ).lean();
            item.price = itemDoc.subDetail.find( sub => String( item.subID ) == String( sub._id ) ).price;
            item.offer = shopDoc.onSale.find( offerItem => String( offerItem.itemID ) == String( item.itemID ) )?.offer || 0;

            totPrice += parseInt( item.price );

        }

        // Payment
        const stripeToken = req.body;
        const userMetadata = { userID: req.user.userID };
        const stripeResult = await stripeCheckout( stripeToken, totPrice, userDoc.email, "1234567890", userDoc.name, userMetadata );

        if ( stripeResult.status !== "succeeded" ) 
            return resErr( res, resErrType.stripeError, { 
                infoToClient: "Payment Failed: " + stripeResult.msg,
                infoToServer: stripeResult
            })

        for ( item of cart ) {
            const orderDoc = await OrderModel();
            Object.assign( orderDoc, item );
            await orderDoc.save();
        }

        return resOk( res, stripeResult );

    } catch ( err ) {
        return next( { _AT: __filename, err } );
    }
}

