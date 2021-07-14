const Joi =  require('joi');
const { validate } = require('../../handlers/validationHandler');

module.exports.schema = schema = {
    name: Joi.string().label("Shop Name").trim().min(1).max(40).uppercase().pattern( new RegExp( '^[A-Z ]+$' ) ),
    address: Joi.string().label("Address").trim().min(1).max(40).uppercase().pattern( new RegExp( '^[A-Z a-z 0-9]+$' ) ),
    // pinCode: Joi.string().label("Pin Code").trim().min(1).max(6).uppercase().pattern( new RegExp( '[0-9]' ) ),
    color: Joi.any(),
    userID: Joi.string().label("userID").trim().min(24).max(24).alphanum(),
}


const updateShopSchema = Joi.object({
    name: schema.name.required(),
    address: schema.address.required(),
    // pinCode: schema.pinCode.required(),
    color: schema.color.required(),
});

module.exports.updateShop = ( req, res, next ) => validate( req, res, next, updateShopSchema, 'body' );
