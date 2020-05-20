/*---------------------------- importing the packages ----------------------------*/
const       app           = require('./configuration/app_config'),
            Campground    = require('./models/Campground'),
            seedDB        = require('./seeds'),
            Comment       = require('./models/Comment'),
            User          = require('./models/User'),
            passport      = require('passport');
        

/*---------------------------- Calling the seedDB function ----------------------------*/
seedDB();

/* this is a middleware var user is to gives you if there is a user singed in or not  
and it gives you the id of him and the username and it will be passed to all the routes in the templates.*/
app.use((req, res, next) => {
  res.locals.user = req.user;
  //next will movie to the next middleware of the route;
  next();

});

/*---------------------------- testing the connection of the server ----------------------------*/
const port = 3000;
app.listen(port, () => {
  console.log(`server is running on ${port}`);
  console.log(__dirname);
});


/*---------------------------- app routes ---------------------------- */

/* this route is the '/' is the initial route where render the home page*/

app.get('/', (req, res) => {
    res.render('home');
});
 
/*  this route is the INDEX ROUTE  -- '/campgrounds' where it renders the campgrounds from the database */
app.get('/campgrounds', (req, res) => {

  
  Campground.find({}, (err, camps) => {
    if (err) console.log('error', err);
    else res.render('campgrounds/index', {camp_grounds_list: camps});
  });
});



/* this route  is the CREATE ROUTE --  to post '/campgrounds' new camp ground to the  to the data base 
    by taking the data from a form
  */

app.post('/campgrounds',(req, res) => {
  Campground.create(req.body.campground, (err, target) => {
    if (err) {
      console.log('err', err);
      
    } else {
      console.log('added\n', target);
      res.redirect('/campgrounds');
    }
   })
 });


 /* this route is the NEW ROUTE -- '/campgrounds/new' is to get the form using the convention of RESTApi naming      */
/* a function to generate an object of campground*/
app.get('/campgrounds/new', isLoggedIn,(req, res) => { 
  res.render('campgrounds/new');
});


/* this route is SHOW ROUTE -- '/campgrounds/:id'
where it shows more info about a particular campground
*/

app.get('/campgrounds/:id', (req, res) => {
  /* this is be cause we have an relation between campgrounds and comment 
  so we want all comment for a particular campground */
  Campground.findById(req.params.id)
    .populate('comments')
    .exec((err, target) => {
      if (err) console.log('something went wrong');
      else res.render('campgrounds/show', { camp: target});
    });
});

/* this route is nested route because the each campground has relation with comments -- RestFul routes*/
app.get('/campgrounds/:id/comments/new', isLoggedIn,(req, res) => {
  Campground.findById(req.params.id, (err, camp) => { 
    if (err) {
      console.log('err', err);
    } else { 
      res.render('comments/new', { camp: camp });
    }
  });
  
});

/* this route is nested route because the each campground has relation with comments -- RestFul routes where it 
    adds a comment 
*/
app.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log('err', err);
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log('err', err);
        } else {
          console.log(comment);
          campground.comments.push(comment);
          campground.save((err, comment) => {
            if (err) {
              console.log('err', err);
            } else {
              res.redirect('/campgrounds/' + req.params.id);
            }
          });
        }
      });
    }
  });
});

/* ---------------------------- Register routes ----------------------------  */

/* this route '/register' is for showing the form of the register to create new account*/
app.get('/register', (req, res) => { 
  res.render('register');
});

/* this route is post request where it post a user data to create a username in the db */
app.post('/register', (req, res) => { 
  User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
    if (err) {
      console.log('user already exist',err);
      res.render('register');
    } else {
      console.log(user);
      passport.authenticate('local')(req, res, () => {
        // if we created the account then we want to hide the login and signup links from the nav; 
        
        res.redirect('/campgrounds');
      });
      
    }
  });
});

/* Login routes GET:show form of log in 
  POST: posting the login from username and password 
 */
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', passport.authenticate('local',{
  successRedirect: '/campgrounds',
  failureRedirect:'/login'
}), (req, res) => { });


/* Logout routes */
app.get('/logout', (req, res) => { 
  req.logout();
  res.redirect('/');
});
 
/* ---------------------------- helper functions ----------------------------*/

/* isLoggedIn function is considered to be a middleware that we need in the secret route where we need to check
if the user is logged in or not */
function isLoggedIn(req, res, next) { 
    if (req.isAuthenticated()) { 
        // return next() means go next where it is the callback function in the route
        return next();
    } 
      res.redirect('/login');
    
    
}




