const mongoose =  require( "mongoose" );

const tokenSchema = new mongoose.Schema({
    iat: { type: Date, default: Date.now }, //issued at
    typ: String,
    userID: { type: mongoose.SchemaTypes.ObjectId, required:true, index:true },
    shopID: { type: mongoose.SchemaTypes.ObjectId, required:true, index:true },
    creAt: { type: Date, default: Date.now },
}) ;


tokenSchema.methods.concurrentSignInLimiter = function ( maxConcurrentSignInCount ) {
    TokenModel.find({userID:this.userID}).skip( maxConcurrentSignInCount ).sort( {iat:-1} )
        .then( docs => docs.forEach( doc => doc.delete() ) )
        .catch( err => console.log( "Check :: concurrentSignInLimiter() Failed", err  ))
}
        
const TokenModel = mongoose.model( "tokens", tokenSchema );
module.exports = TokenModel;
