const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const LeaderSchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    image:{
        type:String,
        required:true
    },
    designation:{
        type:String
    },
    abbr:{
        type:String
    },
    description:{
        type:String,
        required:true
    },
    featured:{
        type:Boolean,
        default:false
    }
})

const Leaders = mongoose.model('Leader',LeaderSchema);
 
module.exports = Leaders;