/* ----------------------------  importing packages ---------------------------- */
const  express = require('express'),
       router = express.Router();
       
/* router is used to route express into index.js file */

/* ---------------------------- Authentication routes ----------------------------  */

/* this route '/register' is for showing the form of the register to create new account*/
router.get('/register', (req, res) => {
  res.render('register');
});

/* this route is post request where it post a user data to create a username in the db */
router.post('/register', (req, res) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        console.log('user already exist', err);
        res.render('register');
      } else {
        console.log(user);
        passport.authenticate('local')(req, res, () => {
          // if we created the account then we want to hide the login and signup links from the nav;

          res.redirect('/campgrounds');
        });
      }
    }
  );
});

/* Login routes GET:show form of log in 
  POST: posting the login from username and password 
 */
router.get('/login', (req, res) => {
  res.render('login');
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
  }),
  (req, res) => {}
);

/* Logout routes */
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

/* isLoggedIn function is considered to be a middleware that we need in the secret route where we need to check
if the user is logged in or not */
function isLoggedIn(req, res, next) { 
    if (req.isAuthenticated()) { 
        // return next() means go next where it is the callback function in the route
        return next();
    } 
      res.redirect('/login');
    
    
}
module.exports = router;