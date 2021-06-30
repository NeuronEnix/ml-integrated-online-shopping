const UserModel = require('../model');
const ItemModel = require( "../../item/model" );

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
        cartList = [];
        for ( cart of userDoc.cart ) {
            cartList.push({
                itemID: cart.itemID,
                subID: cart.subID,
                qty: cart.qty,
                itemObj: (await ItemModel.findById( cart.itemID, { _id:0, __v:0} )) ,
            }) 
        }
        return resOk( res, cartList );

    } catch ( err ) {
        return next( { _AT: __filename, err } );
    }
}
