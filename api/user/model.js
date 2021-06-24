const mongoose = require( 'mongoose' );

const userSchema = new mongoose.Schema ({

    // Data
    email: { type: String, min:1, lowercase: true,required: true },
    pass: { type: String, min:1, required: true },
    name: { type: String, uppercase: true },
    shopID: { type: mongoose.Schema.Types.ObjectId, required: true },

    // Meta
    typ: { type: String, default: "s" }, // 'c'->customer; 'a'->admin;
    sts: { type: String, default: 'e' },  // 'e'->enabled ; 'd'->disabled;

});

userSchema.index( { shopID:1, email:1 }, { unique: true } );

const UserModel = mongoose.model( 'users', userSchema ) ;
module.exports = UserModel;
