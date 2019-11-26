const User = require("../models/User");
const Chat = require("../models/Chat");
const Cryptr = require("cryptr");
const cryptr = new Cryptr(process.env.SECRET);

module.exports={
	
	async index(req, res){
		const { _id } = req.headers;
		const chat = await Chat.find({ users:_id }).populate("users").exec();
		
		if(!chat)
			return res.json({ error:"Not chat found", id:`${_id}` });
		
		const decrypted = chat.map(item=>{
			const messages = item.messages.map(object=>{
				const message = cryptr.decrypt(object.message);
				const formated = { ...object, message };
				
				return formated;
			});
			const { users } = item;
			const finalResult = { users, messages };
			
			return finalResult;
		});
		
		return res.json(decrypted);
	},
	
};