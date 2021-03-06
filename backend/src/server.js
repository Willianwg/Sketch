const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const socketio = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const http = require("http");

const sendMessage = require("./sendMessage");
const sendNotification = require("./notifications");
const Chat = require("./models/Chat");
const Cryptr = require("cryptr");
const cryptr = new Cryptr(process.env.SECRET);

const routes = require("./routes");

const app = express();
const server = http.Server(app);
const io = socketio(server);

mongoose.connect(process.env.MONGO_DATABASE, { useNewUrlParser:true, useUnifiedTopology:true });

let users= { };

io.on("connection", socket=>{
	const { user_id } = socket.handshake.query;
	users[user_id] = socket.id;
	
	socket.on("newMessage", data=>{
		data.message = cryptr.encrypt(data.message);
		if(! users[data.to]){
			console.log("PASSOU: ", users[data.to]);
			sendNotification(data);
		}
		sendMessage(users[data.to], data, io);
	});
	
	socket.on("disconnect", data=>{
		delete users[user_id];
	});
	
});

app.use(cors());
app.use(express.json());
app.use("/files", express.static(path.resolve(__dirname, "..","uploads")));
app.use(routes);

server.listen(3001);