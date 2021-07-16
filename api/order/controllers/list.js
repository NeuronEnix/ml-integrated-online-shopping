const OrderModel = require('../model');
const UserModel = require( "../../user/model" );
const ItemModel = require( "../../item/model" );
const ShopModel = require( "../../shop/model" );
const moment = require("moment");
const AUTO_UPDATE_IN_MS = 10000;

const { resOk, resErr, resErrType } = require('../../../handlers/responseHandler');

module.exports = async ( req, res, next ) => {
    try {
        const { userID, shopID, typ } = req.user; 
        const orderFilter = { shopID };

        if ( typ != "a" )
            orderFilter.userID = userID;

        const orderDoc = await OrderModel.find( orderFilter, { __v:0 } ).sort({_id:-1}).lean();
        
        if ( !orderDoc )
            return resErr( res, resErrType.resNotFound, { infoToClient: "Invalid Order" } );

        const curTime = moment();
        for ( order of orderDoc ) {
            order.itemObj = await ItemModel.findById( order.itemID, { _id:0, __v:0 } ).lean();
            order.orderID = order._id;

            if ( order.status != 0 ){
                if ( moment().isAfter( moment( order.creAt ).add( 3*AUTO_UPDATE_IN_MS, "milliseconds" ) ) )
                    order.status = 4;
                else if ( moment().isAfter( moment( order.creAt ).add( 2*AUTO_UPDATE_IN_MS, "milliseconds" ) ) )
                    order.status = 3;
                else if ( moment().isAfter( moment( order.creAt ).add( 1*AUTO_UPDATE_IN_MS, "milliseconds" ) ) )
                    order.status = 2;

            }

            delete order._id;
        }

        return resOk( res, orderDoc );

    } catch ( err ) {
        return next( { _AT: __filename, err } );
    }
}
