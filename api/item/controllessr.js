const { resOk, resErr, resErrType } = require( "../../handlers/responseHandler" );
const fs = require("fs");

module.exports.addItem = async (req, res) => {
    // console.log( req.body );
    // return ;
    const itemData = { ...req.body, ...{ user_id: req.UserID } };
    console.log( { itemData })
    if( !req.files )
        return resErr( res, { err: resErrType.notAllowed, info: "Supports only .png images"} );
    return resOk( res );
};

module.exports.getImgLink = async (req, res) => {
    const itemName = req.query.name;
    const imgPath = __dirname + "\\img\\" + itemName + ".png";

    if (fs.existsSync(imgPath)) return respond.ok(res, `${req.connection.localAddress}:${req.connection.localPort}/item/img/${itemName}.png`);
    return respond.err(res, { err: respond.errData.resNotFound });
};
