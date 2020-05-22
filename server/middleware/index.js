/*------------------------ creating a middleware object to export it ------------------------ */
let middleware_functions = {};
/*------------------------ requiring the models  ------------------------ */
const Comment = require('../models/Comment'),
    Campground = require('../models/Campground');


/** isAuthorized_comments Middleware
 * @param req is the request of the user
 * @param res is the response that will be send
 * @param next next to move to the route callback function
 * this middleware is for checking if the user is have the right authorization to request a
 * put,delete,get operations.
 * **/
middleware_functions.isAuthorized_comments =
    function (req, res, next) {
        //check if the user is logged in or not
        if (req.isAuthenticated()) {
            Comment.findById(req.params.comment_id, (err, comment) => {
                if (err) {
                    console.log('requested from ', req.user.username);
                    console.log('owner is ', comment.author.username);
                    res.redirect('back');
                } else {
                    if (req.user._id.equals(comment.author.id)) {
                        console.log('requested from ', req.user.username);
                        console.log('owner is ', comment.author.username);
                        return next();
                    } else {
                        console.log('requested from ', req.user.username);
                        console.log('owner is ', comment.author.username);
                        res.redirect('back');
                    }
                }
            });

        } else {
            res.redirect('back');
        }
    }


/** isAuthorized_campgrounds Middleware
 * @param req is the request of the user
 * @param res is the response that will be send
 * @param next next to move to the route callback function
 * this middleware is for checking if the user is have the right authorization to request a
 * put,delete,get operations.
 * **/
middleware_functions.isAuthorized_campgrounds =
    function (req, res, next) {
        // first we check if the user is logged in else we redirect the user from where he/she came
        if (req.isAuthenticated()) {
            Campground.findById(req.params.id, (err, camp) => {
                if (err) {
                    console.log(err);
                    //res.redirect('back') ---> redirect the user back from where he/she come from.
                    res.redirect('back');
                } else {
                    //we check if the user who requests to modify the campground he is the author,
                    // if the result of authentication is true then render the from
                    // we used .equals because mongo returns String.
                    if (req.user._id.equals(camp.user.id)) {
                        console.log('id of creator ' + camp.user.id + ' username is ' + camp.user.username);
                        console.log('id of requesting ' + req.user.id + ' username is ' + req.user.username);
                        return next();
                    } else {
                        console.log('id of creator ' + camp.user.id + ' username is ' + camp.user.username);
                        console.log('id of requesting ' + req.user.id + ' username is ' + req.user.username);
                        res.redirect('back');
                    }
                }
            });
        } else
            res.redirect('back');
    }

/** isLoggedIn Middleware
 * @param req is the request of the user
 * @param res is the response that will be send
 * @param next next to move to the route callback function
 * this isLoggedIn function is considered to be a middleware that we need in the secret route where we need to check
 if the user is logged in or not.
 * **/

middleware_functions.isLoggedIn =
    function (req, res, next) {
        if (req.isAuthenticated()) {
            // return next() means go next where it is the callback function in the route
            return next();
        }
        res.redirect('/login');


    }


module.exports = middleware_functions;