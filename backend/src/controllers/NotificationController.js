const User = require("../models/User");

module.exports ={
	async store(req, res){
		const { token } = req.body;
		const { user_id } = req.headers;
		
		const user = await User.findById(user_id);
		
		user.pushToken = token;
		await user.save();
		
		return res.json(user);
	},
	
	
};