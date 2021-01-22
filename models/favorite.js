const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var favoriteSchema = new Schema({
    dishes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Dish'
    }],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        unique:true
    }
})

var Favorites = mongoose.model('Favorite',favoriteSchema);

module.exports = Favorites;