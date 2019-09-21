var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


router.get("/", function(req, res){
    res.render("landing.ejs");
});



router.get("/register", function(req, res){
    res.render("register.ejs");
});

router.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(error, user){
        if(error){
            console.log("Error: " + error);
            return res.render("register.ejs", {error: error.message});            
        }
        
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to WildCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});


router.get("/login", function(req, res){
    res.render("login.ejs");
});


// Middleware -> executes before the callback
router.post("/login", passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){ 
    }
);


router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Signed out successfuly.");
    res.redirect("/campgrounds");
});



module.exports = router;