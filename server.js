// load the express package and create our app
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var morgan = require('morgan');
var port = process.env.PORT || 8080;
var User = require('./app/models/user');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// configure our app to handle CORS requests
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \
 Authorization');
    next();
});

//log all requests to the console
app.use(morgan('dev'));


// ROUTES FOR OUR API
// =============================

// basic route for the home page
app.get('/', function (req, res) {
    res.send('Welcome to the home page!');
});

// get an instance of the express router
var apiRouter = express.Router();


// MIDDLEWARE
apiRouter.use(function (req, res, next) {
    //do logging
    console.log("Someone just came to the app!");

    //TODO: Add authenticating users here
    next();
});


// test route to make sure everything is working
// accessed at GET http://localhost:8080/api
apiRouter.get('/', function (req, res) {
    res.json({
        message: 'hooray! welcome to our api!'
    });
});

apiRouter.route("/users")

// create a user (accessed at POST http://localhost:8080/api/users)
.post(function (req, res) {
    // create a new instance of the User model
    var user = new User();
    // set the users information (comes from the request)
    user.name = req.body.name;
    user.username = req.body.username;
    user.password = req.body.password;

    // save the user and check for errors
    user.save(function (err) {
        if (err) {
            // duplicate entry
            if (err.code == 11000)
                return res.json({
                    success: false,
                    message: 'A user with that username already exists. '
                });
            else
                return res.send(err);
        }
        res.json({
            message: 'User created!'
        });
    });
})

// get all the users (accessed at GET http://localhost:8080/api/users)
.get(function (req, res) {
    User.find(function (err, users) {
        if (err) res.send(err);
        //return the users
        res.json(users);
    });
});


apiRouter.route("/users/:user_id")

// get the user with that id
// (accessed at GET http://localhost:8080/api/users/:user_id)
.get(function (req, res) {
    User.findById(req.params.user_id, function (err, user) {
        if (err) res.send(err);
        //return user
        res.json(user);
    });
})


// more routes for our API will happen here 47
// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', apiRouter);

// START THE SERVER
// ===============================
app.listen(port);
console.log('Magic happens on port ' + port);

mongoose.connect('mongodb://localhost:27017/test'); // connect to our database