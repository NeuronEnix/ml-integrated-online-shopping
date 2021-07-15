const RateModel = require("../../order/rate.model");
const mongoose = require("mongoose");
const ShopModel = require("../model");
const ItemModel = require("../../item/model");

const { resOk, resErr, resErrType } = require("../../../handlers/responseHandler");

const recommend = require("collaborative-filter");
module.exports = async (req, res, next) => {
    try {
        const { userID, shopID } = req.user;
        const userRateDoc = await RateModel.findOne({ userID }).lean();

        if (userRateDoc) {
            const rateDocList = await RateModel.find({ shopID }, { userID: 1, itemID: 1, rate: 1, _id: 0 }).lean();

            const userItemObj = {};
            const userIndObj = {};
            const itemSet = new Set();
            let curInd = 0;

            for (eachDoc of rateDocList) {
                const userID = String(eachDoc.userID);
                const itemID = String(eachDoc.itemID);
                const rate = eachDoc.rate;

                try {
                    userItemObj[userID][itemID] = rate;
                } catch (err) {
                    userIndObj[userID] = curInd++;
                    userItemObj[userID] = {};
                    userItemObj[userID][itemID] = rate;
                } finally {
                    itemSet.add(itemID);
                }
            }
            const itemIDList = [...itemSet];
            const userItemSparse = [];
            for (const [userID, userInd] of Object.entries(userIndObj)) {
                userItemSparse.push([]);
                for (item of itemIDList) {
                    const curUserRating = userItemObj[userID][item];
                    if (curUserRating == undefined || curUserRating <= 2) userItemSparse[userInd].push(0);
                    else userItemSparse[userInd].push(1);
                }
            }
            console.log(userItemSparse);
            console.log(userIndObj);
            console.log(userItemObj);

            const recommendedItemIndexList = recommend.cFilter(userItemSparse, userIndObj[userID]);
            console.log(recommendedItemIndexList);

            if (recommendedItemIndexList.length == 0 || recommendedItemIndexList[0] == -1) return resOk(res, []);

            const onSale = (await ShopModel.findById(shopID).lean()).onSale;

            const recommendList = [];

            for (recInd of recommendedItemIndexList) {
                recommendList.push({
                    itemID: itemIDList[recInd],
                    rate: (
                        await RateModel.aggregate([
                            { $match: { shopID: mongoose.Types.ObjectId(shopID), itemID: mongoose.Types.ObjectId(itemIDList[recInd]) } },
                            {
                                $group: {
                                    _id: null,
                                    avgRate: { $avg: "$rate" },
                                },
                            },
                            { $project: { avgRate: 1, _id: 0 } },
                        ])
                    )[0].avgRate,
                    offer: onSale.find((eachOffer) => String(eachOffer.itemID) == String(itemIDList[recInd]))?.offer || 0,
                    itemObj: await ItemModel.findById(itemIDList[recInd], { _id: 0, __v: 0 }),
                });
            }

            return resOk(res, recommendList.slice(0, recommendList.length < 10 ? recommendList.length : 10));
        }

        return resOk(res, []);
    } catch (err) {
        return next({ _AT: __filename, err });
    }
};
