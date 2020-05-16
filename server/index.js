
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


/*---------------------------- app routes ---------------------------- */

/* this route '/' is the initial route where render the home page*/
app.get('/', (req, res) => {
    res.render('home');
});
 
/* this route get '/campgrounds' is going to show all campgrounds info
    campgrounds are lists of the format 
    [
    {name:name,
    image_url: url
    }
    ]

    we will take the data from the data base later on ;; 

*/

/*---------------------------- now creating our models and schema ---------------------------- */
let campgroundSchema = new mongoose.Schema({
  name: String,
  image_url: String
});
let Campground = mongoose.model('campground', campgroundSchema);
/*Campground.create({
  name: 'ksa',
  image_url:
    'https://koa.com/blog/images/make-tent-camping-more-comfortable.jpg?preset=blogPhoto'
}
  , (err, campground) => { 
    if (err)
      console.log('not added');
    else
      console.log('successfully added');
  }
);*/

app.get('/campgrounds', (req, res) => { 
  Campground.find({}, (err,camps) => {
    if (err) console.log('error', err);
    else res.render('campgrounds', { camp_grounds_list: camps});;
  });

  
});


/* this routs is to post '/campgrounds' new camp ground to the list camp_grounds_list and later on to the data base 
    by taking the data from a form
  */

app.post('/campgrounds', (req, res) => {
  const name = req.body.name;
  const image_url = req.body.image_url;
  camp_grounds_list.push(create_campground(name, image_url));
  res.redirect('campgrounds');
 });


 /* this route '/campgrounds/new' is to get the form using the convention of RESTApi naming      */
/* a function to generate an object of campground*/
app.get('/campgrounds/new', (req, res) => { 
  res.render('new');
});

const create_campground = (campName, url) => {
  return {
    name: campName,
    image_url: url
  }
}

