var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware"); // auto imports index.js 

var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

// INDEX - List of all campgrounds
router.get("/campgrounds", function(req, res){
    Campground.find({}, function(error, campgrounds){
        if(error){
            console.log(error);
        } else {
            res.render("campgrounds/index.ejs", {campgrounds: campgrounds});
        }
    });
});


// CREATE - Add new campground
router.post("/campgrounds", middleware.isLoggedIn, function(req, res){
    // get data from form
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    };

    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
            req.flash("error", "Invalid address");
            return res.redirect("back");
        }
        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;
        var new_campground = {name: name, image: image, description: desc, author:author, price: price, location: location, lat: lat, lng: lng};
        // Create a new campground and save to DB
        Campground.create(new_campground, function(error, campground){
            if(error){
                console.log(error);
            } else {
                console.log(campground);
                req.flash("sucess", "Campground added successfully");
                res.redirect("/campgrounds");
            }
        });
    });
});


// NEW - Form for new campground
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new.ejs");
});


// SHOW - Show info about one campground (order matters!)
router.get("/campgrounds/:id", function(req, res){
    var id_camp = req.params.id;

    Campground.findById(id_camp).populate("comments").exec(function(error, campground){
        if(error || !campground){
            console.log("Error finding object on DB.");
            req.flash("error", "Campground not found");
            res.redirect("/campgrounds");
        }
        else{
            res.render("campgrounds/show.ejs", {campground: campground});
        }
    });
}); 



// EDIT
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(error, campground){
        res.render("campgrounds/edit.ejs", {campground: campground});
    });   
}); 


// UPDATE
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
    geocoder.geocode(req.body.location, function (error, data) {
        if (error || !data.length) {
            req.flash('error', 'Invalid address');
            return res.redirect('back');
        }
        req.body.campground.lat = data[0].latitude;
        req.body.campground.lng = data[0].longitude;
        req.body.campground.location = data[0].formattedAddress;
    
        Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(error, campground){
            if(error){
                req.flash("error", error.message);
                res.redirect("back");
            } else {
                req.flash("success","Successfully Updated!");
                res.redirect("/campgrounds/" + campground._id);
            }
        });
    });
}); 


// DESTROY
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(error, campground_removed){
        if(error){
            console.log("Error deleting campground");
        }
        else {
            Comment.deleteMany( {_id: { $in: campground_removed.comments } }, (err) => {
                if (err) {
                    console.log(err);
                }

                req.flash("success", "Campground deleted.");
                res.redirect("/campgrounds");
            });
        }
    })
});




module.exports = router;