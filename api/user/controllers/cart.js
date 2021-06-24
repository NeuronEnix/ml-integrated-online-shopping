const UserModel = require('../model');
const { resOk, resErr, resErrType } = require('../../../handlers/responseHandler');

module.exports.update = async ( req, res, next ) => {
    try {
        const { userID, shopID } = req.user; 

        const userDoc = await UserModel.findOne( { _id: userID, shopID } );
        console.log( userDoc );
        if ( !userDoc ) return resErr( res, resErrType.unAuthorized, { infoToClient: "Invalid User" } );

        userDoc.cart = req.body;
        await userDoc.save();
        return resOk( res );

    } catch ( err ) {
        return next( { _AT: __filename, err } );
    }
}

module.exports.view = async ( req, res, next ) => {
    try {
        const { userID, shopID } = req.user; 

        const userDoc = await UserModel.findOne( { _id: userID, shopID } );

        if ( !userDoc ) return resErr( res, resErrType.unAuthorized, { infoToClient: "Invalid User" } );

        return resOk( res, userDoc.cart );

    } catch ( err ) {
        return next( { _AT: __filename, err } );
    }
}
