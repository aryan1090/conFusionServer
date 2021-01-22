var mongoose = require('mongoose');
const Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    firstname:{
        type:String,
        default:''
    },
    lastname:{
        type:String,
        default:''
    },
    admin:{
        type:Boolean,
        default:false
    },
    facebookId:{
        type:String
    }
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',User);