const ItemModel = require("../model");
const ShopModel = require("../../shop/model");
const { resOk, resErr, resErrType } = require("../../../handlers/responseHandler");
const mongoose = require("mongoose");
const RateModel = require("../../order/rate.model");

module.exports = async (req, res, next) => {
    try {
        const { itemName } = req.query;
        const { shopID } = req.user;
        const regExItemName = ".*" + itemName.split("").join(".*") + ".*";

        console.log(regExItemName);

        const catCount = await ItemModel.count({ category: itemName });

        
        const itemList = await ItemModel.aggregate([
            { $match: { shopID: mongoose.Types.ObjectId(shopID), name: new RegExp(regExItemName) } },
            { $sort: { name: 1 } },
            {
                $project: {
                    name: 1,
                    itemID: "$_id",
                    img: 1,
                    category:1,
                    _id: 0,
                },
            },
        ]);

        const itemListByCategory = await ItemModel.aggregate([
            { $match: { shopID: mongoose.Types.ObjectId(shopID), category: new RegExp(regExItemName) } },
            { $sort: { name: 1 } },
            {
                $project: {
                    name: 1,
                    itemID: "$_id",
                    img: 1,
                    category:1,
                    _id: 0,
                },
            },
        ]);

        for (eachItem of itemListByCategory) if (!itemList.find((item) => String(eachItem.itemID) == String(item.itemID))) itemList.push(eachItem);

        if ( catCount > 0 )
            for ( let ind = 0; ind < itemList.length; ++ind )
                if ( itemList[ ind ].category != itemName ) {
                    itemList.splice( ind, 1 );
                    ind--;
                }

        const onSale = (await ShopModel.findById(shopID).lean()).onSale;

        for (item of itemList) {
            item.price = (await ItemModel.findById(item.itemID)).subDetail[0].price;
            item.itemObj = await ItemModel.findById(item.itemID, { rateSum: 0, rateCount: 0, __v: 0 });
            item.offer = onSale.find((eachOffer) => String(eachOffer.itemID) == String(item.itemID))?.offer || 0;
            item.rate = await RateModel.getAvgRating( item.itemID );
        }

        return resOk(res, { itemList, onSale: (await ShopModel.findById(shopID)).onSale });
    } catch (err) {
        return next({ _AT: __filename, err });
    }
};
