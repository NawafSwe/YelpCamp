


/*---------------------------- importing the packages ----------------------------*/
const express   = require('express'),
      app           = express(),
      bodyParser    = require('body-parser'),
      cors          = require('cors'),
      Campground    = require('./models/Campground'),
      seedDB          = require('./seeds'),
      db_connection = require('./configuration/db_connection');


/*---------------------------- Calling the seedDB function ----------------------------*/
     seedDB();
/*---------------------------- setting up the app ----------------------------*/
app.set(express.static('public'));
app.use(cors());
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



/*---------------------------- testing the connection of the server ----------------------------*/
const port = 3000;
app.listen(port, () => {
  console.log(`server is running on ${port}`);
});


/*---------------------------- app routes ---------------------------- */

/* this route is the '/' is the initial route where render the home page*/
app.get('/', (req, res) => {
    res.render('home');
});
 
/*  this route is the INDEX ROUTE  -- '/campgrounds' where it renders the campgrounds from the database */
app.get('/campgrounds', (req, res) => {
  Campground.find({}, (err, camps) => {
    if (err)
      console.log('error', err);
    else
      res.render('index', { camp_grounds_list: camps });
  });
});



/* this route  is the CREATE ROUTE --  to post '/campgrounds' new camp ground to the  to the data base 
    by taking the data from a form
  */

app.post('/campgrounds', (req, res) => {
 
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
app.get('/campgrounds/new', (req, res) => { 
  res.render('new');
});


/* this route is SHOW ROUTE -- '/campgrounds/:id'
where it shows more info about a particular campground
*/

app.get('/campgrounds/:id', (req, res) => {
  /* this is be cause we have an relation between campgrounds and comment 
  so we want all comment for a particular campground */
  Campground.findById(req.params.id).populate('comments').exec((err, target) => {
    if (err)
      console.log('something went wrong');
    else
      res.render('show', { camp: target });
   });
  
});

/* this route is nested route because the each campground has relation with comments -- RestFul routes*/
app.get('/campgrounds/:id/comments/new', (req, res) => {
  res.render('newComment');
});

/* this route is nested route because the each campground has relation with comments -- RestFul routes where it 
    adds a comment 
*/
app.post('/campgrounds/:id/comments', (req, res) => {
  const comment = req.body.comment;
  Campground.findOne(req.params.id, (err, campground) => { 
    if (err) {
      console.log('err', err);
    } else { 
      Comment.create(comment, (err, comment) => { 
        if (err) {
          console.log('err', err);
        } else {
          campground.comments.push(comment);
          campground.save((err, status) => { 
            if (err) {
              console.log('err', err);
            } else { 
              console.log('comment was added:',status);
            }
          });
        }
      });
    }
  });

});
 
/* ---------------------------- helper functions ----------------------------*/
/*  this function is for creating an object of campground.
    this is en easier way to avoid writing nested callback functions inside the routes
*/
function create_campground(campName, url,description){
 return {
   name: campName,
   image_url: url,
   description: description
 }
  
}


// this function is helps to create and add a comment to a particular campground
function add_comment(camp, comment) {}


