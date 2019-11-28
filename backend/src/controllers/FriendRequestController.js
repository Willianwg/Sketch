const FriendRequest = require("../models/FriendRequest");

module.exports = {
	async store(req, res){
		const { user_id } = req.headers;
		const { target_id } = req.params;
		
		const request = await FriendRequest.create({
			from:user_id,
			to:target_id,
		});
		
		return res.json(request)
	},
	
}