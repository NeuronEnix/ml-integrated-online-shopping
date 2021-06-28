const ItemModel = require( "../model" );
const { resOk, resErr, resErrType } = require('../../../handlers/responseHandler');
const mongoose = require("mongoose");


module.exports = async (req, res, next ) => {

    try {

        const { category } = req.query;
        const { shopID } = req.user;
        const regExCategory = ".*" + category.split("").join( ".*" ) + ".*" ; 
        console.log( regExCategory );
        const categoryList = await ItemModel.aggregate([
            { $match : { shopID: mongoose.Types.ObjectId( shopID ) , category : new RegExp( regExCategory ),  } },
            { $sort:{ category:1 } },
            { $limit: 10 } ,
            { $group: {
                _id: null,
                categoryList: { $addToSet: "$category" },
            }},
            { $project: { categoryList:1, _id:0 } },
        ]);
    
        return resOk( res, categoryList[ 0 ]?.categoryList || []  ) ;

    } catch( err ) {

        return next( { _AT: __filename, err } );

    }

};
