var obj = {};
var Campground = require("../models/campground");
var Comment = require("../models/comment");

obj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please login first to complete your action.");
    res.redirect("/login");
}


obj.checkCampgroundOwnership = function(req, res, next){
    console.log(req.user);
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(error, campground){
            if(error || !campground){
                console.log("Error finding object on DB.");
                req.flash("error", "Something went wrong.");
                res.redirect("back");
            }
            else {
                if(campground.author.id.equals(req.user._id) || req.user.isAdmin){               
                    next();
                }
                else{
                    req.flash("error", "You don't have permission for that.");
                    res.redirect("back");
                }

            }
        });
    }
    else {
        console.log("No user logged in");
        req.flash("error", "You need to be logged in for that."); 
        res.redirect("back");
    }
}

obj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(error, comment){
            if(error){
                console.log("Error finding object on DB.");
                req.flash("error", "Comment not found");
                res.redirect("back");
            }
            else {
                if(comment.author.id.equals(req.user._id) || req.user.isAdmin){               
                    next();
                }
                else{
                    req.flash("error", "You don't have permission for that.");
                    res.redirect("back");
                }
            }
        });
    }
    else {
        console.log("No user logged in");
        req.flash("error", "You need to be logged in for that.");
        res.redirect("back");
    }
}



module.exports = obj;