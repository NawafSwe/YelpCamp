
/*---------------------------- importing the packages ----------------------------*/
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');


/*---------------------------- setting up the app ----------------------------*/
app.set(express.static('public'));
app.use(cors());
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/*---------------------------- setting up  the connection of the data base ----------------------------*/
const uri ='mongodb://localhost/yelpcamp';
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err,db) => {
    if (err)
      console.log('the error is', err);
    else
      console.log('successfully connected');
});

/*---------------------------- testing the connection of the server ----------------------------*/
const port = 5600;
app.listen(port, () => {
  console.log(`server is running on ${port}`);
});


/*---------------------------- now creating our models and schema ---------------------------- */
let campgroundSchema = new mongoose.Schema({
  name: String,
  image_url: String,
  description: String 
});
let Campground = mongoose.model('campground', campgroundSchema);


/*---------------------------- app routes ---------------------------- */


app.get('/campgrounds', (req, res) => {
  Campground.find({}, (err, camps) => {
    if (err) console.log('error', err);
    else res.render('campgrounds', { camp_grounds_list: camps });
  });
});


/* this route is the INDEX ROUTE  --  '/campgrounds' is the initial route where render the home page*/
app.get('/campgrounds', (req, res) => {
    res.render('home');
});
 




/* this route  is the CREATE ROUTE --  to post '/campgrounds' new camp ground to the  to the data base 
    by taking the data from a form
  */

app.post('/campgrounds', (req, res) => {
  const name = req.body.name;
  const image_url = req.body.image_url;
  const description = req.body.description;
  const new_camp_ground =  {
      name: name,
      image_url: image_url,
      description: description
    }
  Campground.create(new_camp_ground, (err, campground) => {
    if (err) console.log('not added');
    else console.log('successfully added', campground);
  });
  res.redirect('campgrounds');
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
  Campground.find({id: req.body.param.id}, (err, target) => {
    if (err) console.log('something went wrong');
    else res.render('campground_info', { camp_info: target });
  }
    
   );
  
  
});



/* ---------------------------- helper functions ----------------------------*/
// this function is for creating an object of campground.
const create_campground = (campName, url,description) => {
  return {
    name: campName,
    image_url: url,
    description: description
  }
}

