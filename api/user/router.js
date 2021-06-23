const express = require( 'express' );
const router = express.Router();

const validate = require( './validation' );

router.post( '/sign-up/:id', express.json(), validate.signUp, require( './controllers/signUp' ) );
router.post( '/sign-in', express.json(), validate.signIn, require( './controllers/signIn' ) );

module.exports = router;
