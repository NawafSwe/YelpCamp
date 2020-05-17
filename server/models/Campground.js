const mongoose = require('mongoose');
const campgroundSchema = new mongoose.Schema({
  name: String,
  image_url: String,
  description: String
});
const Campground = mongoose.model('campground', campgroundSchema);

module.exports = Campground;
