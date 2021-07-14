const ShopModel = require('../model');

const { resOk, resErr, resErrType } = require('../../../handlers/responseHandler');

module.exports = async ( req, res, next ) => {
    try {
        const { shopID } = req.query;
        const shopDoc = await ShopModel.findById( shopID, { name:1, color:1, address: 1, _id: 0 } );
        return resOk( res, shopDoc );
        
    } catch ( err ) {
        return next( { _AT: __filename, err } );
    }
}
