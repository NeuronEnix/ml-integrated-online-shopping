const OrderModel = require("../model");
const UserModel = require("../../user/model");
const ShopModel = require("../../shop/model");
const ItemModel = require("../../item/model");

const { stripeCheckout } = require("../../../services/stripeCheckout");
const { resOk, resErr, resErrType } = require("../../../handlers/responseHandler");

module.exports = async (req, res, next) => {
    try {
        const { userID, shopID } = req.user;

        const userDoc = await UserModel.findById(userID).lean();
        const cart = userDoc.cart;
        const shopDoc = await ShopModel.findById(shopID).lean();

        let totPrice = 0;
        const itemDocList = [];
        for (item of cart) {
            item.shopID = shopID;
            item.userID = userID;
            itemDoc = await ItemModel.findById(item.itemID);
            item.price = itemDoc.subDetail.find((sub) => String(item.subID) == String(sub._id)).price;
            item.offer = shopDoc.onSale.find((offerItem) => String(offerItem.itemID) == String(item.itemID))?.offer || 0;

            totPrice += parseInt(item.price) * parseInt(item.qty);
            for (eachSubDetail of itemDoc.subDetail) {
                eachSubDetail.stock = parseInt(eachSubDetail.stock) - parseInt(item.qty);

                if (eachSubDetail.stock < 0)
                    return resErr(res, resErrType.resNotFound, {
                        infoToClient: `Requesting quantity of ${itemDoc.name} is more than the available stock`,
                    });
            }

            itemDocList.push(itemDoc);
        }

        for (eachItemDoc of itemDocList) await eachItemDoc.save();

        // Payment
        const { stripeToken } = req.body;
        const userMetadata = { userID: req.user.userID };
        const stripeResult = await stripeCheckout(stripeToken, totPrice, userDoc.email, "1234567890", userDoc.name, userMetadata);

        if (stripeResult.status !== "succeeded")
            return resErr(res, resErrType.stripeError, {
                infoToClient: "Payment Failed: " + stripeResult.msg,
                infoToServer: stripeResult,
            });

        for (item of cart) {
            const orderDoc = await OrderModel();
            Object.assign(orderDoc, item);
            await orderDoc.save();
        }

        return resOk(res, stripeResult);
        // return resOk( res );
    } catch (err) {
        return next({ _AT: __filename, err });
    }
};
