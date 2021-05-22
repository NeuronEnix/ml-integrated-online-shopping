const {
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    OTP_EXPIRES_IN_MIN,
    NODE_ENV,
} = process.env;
const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const { resOk, resErr, resErrType } = require('../handlers/responseHandler');

module.exports.sendOTP = async ( contact, otp, res, next ) => {
    try {

        if ( NODE_ENV != 'production' ) return resOk( res,  { otp } );
        
        await client.messages
        .create({
            body: `Phone Verification OTP: ${otp},\nValid For: ${OTP_EXPIRES_IN_MIN} min.` ,
            from: '+14702601807',
            to: '+91' + contact
        })
        return resOk( res );
        
    } catch ( err ) {
        if ( err.status && err.code )
            return resErr( res, resErrType.twilioErr, {
                infoToClient: "Couldn't Send The SMS, Try After Sometime.", 
                infoToServer: { _AT: __filename, err: { sts: err.status, code: err.code } }
            })
        return next( { _AT: __filename, err } );
    }
}
