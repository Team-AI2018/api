const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


const reviewsSchema = new Schema({
    author: String,
    review: String,
    rating: Number,
    restId: String,
    
  });

const Reviews = mongoose.model('Review', reviewsSchema);


module.exports = Reviews;