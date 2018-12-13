const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


const restaurantSchema = new Schema({
    name: String,
    location: String,
    description: String,
    foodType: String,
    avgPrice: Number,
    rating: Number,
    reviews: [{type: Schema.Types.ObjectId, ref: 'Review'}],
    owner: {type: Schema.Types.ObjectId, ref: 'User'}
  });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);


module.exports = Restaurant;