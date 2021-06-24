const express = require( 'express' );
const router = express.Router();

// const validate = require( './validation' );
const { softAuthorize } = require( "../../handlers/tokenHandler" );

router.post( "/create", softAuthorize, require( "./controllers/create" ) );
router.get(  "/list",   softAuthorize, require( "./controllers/list" ) );

module.exports = router;
