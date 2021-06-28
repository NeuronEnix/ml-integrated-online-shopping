const router = require('express').Router();
const cookieParser = require('cookie-parser')();

const TokenModel = require("./model" );
const { refTok, accTok } = require('./controller' )
const { resOk, resErr, resErrType } = require('../responseHandler');
const { tokenErrHandler } = require('./config')

router.get( "/tok/refresh", cookieParser, async ( req, res, next ) => {
    try {
        const { tokID, userID, shopID, iat } = refTok.verify( req.cookies.refTok );
        const updated_iat = new Date().getTime();
        const updatedInfo = await TokenModel.updateOne( { _id:tokID, userID, iat }, { $set: { iat: updated_iat } } );

        // If no match ( probably because of old refToken being active )
        if ( updatedInfo.n == 0 ) return resErr( res, resErrType.invalidToken, { infoToClient: "Sing In Again!" } )

        const rTok = refTok.sign( { tokID, userID, shopID, iat:updated_iat } );
        refTok.addToCookie( res, rTok );
        return resOk( res, { accTok : accTok.sign( { tokID, userID, shopID } )} );

    } catch ( err ) {
        return tokenErrHandler( err, req, res, next );
    }
})

router.get( "/tok/clear", cookieParser, async  ( req, res, next ) => {
    try {
        const rTok = req.cookies && req.cookies.refTok;
        if ( rTok ) {
            const { tokID } = refTok.verify( rTok );
            await TokenModel.findByIdAndDelete( tokID );
        }
        res.clearCookie( "refTok" );
        return resOk( res );
    } catch ( err ) {
        return tokenErrHandler( err, req, res, next );
    }
} )
module.exports = router;