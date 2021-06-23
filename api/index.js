const router = require( "express" ).Router();

router.use( "/user", require('./user/router') );

router.use( "/shop", require('./shop/router') );

router.use( "/item", require('./item/router') );

module.exports = router;
