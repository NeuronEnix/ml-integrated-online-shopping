const OrderModel = require('../model');
const RateModel = require( "../rate.model" );
const ItemModel = require( "../../item/model" );

const { resOk, resErr, resErrType } = require('../../../handlers/responseHandler');

module.exports.rating = async ( req, res, next ) => {
    try {
        const { rate, orderID, } = req.body;

        const orderDoc = await OrderModel.findById( orderID );
        
        if ( !orderDoc )
            return resErr( res, resErrType.resNotFound, { infoToClient: "Invalid Order" } );

        orderDoc.userRating = rate;
        await orderDoc.save();

        const existingRateDoc = await RateModel.findOne( { orderID } );
        if ( existingRateDoc ) {
            existingRateDoc.rate = rate;
            existingRateDoc.save();
        } else {
            const rateDoc = new RateModel();
            const { shopID, userID, itemID, subID } = orderDoc;
            const { category } = await ItemModel.findById( itemID, { category:1, _id:0 } ).lean()
            Object.assign( rateDoc, { shopID, userID, itemID, subID, rate, orderID, category } );
            await rateDoc.save();
        }

        return resOk( res );

    } catch ( err ) {
        return next( { _AT: __filename, err } );
    }
}

module.exports.cancel = async ( req, res, next ) => {
    try {
        const { orderID } = req.body;

        const orderDoc = await OrderModel.findById( orderID );
        
        if ( !orderDoc )
            return resErr( res, resErrType.resNotFound, { infoToClient: "Invalid Order" } );

        orderDoc.status = 0;
        await orderDoc.save();

        return resOk( res );

    } catch ( err ) {
        return next( { _AT: __filename, err } );
    }
}
