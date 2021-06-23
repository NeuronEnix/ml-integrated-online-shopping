const express = require( 'express' );
const router = express.Router();

const validate = require( './validation' );
const { softAuthorize } = require( "../../handlers/tokenHandler" );

router.post( '/update', express.json(), validate.updateShop, softAuthorize, require( './controllers/updateShop' ) );

module.exports = router;
