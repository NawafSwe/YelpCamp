const mongoose = require("mongoose");
const Campground = require("./models/Campground");
const Comment   = require("./models/Comment");
 
let data = [
  {
    name: "Cloud's Rest",
    image_url:
      'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum'
  },
  {
    name: 'Desert Mesa',
    image_url: 'https://koa.com/blog/images/solo-camping-tips.jpg?preset=blogPhoto',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum'
  },
  {
    name: 'Canyon Floor',
    image_url:
      'https://www.outsideonline.com/sites/default/files/styles/full-page/public/2018/05/31/favorite-free-camping-apps_h.jpg?itok=2kG5j7lb',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum'
  }
];
 
function seedDB() {
   /* first we removes all the campgrounds from the database */
   Campground.deleteMany({}, function (err) {
     if (err) {
       console.log(err);
     }

     console.log('removed campgrounds!');
     /* second we removes all the comments from the database */
     Comment.deleteMany({}, function (err) {
       if (err) {
         console.log(err);
       }
       console.log('removed comments!');
       //then we start to add a few campgrounds
       data.forEach(function (seed) {
         Campground.create(seed, function (err, campground) {
           if (err) {
             console.log(err);
           } else {
             console.log('added a campground');
             //then we start to create a comment
             Comment.create(
               {
                 text: 'This place is great, but I wish there was internet',
                 author: 'Homer'
               },
               function (err, comment) {
                 if (err) {
                   console.log(err);
                 } else {
                   campground.comments.push(comment);
                   campground.save();
                   console.log('Created new comment');
                 }
               }
             );
           }
         });
       });
     });
   }); 
    //add a few comments
}
module.exports = seedDB;

