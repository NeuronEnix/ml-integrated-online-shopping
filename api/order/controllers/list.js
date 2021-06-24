const OrderModel = require('../model');
const { resOk, resErr, resErrType } = require('../../../handlers/responseHandler');

module.exports = async ( req, res, next ) => {
    try {
        const { userID, shopID } = req.user; 

        const orderDoc = await OrderModel.find( { userID, shopID }, { _id:0, __v:0} );
        
        if ( !orderDoc )
            return resErr( res, resErrType.resNotFound, { infoToClient: "Invalid Order" } );

        return resOk( res, orderDoc );

    } catch ( err ) {
        return next( { _AT: __filename, err } );
    }
}