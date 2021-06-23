const mongoose = require( 'mongoose' );
// const { defaultAdminData } = require('../../meta').user;

const { MAX_OTP_RESEND_COUNT } = process.env;

const userSchema = new mongoose.Schema ({

    // Data
    email: { type: String, min:1, lowercase: true,required: true },
    pass: { type: String, min:1, required: true },
    name: { type: String, uppercase: true },
    gender: { type: String, uppercase: true,},
    usn: { type: String, uppercase: true, },
    
    contact: { type: String, },
    otp: { type: Number },
    otpCreAt: { type: Date },
    otpVerifiedAt: { type: Date },
    otpVerified: { type: Boolean, default: false },
    otpResendCount: { type: Number, default: MAX_OTP_RESEND_COUNT || 5 },
    
    // Meta
    typ: { type: String, default: "s" }, // 's'->student; 'o'->organizer; 'a'->admin;
    sts: { type: String, default: 'e' },  // 'e' -> enabled ; 'd' -> disabled

    
    // Trackers
    creAt: { type: Date, default: Date.now },
});

userSchema.index( { email:1 }, { unique: true } );

const UserModel = mongoose.model( 'users', userSchema ) ;
module.exports = UserModel;


// async function createAdminIfUserCollectionIsEmpty() {
//     try {
//         console.log( "Check :: Existence of users")
//         if ( await UserModel.estimatedDocumentCount() == 0 ) {
            
//             if ( !defaultAdminData.email || !defaultAdminData.pass )
//             return console.log( "Check :: Could not Create Admin, defaultAdmin Email not provided" );
//             const defaultAdminDoc = new UserModel();
//             Object.assign( defaultAdminDoc, defaultAdminData );
//             await defaultAdminDoc.save();
//             console.log( "Check :: User Collection is empty: Admin Created!" );
//         }
//         console.log( "Check :: Users Exist")
//     } catch ( err ) {
//         console.log( "Check :: Couldn't Create Admin", err )
//     }
// }
// createAdminIfUserCollectionIsEmpty();