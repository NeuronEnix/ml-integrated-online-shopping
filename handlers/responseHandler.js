const util = require("util");
const { reqLogger } = require( './requestHandler');

const logger = ( res, data ) => {
    try {
        console.log( "Response:", util.inspect(
            { id: res._log.id, ms:Date.now()-res._log.ts, data },
            { depth:null, colors:true }
        ));
    } catch ( err ) {
        console.log( 'LOG ERROR!' );
        console.log( err );
    }
}

const resOk = async ( res, data ) => {
    const resData = { code: 0, data };
    logger( res, { ...resData } );
    res.status( 200 ).send( resData );
};

const resErr = async ( res, resErrType, {infoToClient = "Error occurred, Try again later...", infoToServer} = {} ) => {
    const errData = { ...resErrType, info: infoToClient, };
    if ( resErrType.err === "InvalidToken" ) res.clearCookie( "refTok", { path: "/tok" } );
    logger( res, { ...errData, infoToServer } );
    res.status( resErrType.sts ).send( errData );
}

const resErrType = {

    // Severe Errors
    unknownErr  : { sts: 500, code: -1, err: "InternalServerErr" },
    jsonParseErr: { sts: 422, code: -2, err: "IncorrectJSON"     },
    
    // Shouldn't Happen much Often or something is wrong 
    unAuthorized: { sts: 401, code: 1, err: "NotAuthorized"    },
    resNotFound : { sts: 404, code: 2, err: "ResourceNotFound" },
    invalidAPI  : { sts: 404, code: 3, err: "InvalidAPI"       },
    dbError     : { sts: 503, code: 4, err: "DatabaseErr"      },

    // Token Related Errors
    invalidToken: { sts: 401, code: 5, err: "InvalidToken" },
    tokenExpired: { sts: 401, code: 6, err: "TokenExpired" },

    // reCaptcha Related Errors
    invalidReCaptchaToken: { sts: 401, code: 20, err: "InvalidReCaptchaToken" },
    reCaptchaNotSolved:    { sts: 401, code: 21, err: "ReCaptchaNotSolved"    },

    //SendGrid Error
    sendGridEmailErr: { sts: 503, code:30, err: "SendGridEmailErr" },

    // Stripe Error`
    stripeError: { sts: 503, code:30, err: "SendGridEmailErr" },

    //Twilio Error
    twilioErr: { sts: 503, code:40, err: "TwilioErr" },

    // Expected error
    validationErr: { sts: 422, code: 100, err: "ValidationErr"  },
    invalidCred  : { sts: 401, code: 101, err: "InvalidCred"    },
    duplicateErr : { sts: 409, code: 102, err: "DuplicateErr"   },
    notAllowed   : { sts: 401, code: 103, err: "NotAllowed"     },

}


// uncaught error handler
const unknownErrHandler = async ( err, req, res, next ) => {
    try {
        console.log( "RESPONSE FROM UNCAUGHT ERROR HANDLER" );

        let errType = resErrType.unknownErr;
        let infoToServer = { _AT: "unknownErrHandler", err };

        // If err was thrown from controllers catch block then err will be of form -> { _AT: __filename, err: actualError }
        if ( typeof err === "object" && err._AT) infoToServer = { _AT: err._AT, err: err.err };

        // Log incoming req, if Incoming request was not logged ( May happen if error was detected before reqLogger was executed )
        if ( !res._log ) await reqLogger( req, res );

        // Thrown by express.json() for incorrect json structure
        if ( err.type === 'entity.parse.failed' )
            errType = resErrType.jsonParseErr;
        
        // Failed to connect to db
        else if ( err.name === 'MongooseError' )
            errType = resErrType.dbError;

        // Error from mongodb server after execution of query
        else if ( err.name === 'MongoError') {
            errType = resErrType.dbError,
            infoToServer.err = { ...err };
        }

        // Lost Already Established Connection to DB ( Connection was Refused )
        else if ( err.name === 'MongooseServerSelectionError') {
            errType = resErrType.dbError
            infoToServer.err = err.reason;
        }
        
        // No idea what the error is...
        if ( typeof err === "object" ) {
            if ( err.message ) infoToServer.errMsg = err.message;
            if ( err.name ) infoToServer.errName = err.name;
        }
        return resErr( res, errType, {infoToServer} );
    } catch ( err ) {

        return resErr( res, resErrType.unknownErr, { infoToServer: { _AT: "unknownErrHandler.catch", err } } );

    } finally {
        // Log stuff
        console.log( "Logged At finally" );
    }
    
};

module.exports = { resOk, resErr, resErrType, unknownErrHandler };
