const express = require( 'express' );
const router = express.Router();

// const validate = require( './validation' );
const { softAuthorize } = require( "../../handlers/tokenHandler" );

router.post( "/create", softAuthorize, require( "./controllers/create" ) );

router.post( "/rate",   softAuthorize, require( "./controllers/update" ).rating );
router.post( "/cancel", softAuthorize, require( "./controllers/update" ).cancel );

router.get(  "/list",   softAuthorize, require( "./controllers/list" ) );

module.exports = router;
