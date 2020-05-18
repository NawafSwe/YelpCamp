const mongoose = require('mongoose');

/*---------------------------- creating Schema----------------------------*/
const campgroundSchema = new mongoose.Schema({
  name: String,
  image_url: String,
  description: String,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:'Comment'
    }
  ]
});
const Campground = mongoose.model('Campground', campgroundSchema);


module.exports = Campground;

