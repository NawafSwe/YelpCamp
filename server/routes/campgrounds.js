/* ----------------------------  importing packages ---------------------------- */
const express = require('express'),
    Campground = require('../models/Campground'),
    middleware = require('../middleware/index'),
    router = express.Router();


/* ----------------------------  media config ---------------------------- */
let multer = require('multer');
//storage is used to specify the name of the file where below will be date then the file original file name
let storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});

//image filter is to specify the extension of the image e.g jpg|jpeg|png|gif
let imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

let upload = multer({storage: storage, fileFilter: imageFilter})
const dotenv = require('dotenv');
dotenv.config();
let cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'dw3pufmm8',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


/* router is used to route express into index.js file */

/* ----------------------------  Campgrounds routes ---------------------------- */

/*  this route is the INDEX ROUTE  -- '/campgrounds' where it renders the campgrounds from the database */
router.get('/campgrounds', (req, res) => {
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search, 'gi'));
        Campground.find({name: regex}, (err, camps) => {

            if (err) {
                req.flash('error', err.message);
                res.redirect('back');
            } else {
                res.render('campgrounds/index', {camp_grounds_list: camps});
            }
        });

    } else {
        Campground.find({}, (err, camps) => {

            if (err) {
                req.flash('error', err.message);
                res.redirect('back');
            }
            res.render('campgrounds/index', {camp_grounds_list: camps});
        });

    }
});


/* this route is the NEW ROUTE -- '/campgrounds/new' is to get the form using the convention of RESTApi naming      */
/* a function to generate an object of campground*/
router.get('/campgrounds/new', middleware.isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

/* this route  is the CREATE ROUTE --  to post '/campgrounds' new camp ground to the  to the data base 
    by taking the data from a form
  */

//upload.single('' here should goes the name='' of the input '')
router.post("/campgrounds", middleware.isLoggedIn, (req, res) => {
    Campground.create(req.body.campground, (err, target) => {
        if (err) {
            console.log('err', err);
            req.flash('error', ' sorry Cannot add new campground try again later!');
            res.redirect('/campgrounds');
        } else {
            target.user.id = req.user._id;
            target.user.username = req.user.username;
            target.save();
            console.log(target);
            req.flash('success', 'Campground successfully was added!');
            res.redirect('/campgrounds');
        }
    });
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
            if (err) {
                console.log(err);
                req.flash('error', ' sorry Could not find the campground!');
                res.redirect('/campgrounds');
            } else {
                res.render('campgrounds/show', {camp: target});
            }
        });
});


/** this route is to show the from of updating info about a particular camp
 * Note: we can create a middleware to check auth isAuthorized_campgrounds will run first to check auth if not auth then not allowed to access;;
 * **/

router.get('/campgrounds/:id/edit', middleware.isAuthorized_campgrounds, (req, res) => {
    Campground.findById(req.params.id, (err, camp) => {
        if (err) {
            console.log(err);
            req.flash('error', ' Sorry you are not authorized to edit the campground');
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
            req.flash('error', 'Sorry you are not authorized to edit the campground');
            res.redirect('back');
        } else {
            console.log(campground);
            req.flash('success', 'Campground information was successfully updated!');
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
            req.flash('error', ' Sorry you are not authorized to delete the campground');
            res.redirect('/campgrounds');
        } else {
            req.flash('success', 'Campground successfully deleted');
            res.redirect('/campgrounds');
        }
    });
});

/* ---------------------------- Helper functions ---------------------------- */
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
module.exports = router;
