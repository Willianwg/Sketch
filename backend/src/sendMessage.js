const Chat = require("./models/Chat");
const Cryptr = require("cryptr");
const cryptr = new Cryptr(process.env.SECRET);

module.exports = async function sendMessage(user, data, io){
	const chat = await Chat.findOne().all('users', [data.to, data.from]);
	const encrypted = cryptr.encrypt(data.message);
	data.message = encrypted;
	if(!chat)
		return await Chat.create({ users:[data.to, data.from], messages:[data] });
		
	chat.messages.push(data);
	
	await chat.save();
		
	io.to(user).emit("Message", data.message);
};