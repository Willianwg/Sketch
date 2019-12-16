const Chat = require("./models/Chat");
const Cryptr = require("cryptr");
const cryptr = new Cryptr(process.env.SECRET);

module.exports = async function sendMessage(user, data, io){
	const chat = await Chat.findOne().all('users', [data.to, data.from]);
	if(!chat)
		return await Chat.create({ users:[data.to, data.from], messages:[data] });
		
	chat.messages.push(data);
	
	await chat.save();
		
	data.message = cryptr.decrypt(data.message);
	io.to(user).emit("Message", data);
};