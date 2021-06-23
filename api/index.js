const router = require( "express" ).Router();

router.use( "/user", require('./user/router') );
router.use( "/item", require('./item/router') );


module.exports = router;
