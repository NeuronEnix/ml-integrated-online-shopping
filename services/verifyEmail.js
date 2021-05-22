const sgMail = require('@sendgrid/mail');

const { resOk, resErr, resErrType } = require( "../handlers/responseHandler");
const { Token } = require( "../handlers/tokenHandler/controller");
const { tokenErrHandler } = require( '../handlers/tokenHandler/config' );

const {
    SEND_GRID_API_KEY = "sendGridApiKey",
    SEND_GRID_EMAIL = "sendGridEmail",
    SEND_GRID_DISPLAY_NAME = "sendGridDisplayName",
    NODE_ENV = "dev",
    EMAIL_VERIFICATION_TOKEN_KEY = "emailVerificationToken",
    EMAIL_VERIFICATION_TOKEN_EXPIRES_IN_MIN = '20',
    REACT_DOMAIN = "http://localhost:8080",
    REACT_EMAIL_VERIFICATION_PATH = "/user/verify-email",
} = process.env;

sgMail.setApiKey( SEND_GRID_API_KEY );

const tokenizer = new Token (
    EMAIL_VERIFICATION_TOKEN_KEY,
    EMAIL_VERIFICATION_TOKEN_EXPIRES_IN_MIN + 'm'
);


module.exports.tokenizeBody = ( req, res, next ) => {
    try {
        req.body = { email: req.body.email, tok: tokenizer.sign( req.body ) } ;
        return next();
    } catch ( err ) {
        tokenErrHandler( err, req, res, next );
    }
}
module.exports.sendVerificationEmail = async ( req, res, next ) => {

    const { email, tok } = req.body;

    if ( NODE_ENV != 'production' ) return resOk( res,  {emailVerificationToken: tok } );
    
    try {

        const verificationLink = `${REACT_DOMAIN + REACT_EMAIL_VERIFICATION_PATH}/${tok}`;

        await sgMail.send({
            from: {
                Name: SEND_GRID_DISPLAY_NAME,
                email: SEND_GRID_EMAIL,
            },
            to: email,
            subject: "Envision Email Verification",
            text: "Link to Verify Email: " + verificationLink,
            html: 
                `<h1>Envision Email Verification: <h1>
                <br>
                <a href='${verificationLink}'> Click to Register Your Email </a>`,
        });

        return resOk( res );

    } catch ( err ) {
        return resErr( res, resErrType.sendGridEmailErr, {
            infoToClient: "Failed To Send Verification Email",
            infoToServer: { _AT: __filename, err: { code: err.code, errors: err.response.body.errors } }
        });
    }
};

module.exports.deTokenizeBody = ( req, res, next ) => {
    try {
        req.body = tokenizer.verify( req.body.tok );
        delete req.body.iat;
        delete req.body.exp;
        return next();
    } catch ( err ) {
        tokenErrHandler( err, req, res, next );
    }
}