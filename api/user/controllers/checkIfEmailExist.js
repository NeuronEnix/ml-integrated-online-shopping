const UserModel = require('../model');

const { resErr, resErrType } = require('../../../handlers/responseHandler');

module.exports = async ( req, res, next ) => {
    const { email } = req.body;
    try {

        if ( await UserModel.exists( { email } ) )
            return resErr( res, resErrType.duplicateErr, { infoToClient: "Email Already Registered" } );

        return next();

    } catch ( err ) {
        return next( { _AT: __filename, err } );
    }
}
