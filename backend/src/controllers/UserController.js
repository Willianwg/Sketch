const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcryptjs");

module.exports={
	
	async index(req, res){
		const user = await User.find();
		return res.json(user);
	},
	
	async store(req, res){
		const { email } = req.body;
		const { password } = req.body;
		let user = await User.findOne({ email }).select("+password");
		
		if(!user){
			user = await User.create(req.body);
			user.password = undefined;
			return res.json(user);
		}
		if(! await bcrypt.compare(password, user.password) )
			return res.status(400).send({ error:"Invalid password" });
			
		user.password = undefined;
		return res.json(user);
	},
	
	async show(req, res){
		const { user_id } = req.params;
		const user = await User.findById(user_id);
		
		if(!user)
			return res.status(400).send({ error:"user not found" });
			
		return res.json(user);
	},
	
	
};