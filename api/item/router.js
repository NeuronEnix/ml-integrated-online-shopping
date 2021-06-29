const router = require( 'express' ).Router() ;

const { multiFile } = require( "../../handlers/fileUploadHandler" );
const { softAuthorize } = require( "../../handlers/tokenHandler" );

router.post( "/add-detail", softAuthorize, require( "./controller/addDetail" ) );
router.post( "/add-image",  softAuthorize, multiFile( [ { name: "img", maxCount: 10 } ] ) , require( "./controller/addImage" ) );

router.post( "/delete", softAuthorize, require( "./controller/deleteItem") );


router.get( "/detail", softAuthorize, require( "./controller/getDetail" )  );
router.get( "/search", softAuthorize, require( "./controller/itemSearch" ) );
router.get( "/item-autoComplete", softAuthorize, require( "./controller/itemAutoComplete" ) );
router.get( "/category-autoComplete", softAuthorize, require( "./controller/categoryAutoComplete" ) );

module.exports = router;
