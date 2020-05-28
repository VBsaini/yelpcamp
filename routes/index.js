var express = require("express");
var router = express.Router();
var passport = require("passport");
var user = require("../models/user");
var middleware = require("../middleware/index");

router.get("/", function(req, res){
	res.render("landing");
});

router.get("/register", function(req, res){
	res.render("register")
});

router.post("/register", function(req, res){
	var newuser = new user({username:req.body.username})
	user.register(newuser , req.body.password, function(err, user){
		if(err){
		return res.render("register", {"error": err.message});
		} 
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "welcome to yelpcamp " + user.username);
			res.redirect("/campground")
		});
	});
});

router.get("/login", function(req, res){
	res.render("login")
});

router.post("/login", passport.authenticate("local", {
	successRedirect:"/campground",
	failureRedirect:"/login"
	}), function(req, res){
});

router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "logged you out!")
	res.redirect("/campground");
});


module.exports = router;