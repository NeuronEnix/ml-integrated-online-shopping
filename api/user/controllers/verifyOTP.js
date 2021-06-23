const moment = require('moment');
const UserModel = require('../model');

const { OTP_EXPIRES_IN_MIN } = process.env;
const { resOk, resErr, resErrType } = require('../../../handlers/responseHandler');

module.exports = async ( req, res, next ) => {
    try {
        const { userID } = req.user;
        const { otp } = req.body;
        const userDoc = await UserModel.findOne( { _id: userID, otpVerified: false }, { _id:1, otp:1, otpCreAt:1 } );

        if ( !userDoc )
            return resErr( res, resErrType.unAuthorized, { infoToClient: "Contact Number Already Verified" } );
        
        const otpExpAt = moment( userDoc.otpCreAt ).add( OTP_EXPIRES_IN_MIN, "minutes" );
        if ( userDoc.otp != otp || moment() > otpExpAt ) 
            return resErr( res, resErrType.invalidCred, {
                infoToClient: "OTP Invalid Or Expired",
                infoToServer: { type: "otp", providedOTP: otp, expectedOTP: userDoc.otp,
                    otpCreAt: userDoc.otpCreAt, otpExpAt:otpExpAt.toISOString()
                }
            } );
        
        userDoc.otpVerifiedAt = Date.now();
        userDoc.otpVerified = true;
        await userDoc.save();

        return resOk( res );

    } catch ( err ) {
        return next( { _AT: __filename, err } );
    }
}
