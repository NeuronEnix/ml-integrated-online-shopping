const bcrypt = require( 'bcrypt' );
const UserModel = require('../model');
const { accTok, refTok } = require('../../../handlers/tokenHandler');
const { resOk, resErr, resErrType } = require('../../../handlers/responseHandler');

module.exports = async ( req, res, next ) => {
    try {
        console.log( req.params );
        const { email, pass } = req.body;
        
        const userDoc = await UserModel.findOne( { email }, { pass:1, typ:1, shopID:1 } ).lean();

        if ( !userDoc || !bcrypt.compareSync( pass, userDoc.pass ) ) {
            return resErr( res, resErrType.invalidCred, { infoToClient: "Email or Password Incorrect" } )
        }
        
        const rTok = await refTok.signAndSave( { userID: userDoc._id, shopID: userDoc.shopID, typ: userDoc.typ } );
        refTok.addToCookie( res, rTok );
        const accTokPayload = { userID: userDoc._id, typ: userDoc.typ, shopID: userDoc.shopID, tokID: refTok.decode( rTok ).tokID }

        return resOk( res, { accTok: accTok.sign( accTokPayload ), typ: userDoc.typ, shopID: userDoc.shopID } );
        
    } catch ( err ) {
        return next( { _AT: __filename, err } );
    }
}