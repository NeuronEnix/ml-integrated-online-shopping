const { resErr, resErrType } = require('./responseHandler');

module.exports.validate = ( req, res, next, joiSchema, reqKey ) => {
    
    joiSchema.validateAsync( req[ reqKey ] )
        .then( val => { req[ reqKey ] = val; next(); } )
        .catch( err => {
            return resErr( res, resErrType.validationErr, {
                infoToClient: `Invalid ${err.details[0].context.label}`,
                infoToServer: {
                    type: err.details[0].type,
                    value: err.details[0].context.value,
                    key: err.details[0].context.key,
                }
            } );
        } )
        .catch( err => resErr( res, resErrType.unknownErr, { infoToServer: { _AT: `${__filename}; ( 3nd catch )`, err } } ) )        
        
}