var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware"); // auto imports index.js 



router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(error, campground){
        if(error || !campground){
            req.flash("error", "Campground not found");
            res.redirect("back");
        }
        else{
            res.render("comments/new.ejs", {campground: campground});
        }
    });
});


router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res){
    // Lookup campground
    Campground.findById(req.params.id, function(error, campground){
        if(!error){
            Comment.create(req.body.comment, function(error, comment){
                if(!error){
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("sucess", "Comment added successfully.");
                    res.redirect("/campgrounds/" + campground._id);
                }
                else{
                    console.log("Error");
                }
            });
        }
        else{
            console.log("Error");
        }
    });
});


// EDIT
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Campground.findById(req.params.id, function(error, campground){
        if(error || !campground){
            req.flash("error", "Campground not found");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(error, comment){
            if(error){
                req.flash("error", "Something went wrong");
                res.redirect("/campgrounds/");
            }
            else{
                res.render("comments/edit.ejs", {campground_id: req.params.id, comment: comment});
            }
        });
    });    
});

// UPDATE
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(error, comment){
        if(!error){
            req.flash("sucess", "Comment updated successfully.");
            res.redirect("/campgrounds/" + req.params.id);
        }
        else {
            console.log("Error updating comment");
        }
    });
}); 



// Delete
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(error){
        if(!error){
            req.flash("sucess", "Comment deleted successfully.");
            res.redirect("/campgrounds/" + req.params.id);
        }
        else {
            console.log("Error deleting comment");
        }
    });
});




module.exports = router;