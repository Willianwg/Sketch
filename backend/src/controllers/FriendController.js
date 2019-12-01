const FriendRequest = require("../models/FriendRequest");
const User = require("../models/User");

module.exports = {
	async show (req, res){
		const { user_id } = req.params;
		const user = await User.findById(user_id);
		
		if(! user)
			return res.status(400).send({ error:"User not found" });
			
		const requests = await FriendRequest.find({ to:user_id }).populate("from").exec();
		
		await user.populate("friends").execPopulate();
		const friends = user.friends;
		
		const friendList = {
			friends,
			requests
		};
		
		return res.json(friendList);
	},
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