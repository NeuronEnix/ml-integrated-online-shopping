const mongoose = require("mongoose");

const ShopModel = require("../model");
const ItemModel = require("../../item/model");
const RateModel = require("../../order/rate.model");

const { resOk, resErr, resErrType } = require("../../../handlers/responseHandler");

module.exports.applyOffer = async (req, res, next) => {
    try {
        const shopDoc = await ShopModel.findById(req.user.shopID);

        if (!shopDoc) return resErr(res, resErrType.resNotFound, { infoToClient: "Shop Not Found" });

        shopDoc.onSale = req.body;

        await shopDoc.save();
        return resOk(res);
    } catch (err) {
        return next({ _AT: __filename, err });
    }
};

module.exports.listOffer = async (req, res, next) => {
    try {
        const shopDoc = await ShopModel.findById(req.user.shopID);
        if (!shopDoc) return resErr(res, resErrType.resNotFound, { infoToClient: "Shop Not Found" });
        const onSaleItems = [];

        for (item of shopDoc.onSale) {
            const curItem = await ItemModel.findOne({ _id: item.itemID });
            onSaleItems.push({
                itemID: item.itemID,
                offer: item.offer,
                itemObj: curItem,
                rate: await RateModel.getAvgRating(item.itemID),
            });
        }

        return resOk(res, onSaleItems.slice(0, onSaleItems.length < 10 ? onSaleItems.length : 10));
    } catch (err) {
        return next({ _AT: __filename, err });
    }
};
