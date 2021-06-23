const Joi =  require('joi');
const { validate } = require('../../handlers/validationHandler');

module.exports.schema = schema = {
    email: Joi.string().label("Email").trim().min(11).max(50).lowercase().email().custom ( ( val, helpers ) => {
        // Allowed Email Domain: [ "gmail.com", "yahoo.com" ]
        if ( val.endsWith( '@gmail.com' ) || val.endsWith( '@yahoo.com' ) ) return val;
        return helpers.error( "custom.emailDomain" );
    }),
    pass: Joi.string().label("Password").trim().min(8).max(15).alphanum(),
    name: Joi.string().label("Full Name").trim().min(3).max(40).uppercase().pattern( new RegExp( '^[A-Z ]+$' ) ),
    contact: Joi.string().label("Contact").trim().min(10).max(10).pattern( new RegExp( '^[1-9][0-9]{9,9}$' ) ),
    otp: Joi.number().label("OTP").integer().positive().min(147852).max(999999),
    gender: Joi.string().label("Gender").trim().min(1).max(1).uppercase().valid( 'M', 'F' ),
    usn: Joi.string().label("USN").trim().min(10).max(10).uppercase().alphanum().pattern( new RegExp( '^[1-9][A-Z][A-Z][12][0-9][A-Z][A-Z][0-9]{3,3}$' ) ),
}


const signUpSchema = Joi.object({
    email: schema.email.required(),
    pass: schema.pass.required(),
    name: schema.name.required(),
    gender: schema.gender.required(),
    usn: schema.usn.required(),
});

const signInSchema = Joi.object({
    email: schema.email.required(),
    pass: schema.pass.required(),
});

const tokenRegExp = new RegExp( "^[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+$" );

const verifyEmailSchema = Joi.object({
    tok : Joi.string().label( "Email Verification Token").trim().min(230).max(400).pattern( tokenRegExp ).required()
})

const sendOTP = Joi.object({
    contact: schema.contact.required(),
})

const verifyOTP = Joi.object({
    otp: schema.otp.required(),
})


module.exports.signUp = ( req, res, next ) => validate( req, res, next, signUpSchema, 'body' );
module.exports.signIn = ( req, res, next ) => validate( req, res, next, signInSchema, 'body' );

module.exports.verifyEmail = ( req, res, next ) => validate( req, res, next, verifyEmailSchema, 'body' );

module.exports.sendOTP = ( req, res, next ) => validate( req, res, next, sendOTP, 'body' );
module.exports.verifyOTP = ( req, res, next ) => validate( req, res, next, verifyOTP, 'body' );

module.exports.vipCheckout = ( req, res, next ) => validate( req, res, next, vipCheckout, 'body');
