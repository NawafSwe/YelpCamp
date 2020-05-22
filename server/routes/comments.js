/* ----------------------------  importing packages ---------------------------- */
const express = require('express'),
    Comment = require('../models/Comment'),
    Campground = require('../models/Campground'),
    router = express.Router();

/* router is used to route express into index.js file */


/* ----------------------------  Comments routes ---------------------------- */

/* this route is nested route because the each campground has relation with comments -- RestFul routes*/
router.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, camp) => {
        if (err) {
            console.log('err', err);
        } else {
            res.render('comments/new', {camp: camp});
        }
    });
});

/* this route is nested route because the each campground has relation with comments -- RestFul routes where it 
    adds a comment */
router.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log('err', err);
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log('err', err);
                } else {
                    console.log(comment);
                    //before adding the comment to a campground we want to assign a user to a comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/Campgrounds/' + req.params.id);
                }
            });
        }
    });
});

/** this route is SHOW restfulRoute where it shows a form to update a comment  **/
router.get('/campgrounds/:id/comments/:comment_id/edit', isAuthorized, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
        }
    });

});

/* this route is UPDATE restfulRoute where it updates a comment **/
router.put('/campgrounds/:id/comments/:comment_id', isAuthorized, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, comment) => {
        if (err) {
            res.redirect(`/campgrounds/${req.params.id}`);
            console.log(err);
        } else {
            console.log(comment);
            res.redirect(`/campgrounds/${req.params.id}`);

        }
    });
});

/* this route is DESTROY restfulRoute where it deletes a comment */
router.delete('/campgrounds/:id/comments/:comment_id', isAuthorized, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err, comment) => {
        if (err) {
            console.log(err);
            res.redirect(`/campgrounds/${req.params.id}`);
        } else {
            console.log('deleted is ', comment.text)
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});


/* ----------------------------  MiddleWares && helper functions ---------------------------- */

/* isLoggedIn function is considered to be a middleware that we need in the secret route where we need to check
if the user is logged in or not */
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        // return next() means go next where it is the callback function in the route
        return next();
    }
    res.redirect('/login');


}

/** isAuthorized Middleware
 * @param req is the request of the user
 * @param res is the response that will be send
 * @param next next to move to the route callback function
 * this middleware is for checking if the user is have the right authorization to request a
 * put,delete,get operations.
 * **/

function isAuthorized(req, res, next) {
    //check if the user is logged in or not
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, comment) => {
            if (err) {
                console.log('requested from ', req.user.username);
                console.log('owner is ', comment.author.username);
                res.redirect('back');
            } else {
                if (req.user._id.equals(comment.author.id)) {
                    console.log('requested from ', req.user.username);
                    console.log('owner is ', comment.author.username);
                    return next();
                } else {
                    console.log('requested from ', req.user.username);
                    console.log('owner is ', comment.author.username);
                    res.redirect('back');
                }
            }
        });

    } else {
        res.redirect('back');
    }
}

module.exports = router;