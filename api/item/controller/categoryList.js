const ItemModel = require( "../model" );
const { resOk, resErr, resErrType } = require('../../../handlers/responseHandler');
const mongoose = require("mongoose");


module.exports = async (req, res, next ) => {

    try {

        const { shopID } = req.user;
        const categoryList = []

        const categoryNameList = (await ItemModel.aggregate([
            { $match : { shopID: mongoose.Types.ObjectId( shopID ) } },
            { $sort:{ category:1 } },
            { $group: {
                _id: null,
                categoryNameList: { $addToSet: "$category" },
            }},
            { $project: { categoryNameList:1, _id:0 } },
        ]))[0].categoryNameList;

        for ( eachCatName of categoryNameList ) 
            categoryList.push({
                name: eachCatName,
                img: (await ItemModel.aggregate([
                    { $match : { shopID: mongoose.Types.ObjectId( shopID ), category: eachCatName } },
                    { $sample:{ size:1 } },
                    { $project: { img: 1, _id:0 } },
                ]))[0].img[0],
            })

        return resOk( res, categoryList ) ;

    } catch( err ) {

        return next( { _AT: __filename, err } );

    }

};
