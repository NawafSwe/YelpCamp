
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
