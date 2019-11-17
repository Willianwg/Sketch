const User = require("../models/User");
const path = require("path");
const fs = require("fs");

module.exports = {
	async store(req, res){
		const { user_id } = req.params;
		const { filename } = req.file;
		let user = await User.findById(user_id);
		
		if(!user){
			return res.status(400).send({ error:"user not found" });
		};
		if(user.avatar !== "default-avatar.png"){
			fs.unlink(path.resolve(__dirname,"..","..","uploads",`${user.avatar}`), err=>{
				if(err)
					return console.log("err");
				return console.log("sucesso");
			});
			console.log("Avatar antigo deletado", user.avatar);
		};
		
		user.avatar = filename;
		await user.save();
		
		return res.json(user);
	},
	
};