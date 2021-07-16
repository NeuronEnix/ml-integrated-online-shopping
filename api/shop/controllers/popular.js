const RateModel = require("../../order/rate.model");
const mongoose = require("mongoose");
const ShopModel = require("../model");
const ItemModel = require("../../item/model");

const { resOk, resErr, resErrType } = require("../../../handlers/responseHandler");

module.exports = async (req, res, next) => {
    try {
        const { userID, shopID } = req.user;
        const rateDocList = await RateModel.aggregate([
            { $match: { shopID: mongoose.Types.ObjectId(shopID) } },
            {
                $group: {
                    _id: "$itemID",
                    avgRate: { $avg: "$rate" },
                },
            },
            { $sort: { avgRate: -1 } },
            { $project: { itemID: "$_id", avgRate: 1, _id: 0 } },
        ]);

        const itemDocList = await ItemModel.aggregate([
            { $match: { shopID: mongoose.Types.ObjectId(shopID) } },
            { $sample: { size: 10 } },
            { $addFields: { avgRate: 0 } },
            { $project: { itemID: "$_id", avgRate: 1, _id: 0 } },
        ]);
        if (rateDocList.length < 5)
            for (eachItem of itemDocList) if (!rateDocList.find((item) => String(eachItem.itemID) == String(item.itemID))) rateDocList.push(eachItem);

        const onSale = (await ShopModel.findById(shopID).lean()).onSale;

        const popularList = [];

        for (rateDoc of rateDocList) {
            popularList.push({
                itemID: rateDoc.itemID,
                rate: rateDoc.avgRate,
                offer: onSale.find((eachOffer) => String(eachOffer.itemID) == String(rateDoc.itemID))?.offer || 0,
                itemObj: await ItemModel.findById(rateDoc.itemID, { _id: 0, __v: 0 }),
            });
        }

        return resOk(res, popularList.slice(0, popularList.length < 10 ? popularList.length : 10));
    } catch (err) {
        return next({ _AT: __filename, err });
    }
};
