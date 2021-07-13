const ItemModel = require( "../model" );
const RateModel = require( "../../order/rate.model" );
const ShopModel = require( "../../shop/model" );

const { resOk, resErr, resErrType } = require('../../../handlers/responseHandler');


module.exports = async (req, res, next ) => {

    try {

        const { itemID } = req.query;
        const { shopID } = req.user;

        const itemDoc = await ItemModel.findOne( { _id: itemID, shopID }, { __v: 0, _id: 0, rateSum:0, rateCount:0  } ).lean();

        if ( !itemDoc )
            return resErr( res, resErrType.resNotFound, { infoToClient: "Item You are looking for is not available." } );

        const onSale = (await ShopModel.findById( shopID ).lean()).onSale;
        
        return resOk( res, {
            ...itemDoc,
            rate: await RateModel.getAvgRating( itemID ),
            offer: onSale.find( eachOffer => String( eachOffer.itemID ) == String( itemID )  )?.offer || 0,
        } );

    } catch( err ) {

        return next( { _AT: __filename, err } );

    }

};
