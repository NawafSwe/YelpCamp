/*---------------------------- importing the packages ----------------------------*/
const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  Campground = require('./models/Campground'),
  seedDB = require('./seeds'),
  Comment = require('./models/Comment'),
  User = require('./models/User'),
  db_connection = require('./configuration/db_connection'),
  passport = require('passport'),
  localStrategy = require('passport-local'),
  passportLocalMongoose = require('passport-local-mongoose');

  
/*---------------------------- Calling the seedDB function ----------------------------*/
     seedDB();
/*---------------------------- setting up the app ----------------------------*/
app.use(express.static("public"));
app.use(cors());
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/*---------------------------- setting authentication options ----------------------------*/
/* 
secret is used to encode and decode and can be anything
*/
app.use(
  require('express-session')({
    secret: 'nawaf_ksa',
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

/* passport serialize and deserialize are response of reading the data 
from session decoded and encoded */
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = app;