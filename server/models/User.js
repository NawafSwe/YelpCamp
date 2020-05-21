/*---------------------------- importing the packages ----------------------------*/
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');


/*---------------------------- creating Schema----------------------------*/
const userSchema = mongoose.Schema({
    username: String,
    password: String
});
/* ---------------------------- adding the passport local mongoose package to the user schema ----------------------------*/
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', userSchema);


/*----------------------------Exporting the model ----------------------------*/
module.exports = User;