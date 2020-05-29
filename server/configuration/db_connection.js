/*---------------------------- setting up  the connection of the data base ----------------------------*/
const mongoose = require('mongoose');
const uri = 'mongodb://localhost/yelpcamp';
const dotenv = require('dotenv').config();
const connection = mongoose.connect(
    process.env.MONGODB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    (err, db) => {
        if (err) console.log('the error is', err);
        else console.log('successfully connected to yelp camp db');
    }
);

module.exports = connection;
