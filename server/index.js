
/*importing the packages*/
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');


/*setting up the app*/
app.set(express.static('public'));
app.use(cors());
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


/*testing the connection of the server */
const port = 3000;
app.listen(port, () => {
  console.log(`server is running on ${port}`);
});


/*---------------------------- app routes ---------------------------- */

/* this route is the initial route where render the home page*/
app.get('/', (req, res) => {
    res.render('home');
});
 
/* this route is going to show all campgrounds info
    campgrounds are lists of the format 
    [
    {name:name,
    image_url: url
    }
    ]

    we will take the data from the data base later on ;; 

*/
let camp_grounds_list = [
  {
    name: 'ksa',
    image_url:
      'https://koa.com/blog/images/make-tent-camping-more-comfortable.jpg?preset=blogPhoto'
  },
  {
    name: 'ksa',
    image_url:
      'https://koa.com/blog/images/make-tent-camping-more-comfortable.jpg?preset=blogPhoto'
  },
  {
    name: 'ksa',
    image_url:
      'https://koa.com/blog/images/make-tent-camping-more-comfortable.jpg?preset=blogPhoto'
  }
]; 
app.get('/campgrounds', (req, res) => { 
  res.render('campgrounds', { camp_grounds_list: camp_grounds_list });
});


