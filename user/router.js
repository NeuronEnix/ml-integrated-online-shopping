const express = require( 'express' );
const router = express.Router();

const { verifyReCaptcha } = require( "../../services/reCaptcha" );
const { sendVerificationEmail, tokenizeBody, deTokenizeBody  } = require( "../../services/verifyEmail");
const { softAuthorize } = require( '../../handlers/tokenHandler')

const validate = require( './validation' );

router.post( '/sign-up', express.json(), verifyReCaptcha, validate.signUp, require( './controllers/checkIfEmailExist' ), tokenizeBody, sendVerificationEmail );
router.post( '/sign-in', express.json(), verifyReCaptcha, validate.signIn, require( './controllers/signIn' ) );

router.post( '/verify-email', express.json(), verifyReCaptcha, validate.verifyEmail, deTokenizeBody, validate.signUp, require( './controllers/signUp' ) );

router.post( '/send-otp',   express.json(), verifyReCaptcha, validate.sendOTP,   softAuthorize, require( './controllers/sendOTP' ) );
router.post( '/verify-otp', express.json(), verifyReCaptcha, validate.verifyOTP, softAuthorize, require( './controllers/verifyOTP' ) );

module.exports = router;
