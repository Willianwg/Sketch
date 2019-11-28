const mongoose = require("mongoose");

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
},{
	toJSON:{
		virtuals:true
	}
});

UserSchema.virtual("avatar_url").get( function(){
	return `http://localhost:3001/files/${this.avatar}`;
});
module.exports = mongoose.model("User", UserSchema);