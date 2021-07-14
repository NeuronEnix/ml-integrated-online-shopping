const bcrypt = require('bcrypt');
const UserModel = require('../model');
const ShopModel = require( "../../shop/model" );
const { resOk, resErr, resErrType } = require('../../../handlers/responseHandler');

module.exports = async ( req, res, next ) => {
    try {
        
        console.time( "pass" );
        req.body.pass = bcrypt.hashSync( req.body.pass, 12 );
        console.timeEnd( "pass" );

        const userDoc = new UserModel();
        Object.assign( userDoc, req.body );
        
        let shopDoc;

        if ( req.params.id == "shop" ) {
            if ( await UserModel.findOne( { email: req.body.email, typ: "a" } ) )
                return resErr( res, resErrType.duplicateErr, { infoToClient: 'Shop Is Already Registered with this email' } );

            shopDoc = new ShopModel();
            shopDoc.userID = userDoc._id;
            await shopDoc.save();

            userDoc.typ = "a";
            
        } else {

            shopDoc = await ShopModel.findById( req.params.id );
            if ( !shopDoc )
                return resErr( res, resErrType.unAuthorized, { infoToClient: "Invalid Shop" } );

            userDoc.typ = "c";
            
        }
        
        userDoc.shopID = shopDoc._id;

        await userDoc.save();
        return resOk( res );
        
    } catch ( err ) {
        if ( err.code === 11000 )
            return resErr( res, resErrType.duplicateErr, { infoToClient: 'Email Already Registered' } );
        return next( { _AT: __filename, err } );
    }
}
