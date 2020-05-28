var campground = require("../models/campground");
var comments = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkCampOwnership = 
	function (req, res, next){
	if(req.isAuthenticated()){
		campground.findById(req.params.id, function(err, foundCampground){
			if(err){
				req.flash("error", "Campground not found");
				res.redirect("back");
			}else{
				if (err || !foundCampground) {
					req.flash("error", "campground does not exist");
				}
				if(req.isAuthenticated()){
					if(foundCampground.author.id.equals(req.user.id)){
						next();
					} else {
						res.redirect("back")
					}
				}else {
					req.flash("error", "you don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	}else{
		req.flash("error", "you need to be logged in to do that!");
		res.redirect("back")
	};
};
	
middlewareObj.checkCommentOwnership = 
	function (req, res, next){
	if(req.isAuthenticated()){
		comments.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				req.flash("error", "comment not found");
				res.redirect("back");
			}else{
				if(req.isAuthenticated()){
					if(foundComment.author.id.equals(req.user.id)){
						next();
					} else {
						res.redirect("back")
					}
				}else {
					req.flash("error", "you don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "you need to be logged in to do that!");
		res.redirect("back")
	}
};
middlewareObj.isloggedin = 
	function (req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "you need to be logged in to do that!");
	res.redirect("/login")
}

module.exports = middlewareObj;