

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
  const name = req.body.name;
  const image_url = req.body.image_url;
  const description = req.body.description;

  const new_camp_ground = create_campground(name, image_url, description);
  Campground.create(new_camp_ground, (err, campground) => {
    if (err)
      console.log('not added');
    else {
      console.log('successfully added', campground);
      res.redirect('campgrounds');
    }
  });
  
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
  Campground.findById(req.params.id, (err, target) => {
    if (err)
      console.log('something went wrong');
    else
      res.render('show', { camp: target });
   });
  
});
  
  




/* ---------------------------- helper functions ----------------------------*/
// this function is for creating an object of campground.
function create_campground(campName, url,description){
  return {
    name: campName,
    image_url: url,
    description: description
  }
}

