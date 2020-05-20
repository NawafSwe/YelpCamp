/* ----------------------------  importing packages ---------------------------- */
const  express = require('express'),
       router = express.Router();
       
/* router is used to route express into index.js file */


/* ----------------------------  Comments routes ---------------------------- */

/* this route is nested route because the each campground has relation with comments -- RestFul routes*/
router.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
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

module.exports = router;