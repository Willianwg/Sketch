const FriendRequest = require("../models/FriendRequest");

module.exports ={
	async store(req, res){
		const { request_id } = req.params;
		
		await FriendRequest.findByIdAndRemove(request_id);
		
		return res.send();
	},
	
};