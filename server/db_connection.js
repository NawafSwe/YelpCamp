/*---------------------------- setting up  the connection of the data base ----------------------------*/
const mongoose = require('mongoose');
const uri = 'mongodb://localhost/yelpcamp';
const connection = mongoose.connect(
  uri,
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
