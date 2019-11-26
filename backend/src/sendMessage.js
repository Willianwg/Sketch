const Chat = require("./models/Chat");
const Cryptr = require("cryptr");
const cryptr = new Cryptr(process.env.SECRET);

module.exports = async function sendMessage(user, data, io){
	const chat = await Chat.findOne().all('users', [data.to, data.from]);
	if(!chat){
		const encrypted = cryptr.encrypt(data.message);
		data.message = encrypted;
		return await Chat.create({ users:[data.to, data.from], messages:[data] });
	}
	const encrypted = cryptr.encrypt(data.message);
	data.message = encrypted;
	chat.messages.push(data);
	
	await chat.save();
		
	io.to(user).emit("Message", data.message);
};