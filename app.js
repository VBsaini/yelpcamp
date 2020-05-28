var express           = require("express"),
	app               = express(),
	bodyParser        = require("body-parser"),
	mongoose          = require("mongoose"),
	flash             = require("connect-flash"),
	passport          = require("passport"),
	localStrategy     = require("passport-local"),
	methodoverride    = require("method-override"),
	user              = require("./models/user"),
	campground        = require("./models/campground"),
	comment           = require("./models/comment"),
	seedsDB           = require("./seeds");

var commentRoute      = require("./routes/comments"), 
	campgroundRoute   = require("./routes/campground"), 
	indexRoute    	  = require("./routes/index"); 

mongoose.connect("mongodb://localhost:27017/Yelp_Camp", {useNewUrlParser: true, useUnifiedTopology: true});
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(methodoverride("_method"));
app.use(flash());
// seedsDB();

//  ===========================================================================================================================================
//                                                              start passport
//  ===========================================================================================================================================

app.use(require("express-session")({
	secret:"i need a pc",
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

//  ===========================================================================================================================================
//                                                              end passport
//  ===========================================================================================================================================

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});


app.use("/campground/:id/comments", commentRoute);
app.use("/campground", campgroundRoute);
app.use("/",indexRoute);


app.listen(3000, function(){
	console.log("server started")
});