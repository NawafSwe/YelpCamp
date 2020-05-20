/*---------------------------- importing the packages ----------------------------*/
const mongoose = require('mongoose');


/*---------------------------- creating Schema----------------------------*/
const commentSchema = mongoose.Schema({
  author: String,
  text: String
});
const Comment = mongoose.model('Comment', commentSchema);

/*----------------------------Exporting the model ----------------------------*/
module.exports = Comment;