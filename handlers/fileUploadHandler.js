var multer  = require('multer')
var upload = multer({ dest: 'public/item/' })

module.exports.singleFile = ( dest, fieldname ) => multer({ dest }).single( fieldname );
module.exports.multiFile = ( fields ) => { return upload.fields( fields ); }