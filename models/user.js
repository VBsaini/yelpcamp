var mongoose                   = require("mongoose");
var passportLocalMongoose      = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
	password:String,
	username:String
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("user", userSchema);