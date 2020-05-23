/* ----------------------------  importing packages ---------------------------- */
const express = require('express'),
    router = express.Router(),
    User = require('../models/User'),
    passport = require('passport');

/* router is used to route express into index.js file */

/* ---------------------------- Authentication routes ----------------------------  */

/* this route '/register' is for showing the form of the register to create new account*/
router.get('/register', (req, res) => {
    res.render('register');
});

/* this route is post request where it post a user data to create a username in the db */
router.post('/register', (req, res) => {
    User.register(
        new User({username: req.body.username}),
        req.body.password,
        (err, user) => {
            if (err) {
                /*
                 you can use err.message to get different err messages but since I make the filed of the register is required no need for err message
                 I am expecting that the user only can chose used username.
                 */
                req.flash('error', `the username ${user.username} is used pick another username please !`);
                console.log('user already exist', err);
                res.render('register');
            } else {

                console.log(user);
                passport.authenticate('local')(req, res, () => {
                    req.flash('success', `You Successfully registered As ${user.username} !`);
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
        failureRedirect: '/login',

    }),
    (req, res) => {

    }
);

/* Logout routes */
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', `Successfully logged out !`);
    res.redirect('/');
});

module.exports = router;