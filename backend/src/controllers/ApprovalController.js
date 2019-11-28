const FriendRequest = require("../models/FriendRequest");

module.exports ={
	async store(req, res){
		const { request_id } = req.params;
		
		const request = await FriendRequest.findById(request_id);
		
		request.approved = true;
		await request.save();
		
		return res.json(request);
	},
	
};