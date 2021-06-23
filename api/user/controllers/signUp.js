const bcrypt = require('bcrypt');
const UserModel = require('../model');

const { resOk, resErr, resErrType } = require('../../../handlers/responseHandler');

module.exports = async ( req, res, next ) => {
    try {
        console.time( "pass" );
        req.body.pass = bcrypt.hashSync( req.body.pass, 12 );
        console.timeEnd( "pass" );
        const userDoc = new UserModel();
        Object.assign( userDoc, req.body );
        await userDoc.save();
        return resOk( res );
        
    } catch ( err ) {
        if ( err.code === 11000 )
            return resErr( res, resErrType.duplicateErr, { infoToClient: 'Email Already Registered' } );
        return next( { _AT: __filename, err } );
    }
}
