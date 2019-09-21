require("dotenv").config();

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var session = require("express-session");
var passport = require("passport");
var LocalStategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var flash = require("connect-flash");
var methodOverride = require("method-override");
var comment_routes = require("./routes/comments");
var campground_routes = require("./routes/campgrounds");
var auth_routes = require("./routes/index");
app.locals.moment = require('moment');


/*********** DATABASE CONFIG ***********/

mongoose.connect(process.env.DATABASE_URL, { 
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log("Connected to DB (" + process.env.DATABASE_URL +")");
}).catch(error => {
    console.log("ERROR: " + error.message);
});
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
mongoose.set('useFindAndModify', false);
 

/*********** SETUP ***********/
// Method Override
app.use(methodOverride("_method"));

// Tell express about the public folder
app.use(express.static("public"));

// body parser
app.use(bodyParser.urlencoded({extended: true}));

app.use(flash());




/*********** PASSPORT CONFIG ***********/
// Session
const MongoStore = require('connect-mongo')(session);

app.use(session({
    secret: "Learning web development",
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    resave: false,
    saveUninitialized: false
}));

// Auth
app.use(passport.initialize());
app.use(passport.session());

// Reading data and encode/decode from the session (methods from "plugin")
passport.use(new LocalStategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Pass information to every template
app.use(function(req, res, next){
    res.locals.current_user = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


// Import routes
app.use(comment_routes);
app.use(campground_routes);
app.use(auth_routes);



app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server is running! (Port " +  process.env.PORT + ")"); 
});
 