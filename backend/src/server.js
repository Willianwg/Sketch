const express = require("express");
const socketio = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const http = require("http");

const routes = require("./routes");

const app = express();
const server = http.Server(app);
const io = socketio(server);

mongoose.connect("mongodb+srv://user:qwer1245@cluster0-x73mg.mongodb.net/sketch?retryWrites=true&w=majority",{ useNewUrlParser:true, useUnifiedTopology:true });

const users={};
const messages = [ ];

io.on("connection", socket=>{
	const { user_id } = socket.handshake.query;
	users[user_id] = socket.id;
	
	const previousMessages = messages.filter(item=>{
		if(item.to[user_id])
			return item;
	});
	if(previousMessages){
		io.to(users[user_id]).emit("previousMessages", previousMessages);
	};
	
	socket.on("newMessage", data=>{
		console.log(data);
		messages.push(data);
	});
	
});

app.use(cors());
app.use(express.json());
app.use("/files", express.static(path.resolve(__dirname, "..","uploads")));
app.use(routes);

server.listen(3001);