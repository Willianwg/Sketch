const { Expo } = require("expo-server-sdk");
const User = require("./models/User");
const Cryptr = require("cryptr");
const cryptr = new Cryptr(process.env.SECRET);

module.exports = async function(data){
	const sender = await User.findById(data.from);
	const { username } = sender;
	
	const target = await User.findById(data.to);
	const { pushToken } = target;
	
	const expo = new Expo();
	const decrypted = cryptr.decrypt(data.message);
	
	const message ={
		to: pushToken,
		sound: "default",
		body:`${ username }: ${ decrypted }`,
	}

	try {
	const ticketChunk = await expo.sendPushNotificationsAsync([ message ]);
	console.log(ticketChunk);
   }catch(err){
   	console.log(err);
  }
};
