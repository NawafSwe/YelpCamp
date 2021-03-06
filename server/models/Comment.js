/*---------------------------- importing the packages ----------------------------*/
const mongoose = require('mongoose');


/*---------------------------- creating Schema----------------------------*/
const commentSchema = mongoose.Schema({
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    text: String,
    createdAt: {type: Date, default: Date.now}
});
const Comment = mongoose.model('Comment', commentSchema);

/*----------------------------Exporting the model ----------------------------*/
module.exports = Comment;