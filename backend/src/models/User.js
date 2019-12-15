const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
	email:String,
	username:String,
	password:{
		select:false,
		type:String,
	},
	avatar:{
		type:String,
		default:"default-avatar.png",
	},
	friends:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:"User",
	}],
	pushToken:String,
},{
	toJSON:{
		virtuals:true
	}
});

UserSchema.pre("save", async function(next){
	if(! this.password ) return;
	const hash = await bcrypt.hash(this.password, 10);
	this.password = hash;

	next();
});

UserSchema.virtual("avatar_url").get( function(){
	return `http://localhost:3001/files/${this.avatar}`;
});
module.exports = mongoose.model("User", UserSchema);