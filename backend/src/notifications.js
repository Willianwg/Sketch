const { Expo } = require("expo-server-sdk");
const User = require("./models/User");

module.exports = async function(target_id, data){
	const user = await User.findById(target_id);
	const { pushToken } = user;
	
	const expo = new Expo();
	
	const message ={
  	  to: pushToken,
   	 sound: 'default',
   	 body: data.message,
	    data: { withSome: 'data' },
	}

	try {
	const ticketChunk = await expo.sendPushNotificationsAsync([ message ]);
	console.log(ticketChunk);
   }catch(err){
   	console.log(err);
  }
};
