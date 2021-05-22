const TokenModel = require( "./model" );
const { resErr, resErrType, } = require( '../responseHandler' )
const {
    MAX_CONCURRENT_LOGIN_COUNT = "2",

    REFRESH_TOKEN_KEY = "refTokKey",
    REFRESH_TOKEN_EXPIRES_IN_DAYS = "5",

    ACCESS_TOKEN_KEY = "accTokKey",
    ACCESS_TOKEN_EXPIRES_IN_MIN = "20",
} = process.env;

module.exports.maxConcurrentSignInCount = parseInt( MAX_CONCURRENT_LOGIN_COUNT );

module.exports.refTok = {
    key: REFRESH_TOKEN_KEY,
    expiresIn: REFRESH_TOKEN_EXPIRES_IN_DAYS + "d",
    cookieMaxAgeInMS: parseInt( REFRESH_TOKEN_EXPIRES_IN_DAYS ) * 24*60*60*1000,
}

module.exports.accTok = {
    key: ACCESS_TOKEN_KEY,
    expiresIn: ACCESS_TOKEN_EXPIRES_IN_MIN + "m",
}

// "req.user" will have accTokData
module.exports.hardAuthorizeSequence = async ( req, res, next ) => {
    // Write Query to db and verify
    const doc = await TokenModel.findById( req.user.tokID, "iat userID" );
    if( !doc ) return resErr( res, resErrType.unAuthorized );
    console.log( "Hard Authorization: Success" );
    return next();

}

module.exports.tokenErrHandler = ( err, req, res, next ) => {
    let infoToServer = err;
    switch ( err.name ) {
        case 'TokenExpiredError': return resErr( res, resErrType.tokenExpired );
        case "TokenNotFound": // falls through
        case 'JsonWebTokenError': infoToServer = err.message; // falls through
        default: return resErr( res, resErrType.invalidToken,
            { infoToClient: "Invalid Token", infoToServer }
        );
    }
}


