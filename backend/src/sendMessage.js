const Chat = require("./models/Chat");

module.exports = async function sendMessage(user, data, io){
	//if(user === undefined){
		// const chat = await Chat.findOne({ to:data.to, from:data.from });
		const chat = await Chat.findOne().all('users', [data.to, data.from]);
		if(!chat){
			console.log("feijao");
			// return await Chat.create({ to: data.to, from:data.from, messages:[data.message]});
			return await Chat.create({ users:[data.to, data.from], messages:[data] });
		}
		chat.messages.push(data);
		console.log("arroz");
		await chat.save();
		//return;
	//};
	//console.log("batataooo:  ", user);
	io.to(user).emit("Message", data.message);
};