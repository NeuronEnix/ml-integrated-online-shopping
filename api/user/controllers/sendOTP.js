const moment = require('moment');
const UserModel = require('../model');

const { OTP_EXPIRES_IN_MIN } = process.env;
const { resOk, resErr, resErrType } = require('../../../handlers/responseHandler');
const { sendOTP } = require('../../../services/sendOTP');

module.exports = async ( req, res, next ) => {
    try {
        const { userID } = req.user;
        const { contact } = req.body;
        const userDoc = await UserModel.findOne( { _id: userID, otpVerified: false }, { _id:1, otpResendCount:1, otpCreAt:1 } );

        if ( !userDoc )
            return resErr( res, resErrType.unAuthorized, { infoToClient: "Contact Number Already Verified" } );

        if ( userDoc.otpCreAt && moment() < moment(userDoc.otpCreAt).add( OTP_EXPIRES_IN_MIN, "minutes" ) )
            return resErr( res, resErrType.unAuthorized, {
                infoToClient: `You Can Re-Send OTP At An Interval of ${OTP_EXPIRES_IN_MIN} minutes`
            } );

        if ( userDoc.otpResendCount <= 0 )
            return resErr( res, resErrType.unAuthorized, { infoToClient: "You Have Exhausted Your MAX OTP RESEND" } );

        userDoc.otp = Math.floor( ( Math.random() * 852147 ) + 147852);
        userDoc.otpCreAt = Date.now();
        userDoc.contact = contact;
        userDoc.otpResendCount -= 1;
        await userDoc.save();

        return sendOTP( userDoc.contact, userDoc.otp, res, next );

    } catch ( err ) {
        return next( { _AT: __filename, err } );
    }
}
