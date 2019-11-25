const User = require("../models/User");
const Chat = require("../models/Chat");

module.exports={
	
	async index(req, res){
		const { _id } = req.headers;
		//const user = await User.find({ _id });
		const chat = await Chat.find({ users:_id }); 
		if(!chat){
			// await Chat.create({ user:[_id], messages:[] });
			return res.json({ error:"Not chat found", id:`${_id}` });
		};
		
		return res.json(chat);
	},
	async store(req,res){
		const { _id } = req.headers;
		let chat = await Chat.find({ users:_id });
		if(!chat){
			chat = await Chat.create({ users:[_id] });
			
			return res.json(chat);
		}
		
			return res.json(chat);
	},
	
	async test(req, res){
		const { _id } = req.headers;
		const chat = await Chat.find({ users:_id }).populate("users").exec();
		
		if(!chat)
			return res.json({ error:"Not chat found", id:`${_id}` });
		
		return res.json(chat);
	},
	
};