const router = require( 'express' ).Router() ;


const { multiFile } = require( "../../handlers/fileUploadHandler" );
const { softAuthorize } = require( "../../handlers/tokenHandler" );

router.post( "/add-detail", softAuthorize, require( "./controller/addDetail" ) );
// router.post( "/add-detail", softAuthorize, multiFile( [ { name: "img", maxCount: 10 } ] ) , require( "./controller/add" ) );

module.exports = router;