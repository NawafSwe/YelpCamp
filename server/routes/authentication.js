/* ----------------------------  importing packages ---------------------------- */
const express = require('express'),
    router = express.Router(),
    User = require('../models/User'),
    async = require('async'),
    nodemailer = require('nodemailer'),
    crypto = require('crypto'),
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
        new User({
            username: req.body.username,
            email: req.body.email
        }),
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

/* -------------------------------- reset password Routes -------------------------------- */

/* '/forgot' is SHOW route where it shows a from to fill an email  */
router.get('/forgot', function (req, res) {
    res.render('forgot');
});

/* '/forgot' is post route where it post  a from to the database to look for an email*/
router.post('/forgot', (req, res, next) => {
    /* async.waterfull is holding an array of functions where it call them one by one

      */
    async.waterfall([
        (done) => {
            //generating token
            crypto.randomBytes(20, (err, buf) => {
                let token = buf.toString('hex');
                done(err, token);
            });
        },
        (token, done) => {
            //finding the user who has the email
            User.findOne({email: req.body.email}, (err, user) => {
                if (!user) {
                    req.flash('error', 'No account with that email address exists.');
                    return res.redirect('/forgot');
                }
                //setting the token for a user
                user.resetPasswordToken = token;
                //setting the time for the token to expired after one hour from NOW
                user.resetPasswordExpires = Date.now() + 3600000;

                user.save((err) => {
                    done(err, token, user);
                });
            });
        },
        (token, user, done) => {
            // creating an email to send to user
            let smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'nawafDeveloper2020@gmail.com',
                    pass: process.env.GMAILPW
                }
            });
            let mailOptions = {
                to: user.email,
                from: 'Yelp Camp ',
                subject: 'Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, (err) => {
                console.log('mail sent');
                req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                done(err, 'done');
            });
        }
    ], (err) => {
        if (err) return next(err);
        res.redirect('/forgot');
    });
});


/* '/reset/:token' get route is to show the form of entering the new password */
router.get('/reset/:token', (req, res) => {
    //finding the user by his token and expired time token checking if it is greater than one hour from now
    User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}}, (err, user) => {
        if (!user) {
            // if it is not exist or expired
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/forgot');
        }
        res.render('reset', {token: req.params.token});
    });
});

/* '/reset/:token' post route is to post the form of entering the new password to the database and
    confirm the new password then setting the token time and the token to be undefined
*/
router.post('/reset/:token', (req, res) => {
    async.waterfall([
        (done) => {
            User.findOne({
                resetPasswordToken: req.params.token,
                resetPasswordExpires: {$gt: Date.now()}
            }, (err, user) => {
                if (!user) {
                    req.flash('error', 'Password reset token is invalid or has expired.');
                    return res.redirect('back');
                }
                if (req.body.password === req.body.confirm) {
                    user.setPassword(req.body.password, (err) => {
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;

                        user.save((err) => {
                            req.logIn(user, (err) => {
                                done(err, user);
                            });
                        });
                    })
                } else {
                    req.flash("error", "Passwords do not match.");
                    return res.redirect('back');
                }
            });
        },
        (user, done) => {
            let smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'nawafDeveloper2020@gmail.com',
                    pass: process.env.GMAILPW
                }
            });
            let mailOptions = {
                to: user.email,
                from: 'Yelp Camp',
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, (err) => {
                req.flash('success', 'Success! Your password has been changed.');
                done(err);
            });
        }
    ], (err) => {
        res.redirect('/campgrounds');
    });
});


module.exports = router;