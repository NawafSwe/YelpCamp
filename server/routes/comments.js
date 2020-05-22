/* ----------------------------  importing packages ---------------------------- */
const express = require('express'),
    Comment = require('../models/Comment'),
    Campground = require('../models/Campground'),
    middleware = require('../middleware/index'),
    router = express.Router();

/* router is used to route express into index.js file */


/* ----------------------------  Comments routes ---------------------------- */

/* this route is nested route because the each campground has relation with comments -- RestFul routes*/
router.get('/campgrounds/:id/comments/new', middleware.isLoggedIn, (req, res) => {
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
router.post('/campgrounds/:id/comments', middleware.isLoggedIn, (req, res) => {
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
router.get('/campgrounds/:id/comments/:comment_id/edit', middleware.isAuthorized_comments, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
        }
    });

});

/* this route is UPDATE restfulRoute where it updates a comment **/
router.put('/campgrounds/:id/comments/:comment_id', middleware.isAuthorized_comments, (req, res) => {
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
router.delete('/campgrounds/:id/comments/:comment_id', middleware.isAuthorized_comments, (req, res) => {
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


module.exports = router;