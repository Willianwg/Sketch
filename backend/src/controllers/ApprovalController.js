const FriendRequest = require("../models/FriendRequest");
const User = require("../models/User");

module.exports ={
	async store(req, res){
		const { user_id } = req.headers;
		const { request_id } = req.params;
		
		const user1 = await User.findById(user_id);
		const request = await FriendRequest.findById(request_id);
		const user2 = await User.findById(request.from);
		
		user1.friends.push(user2._id);
		user2.friends.push(user1._id);
		await user1.save();
		await user2.save();
		
		await request.remove();
		
		return res.send();
	},
	
};