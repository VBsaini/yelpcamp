var express = require("express");
var router = express.Router();
var campground = require("../models/campground");
var middleware = require("../middleware/index");

router.get("/", function(req, res){
	campground.find({}, function(err, allcampgrounds){
		if(err){
		console.log(err);	
		}else{
		res.render("campground/index", {campgrounds:allcampgrounds});
		}
	});
	
});

router.get("/new", middleware.isloggedin,  function(req, res){
	res.render("campground/new");
});

router.post("/", middleware.isloggedin,  function(req, res){
	var name = req.body.name
	var image = req.body.image
	var description = req.body.description
	var price = req.body.price
	var author = {
		id           :req.user._id,
		username     :req.user.username
				 }
	var newCamp = {
		name         :name, 
		image        :image, 
		description  :description,
		author       :author,
		price        :price
		}

	campground.create(newCamp, function(err, newlycreated){
		if(err){
			console.log(err);
		}else{
			res.redirect("/campground");
		}
	});
});

router.get("/:id", function(req, res){
	campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			res.render("campground/show", {campground:foundCampground});
		}
	});
});

router.get("/:id/edit",middleware.checkCampOwnership ,function(req, res){
		campground.findById(req.params.id, function(err, foundCampground){
			if(err){
				console.log(err);
				return res.redirect("/campground")
			}else{
				res.render("campground/edit", {campground:foundCampground})
			}
	});
});

router.put("/:id",middleware.checkCampOwnership ,function(req, res){
	campground.findByIdAndUpdate(req.params.id, req.body.camp, function(err, updated){
		if(err){
			console.log(err)
			 res.redirect("/campground")
		} else{
		 	res.redirect("/campground")
			}
	});
});

router.delete("/:id", middleware.checkCampOwnership, function(req, res){
	campground.findByIdAndRemove(req.params.id, function(err){
		if (err){
			console.log(err);
			res.redirect("/campground");
		} else {
			res.redirect("/campground/")
		}
	});
});

module.exports = router;