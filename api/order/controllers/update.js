const OrderModel = require('../model');

const { resOk, resErr, resErrType } = require('../../../handlers/responseHandler');

module.exports.rating = async ( req, res, next ) => {
    try {
        const { rate, orderID } = req.body;

        const orderDoc = await OrderModel.findById( orderID );
        
        if ( !orderDoc )
            return resErr( res, resErrType.resNotFound, { infoToClient: "Invalid Order" } );

        orderDoc.userRating = rate;
        await orderDoc.save();

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
