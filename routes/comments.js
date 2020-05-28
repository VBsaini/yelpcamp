var express = require("express");
var router = express.Router({mergeParams:true});
var campground = require("../models/campground");
var comments = require("../models/comment");
var middleware = require("../middleware/index");

router.get("/new",middleware.isloggedin, function(req, res){
	campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err)
		} else {
	res.render("comments/new", {campground:foundCampground})
		}
	});
});

router.post("/", middleware.isloggedin,  function(req, res){
	campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds")
		} else {
			comments.create(req.body.comment, function(err, comment){
			if(err){
				req.flash("error", "comment not found");
				console.log(err);
			} else {
				comment.author.id = req.user._id;
				comment.author.username = req.user.username;
				comment.save();
				campground.comments.push(comment);
				campground.save();
				req.flash("success", "Created Comment");
				res.redirect("/campground/"+ campground._id)
			}
			});
		}
	});
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err)
		} else {
			comments.findById(req.params.comment_id, function(err, foundComment){
				if(err){
					res.redirect("back")
				} else {
						res.render("comments/edit", {campground:foundCampground, comments:foundComment})
				}
			});
		}
	});
});

router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	comments.findByIdAndUpdate(req.params.comment_id, req.body.comment , function(err, updatedComment){
		if(err){
			console.log(err);
			res.redirect("back")
		} else {
			res.redirect("/campground/"+req.params.id);
		}
	});
});

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	comments.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		} else {
			req.flash("success", "Comment deleted")
			res.redirect("/campground/"+req.params.id);
		}
	});
});

module.exports = router;