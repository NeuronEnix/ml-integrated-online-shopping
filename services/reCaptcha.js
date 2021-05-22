const axios = require("axios");
const { resErr, resErrType } = require("../handlers/responseHandler");

const { RE_CAPTCHA_SECRET, NODE_ENV = "dev" } = process.env;
const config = { headers: { "Content-Type": "application/x-www-form-urlencoded" } };

module.exports.verifyReCaptcha = async (req, res, next) => {

    if ( NODE_ENV != 'production' ) { delete req.body.reCaptchaToken; return next(); }
    
    try {
        const { reCaptchaToken } = req.body;

        if (!reCaptchaToken)
            return resErr(res, resErrType.reCaptchaNotSolved, {
                infoToClient: "Re Captcha Not Solved",
                infoToServer: "ReCaptcha Token Not Provided",
            });

        const reCaptchaResult = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${RE_CAPTCHA_SECRET}&response=${reCaptchaToken}&remoteip=${req.ip}`,
            {},
            config
        );

        if (reCaptchaResult.data.success === true) {
            delete req.body.reCaptchaToken;
            return next();
        }

        return resErr(res, resErrType.reCaptchaNotSolved, { infoToClient: "Re Captcha Not Solved", infoToServer: reCaptchaResult.data });
    } catch (err) {
        return next({ _AT: __filename, err });
    }
};
