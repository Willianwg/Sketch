const express = require("express");
const socketio = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const http = require("http");

const sendMessage = require("./sendMessage");
const Chat = require("./models/Chat");

const routes = require("./routes");

const app = express();
const server = http.Server(app);
const io = socketio(server);

mongoose.connect("mongodb+srv://user:qwer1245@cluster0-x73mg.mongodb.net/sketch?retryWrites=true&w=majority",{ useNewUrlParser:true, useUnifiedTopology:true });

let users= { };
const messages = [ ];

io.on("connection", socket=>{
	const { user_id } = socket.handshake.query;
	users[user_id] = socket.id;
	console.log(socket.id,": conectado");
	
	socket.emit("previousMessages", messages);
	
	socket.on("newMessage", data=>{
		messages.push(data);
		sendMessage(users[data.to], data, io);
		
	});
	
	socket.on("disconnect", data=>{
		console.log(socket.id,": desconectado");
		users[user_id] = undefined;
		console.log(users[user_id] );
	});
	
});

app.use(cors());
app.use(express.json());
app.use("/files", express.static(path.resolve(__dirname, "..","uploads")));
app.use(routes);

server.listen(3001);