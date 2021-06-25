const express = require( 'express' );
const router = express.Router();

const validate = require( './validation' );
const { softAuthorize } = require( "../../handlers/tokenHandler" );
const { singleFile } = require( "../../handlers/fileUploadHandler" );

router.post( '/update', express.json(), validate.updateShop, softAuthorize, require( './controllers/updateShop' ) );

router.post( '/apply-offer', softAuthorize, require( "./controllers/offer.js").applyOffer );
router.get(  '/list-offer',  softAuthorize, require( "./controllers/offer.js").listOffer  );

router.post( "/banner" , softAuthorize, singleFile( "public/banner/", "img" ) , require( "./controllers/banner" ).addBanner );
router.get(  "/banner" , softAuthorize, require( "./controllers/banner" ).listBanner );

module.exports = router;
