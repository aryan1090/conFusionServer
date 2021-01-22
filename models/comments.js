const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const commentSchema = new Schema({
    rating:{
        type:Number,
        max:5,
        min:1,
        required:true
    },
    comment:{
        type:String,
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    dish:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Dish'
    }
},{
    timestamps:true
});

var Comments = mongoose.model('Comment',commentSchema);

module.exports = Comments;