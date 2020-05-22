/* ----------------------------  importing packages ---------------------------- */
const express = require('express'),
    Comment = require('../models/Comment'),
    Campground = require('../models/Campground'),
    middleware = require('../middleware/index'),
    router = express.Router();


/* router is used to route express into index.js file */

/* ----------------------------  Campgrounds routes ---------------------------- */

/*  this route is the INDEX ROUTE  -- '/campgrounds' where it renders the campgrounds from the database */
router.get('/campgrounds', (req, res) => {
    Campground.find({}, (err, camps) => {
        if (err) console.log('error', err);
        else res.render('campgrounds/index', {camp_grounds_list: camps});
    });
});

/* this route  is the CREATE ROUTE --  to post '/campgrounds' new camp ground to the  to the data base 
    by taking the data from a form
  */

router.post('/campgrounds', middleware.isLoggedIn, (req, res) => {
    Campground.create(req.body.campground, (err, target) => {
        if (err) {
            console.log('err', err);
        } else {
            target.user.id = req.user._id;
            target.user.username = req.user.username;
            target.save();
            console.log(target);
            res.redirect('/campgrounds');
        }
    });
});

/* this route is the NEW ROUTE -- '/campgrounds/new' is to get the form using the convention of RESTApi naming      */
/* a function to generate an object of campground*/
router.get('/campgrounds/new', middleware.isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

/* this route is SHOW ROUTE -- '/campgrounds/:id'
where it shows more info about a particular campground
*/

router.get('/campgrounds/:id', (req, res) => {
    /* this is be cause we have an relation between campgrounds and comment
    so we want all comment for a particular campground */
    Campground.findById(req.params.id)
        .populate('comments')
        .exec((err, target) => {
            if (err) console.log('something went wrong');
            else res.render('campgrounds/show', {camp: target});
        });
});


/** this route is to show the from of updating info about a particular camp
 * Note: we can create a middleware to check auth isAuthorized_campgrounds will run first to check auth if not auth then not allowed to access;;
 * **/

router.get('/campgrounds/:id/edit', middleware.isAuthorized_campgrounds, (req, res) => {
    Campground.findById(req.params.id, (err, camp) => {
        if (err) {
            console.log(err);
            res.redirect('back');
        } else {
            res.render('campgrounds/edit', {campground: camp});
        }

    });


});

/* this route is to update a particular campground */

router.put('/campgrounds/:id', middleware.isAuthorized_campgrounds, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, campground) => {
        if (err) {
            console.log(err);
            res.redirect('back');
        } else {
            console.log(campground);
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});


/* this route is DESTROY route -- Restful where you can delete a particular campground
* Note: when you delete a campground the comments of the campground will remain  in the database do it later
*  */
router.delete('/campgrounds/:id', middleware.isAuthorized_campgrounds, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err, camp) => {
        if (err) {
            console.log(err);
            res.redirect('/campgrounds');
        } else {

            res.redirect('/campgrounds');
        }
    });
});


module.exports = router;
