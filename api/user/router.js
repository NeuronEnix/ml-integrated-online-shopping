const express = require( 'express' );
const router = express.Router();

const validate = require( './validation' );
const { softAuthorize } = require( "../../handlers/tokenHandler" );

router.post( '/sign-up/:id', express.json(), validate.signUp, require( './controllers/signUp' ) );
router.post( '/sign-in', express.json(), validate.signIn, require( './controllers/signIn' ) );

router.post( "/cart", express.json(), softAuthorize, require( "./controllers/cart").update );
router.get(  "/cart", express.json(), softAuthorize, require( "./controllers/cart").view );

module.exports = router;
