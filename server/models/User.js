/*---------------------------- importing the packages ----------------------------*/
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');


/*---------------------------- creating Schema----------------------------*/
const userSchema = mongoose.Schema({
    username: {type: String, unique: true, required: true},
    email: {type: String, unique: true, required: true},
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    password: String,
    isAdmin: {type: Boolean, default: false}
});
/* ---------------------------- adding the passport local mongoose package to the user schema ----------------------------*/
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', userSchema);


/*----------------------------Exporting the model ----------------------------*/
module.exports = User;