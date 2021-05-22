const mongoose = require( 'mongoose' );

//Fixes all deprecation warnings
const mongooseOption = {
    useNewUrlParser: true,  
    useCreateIndex: true,  
    useUnifiedTopology: true,
    autoIndex: true,  
}

// Connects to DB
const DB_URL = process.env.DB_URL || 'mongodb://127.0.0.1:27017/envision';

module.exports.connectToDatabase = () => {

    mongoose.connect( DB_URL, mongooseOption ) 
        .then  ( val => { console.log('Connected to DB' ); } )
        .catch ( err => { console.log('Not Connected to DB', err.reason, console.log( Object.keys( err )) ); } );
        
}
