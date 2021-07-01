const OrderModel = require('../model');
const UserModel = require( "../../user/model" );
const ItemModel = require( "../../item/model" );
const ShopModel = require( "../../shop/model" );

const { resOk, resErr, resErrType } = require('../../../handlers/responseHandler');

module.exports = async ( req, res, next ) => {
    try {
        const { userID, shopID } = req.user; 

        const orderDoc = await OrderModel.find( { userID, shopID }, { _id:0, __v:0} ).lean();
        
        if ( !orderDoc )
            return resErr( res, resErrType.resNotFound, { infoToClient: "Invalid Order" } );

        for ( order of orderDoc ) {
            order.itemObj = await ItemModel.findById( order.itemID, { _id:0, __v:0 } ).lean();
        }

        return resOk( res, orderDoc );

    } catch ( err ) {
        return next( { _AT: __filename, err } );
    }
}
