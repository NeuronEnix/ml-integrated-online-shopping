const util = require( "util" );
let reqID = 0;

module.exports.reqLogger = async ( req, res, next ) => {

    res._log = {
        id: ++reqID,
        ts: Date.now() // timestamp
    }

    console.log( 
        "\n\nRequest:",  util.inspect( {
            url: req.url,
            method: req.method,
            ip: req.ip,
            id: res._log.id,
            at: new Date().toLocaleString(),
            query: req.query,
            body: req.body,
        }, { depth:null, colors:true }  )
        
    );
    
    if ( next ) return next();
}
