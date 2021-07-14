const Joi =  require('joi');
const { validate } = require('../../handlers/validationHandler');

module.exports.schema = schema = {
    email: Joi.string().label("Email").trim().min(11).max(50).lowercase().email().custom ( ( val, helpers ) => {
        // Allowed Email Domain: [ "gmail.com", "yahoo.com" ]
        if ( val.endsWith( '@gmail.com' ) || val.endsWith( '@yahoo.com' ) ) return val;
        return helpers.error( "custom.emailDomain" );
    }),
    phone: Joi.string().label( "Phone" ).trim().min(10).max(10).pattern( new RegExp( '^[0-9]+$')),
    pass: Joi.string().label("Password").trim().min(1).max(15).alphanum(),
    name: Joi.string().label("Full Name").trim().min(3).max(40).uppercase().pattern( new RegExp( '^[A-Z ]+$' ) ),
    shopID: Joi.string().label("Department").trim().min(24).max(24).alphanum(),
    subID: Joi.string().label("Department").trim().min(24).max(24).alphanum(),
    typ: Joi.string().label( "User Type").trim().min(1).max(1).valid( "a", "c" ),
}


const signUpSchema = Joi.object({
    email: schema.email.required(),
    pass: schema.pass.required(),
    name: schema.name.required(),
});

const signInSchema = Joi.object({
    email: schema.email.required(),
    pass: schema.pass.required(),
});

module.exports.signUp = ( req, res, next ) => validate( req, res, next, signUpSchema, 'body' );
module.exports.signIn = ( req, res, next ) => validate( req, res, next, signInSchema, 'body' );
