# YelpCamp Project 

<h3>Description:</h3>
<a>Yelp camp project is a web application that was developed using MEN stack 
using MongoDb and express, Nodejs ,furthermore <a href="https://getbootstrap.com/docs/3.3/"> bootstrap3</a> for styling
 allows the user to:</p>
<ol>
<li>
Create Account and use it to utilize the website like creating a campgrounds and adding comments to a campground
</li>
<li>
Add and remove, edit Campgrounds,

</li>
<li>
Add and remove, edit Comments
</li>
</ol>
<p>user can add create campground with a price and give it a comment and description and an image, also a comments can be added to particular campground
</p>


# Models:
<p>There are three models are used listed below:</p>
<ol>
<li>User, where the user has the following attributes:
<ul>
<li>username</li>
<li>email</li>
<li>password</li>
<li>resetPasswordToken</li>
<li>resetPasswordExpires</li>
</ul>

</li>
<li>Campground, where the user has the following attributes:
<ul>
<li>name</li>
<li>image_url</li>
<li>description</li>
<li>comments</li>
<li>user</li>
<li>price</li>

</ul>
</li>

<li>Comment,  where the user has the following attributes:
<ul>
<li>author</li>
<li>text</li>
</ul>
</li>
</ol>



# Strategies:
<section>
<h1>Front End Process</h1>
<p>The front end 'client side' I have used ejs to make the connection between the server and the front-end more easier 
and reasonable. where we can get the data from the data base and pass it easily to the ejs file and use it.
for more information how ejs works,syntax please visit <a href="https://ejs.co/">ejs tutorials</a>.
</p>
</section>

<section>
<h1>Back End process</h1>
<p>the backend end 'server side' was developed using nodejs and mongodb and using RestFul routes concepts in naming the routes 
all the code are well commented and documented for more information about how RestFul routes please visit <a href="https://medium.com/@shubhangirajagrawal/the-7-restful-routes-a8e84201f206">RestFul Routes</a>.
</p>
<h4>Privacy</h4>
<p>The package Passport was used to do the authentication process and hashing the passwords of the users, for more information 
about the package passport please visit <a href="https://www.npmjs.com/package/passport">here</a></p>
</section>

# Getting started: 

<strong>Note:</strong><h5>this project is running locally using mongodb</h5>
* before starting make sure that you have node installed in your machine and mongodb 
* open the terminal in the root directory and run `npm install` to install all the packages required to run this project on your local machine 
* finally in the terminal run the command `nodemon` and `mongod` to get the database and the app running on port 3000
 feel free to change the port number!




