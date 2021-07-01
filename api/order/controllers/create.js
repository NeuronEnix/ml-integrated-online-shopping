const OrderModel = require('../model');
const UserModel = require( "../../user/model" );
const ShopModel = require( "../../shop/model" );
const ItemModel = require( "../../item/model" );

const { resOk, resErr, resErrType } = require('../../../handlers/responseHandler');

module.exports = async ( req, res, next ) => {
    try {
        const { userID, shopID } = req.user; 

        

        const cart = ( await UserModel.findById( userID ).lean() ).cart;
        const shopDoc = await ShopModel.findById( shopID ).lean();
        for ( item of cart ) {
            item.shopID = shopID;
            item.userID = userID;
            itemDoc = await ItemModel.findById( item.itemID ).lean();
            item.price = itemDoc.subDetail.find( sub => String( item.subID ) == String( sub._id ) ).price;
            item.offer = shopDoc.onSale.find( offerItem => String( offerItem.itemID ) == String( item.itemID ) )?.offer || 0;

            const orderDoc = await OrderModel();
            Object.assign( orderDoc, item );
            await orderDoc.save();
        }
        return resOk( res );

    } catch ( err ) {
        return next( { _AT: __filename, err } );
    }
}