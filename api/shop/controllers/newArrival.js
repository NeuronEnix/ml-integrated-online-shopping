const RateModel = require("../../order/rate.model");
const mongoose = require("mongoose");
const ShopModel = require("../model");
const ItemModel = require("../../item/model");

const { resOk, resErr, resErrType } = require("../../../handlers/responseHandler");

module.exports = async (req, res, next) => {
    try {
        const { userID, shopID } = req.user;

        const itemDocList = await ItemModel.aggregate([
            { $match: { shopID: mongoose.Types.ObjectId(shopID) } },
            { $sort: { _id: -1 } },
            { $project: { _id: 1 } },
        ]);

        const onSale = (await ShopModel.findById(shopID).lean()).onSale;

        const newArrivalList = [];

        for (itemDoc of itemDocList) {
            newArrivalList.push({
                itemID: itemDoc._id,
                rate: await RateModel.getAvgRating(itemDoc._id),
                offer: onSale.find((eachOffer) => String(eachOffer.itemID) == String(itemDoc._id))?.offer || 0,
                itemObj: await ItemModel.findById(itemDoc._id, { _id: 0, __v: 0 }),
            });
        }

        return resOk(res, newArrivalList.slice(0, newArrivalList.length < 10 ? newArrivalList.length : 10));
    } catch (err) {
        return next({ _AT: __filename, err });
    }
};
