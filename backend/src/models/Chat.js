const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
	users:[{
			type:mongoose.Schema.Types.ObjectId,
			ref:"User",
		}],
	//to:{
			//type:mongoose.Schema.Types.ObjectId,
			//ref:"User",
		//},
	//from:{
			//type:mongoose.Schema.Types.ObjectId,
			//ref:"User",
		//},
	messages:[],
	
});

module.exports = mongoose.model("Chat", ChatSchema);