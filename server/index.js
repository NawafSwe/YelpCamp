/*---------------------------- importing the packages ----------------------------*/
const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    cors = require('cors'),
    Campground = require('./models/Campground'),
    Comment = require('./models/Comment'),
    User = require('./models/User'),
    db_connection = require('./configuration/db_connection'),
    passport = require('passport'),
    localStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose');

/*---------------------------- importing the routers ----------------------------*/
const authentication_routes = require('./routes/authentication'),
    campgrounds_routes = require('./routes/campgrounds'),
    comments_route = require('./routes/comments');


/*---------------------------- setting up the app ----------------------------*/
app.use(express.static("public"));
app.use(cors());
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

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
from session decoded and encoded save and delete  */
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/*---------------------------- testing the connection of the server ----------------------------*/
const port = 3000;
app.listen(port, () => {
    console.log(`server is running on ${port}`);
    console.log(__dirname);
});

/*---------------------------- Middleware ----------------------------*/

/* this is a middleware var user is to gives you if there is a user singed in or not  
and it gives you the id of him and the username and it will be passed to all the routes in the templates.*/
app.use((req, res, next) => {
    res.locals.user = req.user;
    //next will movie to the next middleware of the route;
    next();
});

/*---------------------------- app routes ---------------------------- */

/* this route is the '/' is the initial route where render the home page*/

app.get('/', (req, res) => {
    res.render('home');
});


/* ---------------------------- using routers ---------------------------- */
app.use(authentication_routes);
app.use(campgrounds_routes);
app.use(comments_route);


/* ---------------------------- helper functions ----------------------------*/






