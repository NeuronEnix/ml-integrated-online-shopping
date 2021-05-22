const jwt = require( "jsonwebtoken" );
const config = require( "./config" );
const TokenModel = require( "./model" );

class Token {
    #key;
    #expiresIn;
    constructor( key, expiresIn ) {
        this.#key = key;
        this.#expiresIn = expiresIn;
    }
    decode( tok ) {  return jwt.decode( tok ) };
    sign( payload ) { return jwt.sign( payload, this.#key, { expiresIn: this.#expiresIn } ) };
    verify( tok ) { if (!tok) tok=""; return jwt.verify( tok.replace( "Bearer ", ""), this.#key ) };
}

class AccessToken extends Token {
    constructor( key, expiresIn ) { super( key, expiresIn ); }
}

class RefreshToken extends Token {
    #cookieProperties;
    constructor( key, expiresIn, cookieMaxAge  ) {
        super( key, expiresIn );
        this.#cookieProperties = { maxAge: cookieMaxAge, httpOnly: true, };
    }
    async signAndSave ( payload = {} ) {
        const tokDoc = new TokenModel();
        Object.assign( tokDoc, payload );
        await tokDoc.save();
        tokDoc.concurrentSignInLimiter( config.maxConcurrentSignInCount );
        payload.iat = tokDoc.iat.getTime();
        payload.tokID = tokDoc._id;
        const tok = super.sign( payload );
        return tok;
    }

    addToCookie( res, tok ) { 
        res.cookie( "refTok", tok, this.#cookieProperties );
    }
}

module.exports.accTok = new AccessToken (
    config.refTok.key,
    config.refTok.expiresIn
);

module.exports.refTok = new RefreshToken(
    config.refTok.key,
    config.refTok.expiresIn,
    config.refTok.cookieMaxAgeInMS
);


module.exports.softAuthorize = ( req, res, next ) => {
    try { // Just verify token and assign it to req.user
        const aTok = req.header( 'Authorization' );
        const accTokData = this.accTok.verify( aTok );
        req.user = accTokData;
        return next();
    } catch( err ) {
        return config.tokenErrHandler( err, req, res, next );
    }
}

module.exports.hardAuthorize = async ( req, res, next ) => {
    try { // verify access token and validate it again db
        const aTok = req.header( 'Authorization' );
        const accTokData = this.accTok.verify( aTok );
        req.user = accTokData;
        return config.hardAuthorizeSequence(req, res, next );
    } catch( err ) {
        return config.tokenErrHandler( err, req, res, next );
    }
}

module.exports.Token = Token;