const express = require( 'express' );
const router = express.Router();

const validate = require( './validation' );
const { softAuthorize } = require( "../../handlers/tokenHandler" );

router.post( '/update', express.json(), validate.updateShop, softAuthorize, require( './controllers/updateShop' ) );

router.post( '/apply-offer', softAuthorize, require( "./controllers/offer.js").applyOffer );
router.get(  '/list-offer',  softAuthorize, require( "./controllers/offer.js").listOffer  );

module.exports = router;
