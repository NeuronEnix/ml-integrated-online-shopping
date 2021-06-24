var multer  = require('multer')
var upload = multer({ dest: 'img/' })

module.exports.singleFile = ( fieldname ) => { return upload.single( fieldname ); }
module.exports.multiFile = ( fields ) => { return upload.fields( fields ); }