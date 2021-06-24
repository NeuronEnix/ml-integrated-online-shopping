const OrderModel = require('../model');
const { resOk, resErr, resErrType } = require('../../../handlers/responseHandler');

module.exports = async ( req, res, next ) => {
    try {
        const { userID, shopID } = req.user; 

        const orderDoc = await OrderModel();
        
        Object.assign( orderDoc, { userID, shopID, ...req.body } )

        await orderDoc.save();
        return resOk( res );

    } catch ( err ) {
        return next( { _AT: __filename, err } );
    }
}