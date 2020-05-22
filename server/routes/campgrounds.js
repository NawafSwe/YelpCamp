/* ----------------------------  importing packages ---------------------------- */
const express = require('express'),
    Comment = require('../models/Comment'),
    Campground = require('../models/Campground'),
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

router.post('/campgrounds', isLoggedIn, (req, res) => {
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
router.get('/campgrounds/new', isLoggedIn, (req, res) => {
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
 * Note: we can create a middleware to check auth isAuthorized will run first to check auth if not auth then not allowed to access;;
 * **/

router.get('/campgrounds/:id/edit', isAuthorized, (req, res) => {
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

router.put('/campgrounds/:id', isAuthorized, (req, res) => {
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
router.delete('/campgrounds/:id', isAuthorized, (req, res) => {


    Campground.findByIdAndRemove(req.params.id, (err, camp) => {
        if (err) {
            console.log(err);
            res.redirect('/campgrounds');
        } else {

            res.redirect('/campgrounds');
        }
    });
});

/**  isLoggedIn Middleware
 * @param req is refer to the request of the user
 * @param res is refer to the response of the server
 * @param next is refer to the next callback function which the route has
 * this middleware checks whether the use is logged in or no.
 * **/
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
    // first we check if the user is logged in else we redirect the user from where he/she came
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, camp) => {
            if (err) {
                console.log(err);
                //res.redirect('back') ---> redirect the user back from where he/she come from.
                res.redirect('back');
            } else {
                //we check if the user who requests to modify the campground he is the author,
                // if the result of authentication is true then render the from
                // we used .equals because mongo returns String.
                if (req.user._id.equals(camp.user.id)) {
                    console.log('id of creator ' + camp.user.id + ' username is ' + camp.user.username);
                    console.log('id of requesting ' + req.user.id + ' username is ' + req.user.username);
                    return next();
                } else {
                    console.log('id of creator ' + camp.user.id + ' username is ' + camp.user.username);
                    console.log('id of requesting ' + req.user.id + ' username is ' + req.user.username);
                    res.redirect('back');
                }
            }
        });
    } else
        res.redirect('back');
}

module.exports = router;
