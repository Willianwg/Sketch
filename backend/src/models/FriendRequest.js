const mongoose = require("mongoose");

const FriendRequestSchema = new mongoose.Schema({
	approved: Boolean,
	from:{
		type:mongoose.Schema.Types.ObjectId,
		ref:"User"
	},
	to:{
		type:mongoose.Schema.Types.ObjectId,
		ref:"Spot"
	},
});


module.exports = mongoose.model("FriendRequest", FriendRequestSchema);