import React, { useState, useEffect, useMemo } from "react"; 
import { AsyncStorage, KeyboardAvoidingView, View, StyleSheet, Text, FlatList, TextInput, TouchableOpacity } from "react-native"; 
import socketio from "socket.io-client";

export default function Inbox({ navigation }){
	const [ messages, setMessages ] = useState([]);
	const [ newMessage, setNewMessage ] = useState("");
	const [ user_id, setUserId ] = useState("");
	const [ list , setList ] = useState("");
	const talkingTo = navigation.getParam("talkingTo");
	
	const socket = useMemo(()=>socketio("http://localhost:3001", { query:{ user_id } }), [ user_id ]);
	
	useEffect( () =>{
		
		async function loadChat(){
			const user = await AsyncStorage.getItem("user");
			setUserId(user);
			const chat = await AsyncStorage.getItem("chat");
			if(! chat) return;
			
			const parsed = JSON.parse(chat);
			const inbox = parsed.find(item =>item.user._id === talkingTo._id);
			if(inbox)
				setMessages(inbox.messages);
				
			};
			
		loadChat();
		socket.on("Message", data=>alert(JSON.stringify(data)) );
		
	}, [ ] ); 
	
	function sendMessage(){
		if(! newMessage.trim() ) return;
		const message ={ to:talkingTo._id, message:newMessage.trim(), from:user_id };
		
		setMessages([...messages, message]);
		
		socket.emit("newMessage", message);
		
		setNewMessage(" ");
		storeMessage(message);
	};
	
	
	async function storeMessage(message){
		const chat = await AsyncStorage.getItem("chat");
		if(! chat){
			const newChat = [{ user:talkingTo, messages:[ message ] }];
			return AsyncStorage.setItem("chat", JSON.stringify(newChat));
		};
		
		const chatParsed = JSON.parse(chat);
		const currentInboxSaved = chatParsed.find(item=>item.user._id === talkingTo._id);
		
		if(! currentInboxSaved ){
			const currentInbox = { user:talkingTo, messages:[ message ] };
			chatParsed.push(currentInbox);
			return AsyncStorage.setItem("chat", JSON.stringify(chatParsed));
		}
		
		const updatedChat = chatParsed
		.map( item=>{
			if( item.user._id === talkingTo._id )
				item.messages.push(message);
					
			return item;
		});
		await AsyncStorage.setItem("chat", JSON.stringify(updatedChat));
	};
	
	function end(){
		list.scrollToEnd();
	};
	
	return(
		<View style={ styles.container } >
			<Text style={{ alignSelf:"center", fontWeight:"bold", marginBottom:10 }} >Chat</Text>
			<FlatList
				ref={ setList }
				data={ messages }
				onEndReached={ end }
				onEndReachedThreshold={ 0.1 }
				keyExtractor={ (item, index)=>String(index) }
				renderItem={({ item, index })=>(
				<View style={{ flex:1 }} >
				{ item.from !== user_id && <View style={[styles.messageContainer,{ backgroundColor:"#929292", alignSelf:"flex-start" }]}><Text style={ styles.receivedMessage }>{ item.message }</Text></View>}
				
				{ item.from === user_id && <View style={[styles.messageContainer,{ backgroundColor:"black", alignSelf:"flex-end" }]}><Text style={ styles.myMessage } >{ item.message }</Text></View>	}
				
				</View>
				)}
			/>
			<KeyboardAvoidingView style={{ flexDirection:"row", paddingHorizontal:5 }} behavior="padding">
				<TextInput 
					value={ newMessage } 
					placeholder="Text" 
					onChangeText={ setNewMessage } 
					style={ styles.input } 
				/>
				<TouchableOpacity onPress={ sendMessage } style={ styles.button } >
					<Text style={{ color:"white" }} >Ok</Text>
				</TouchableOpacity >
			</KeyboardAvoidingView>
		</View>
	); 
};

const styles = StyleSheet.create({
	container:{
		flex:1,
		paddingTop:45,
		paddingBottom:5,
	},
	messageContainer:{
		alignItems:"center",
		justifyContent:"center",
		borderRadius:10,
		padding:10,
		margin:3,
	},
	receivedMessage:{
		color:"white",
		fontSize:16,
	},
	myMessage:{
		margin:3,
		color:"white",
		fontSize:16,
	},
	input:{
		flex:1,
		backgroundColor:"#E3E3E3",
		paddingHorizontal:10,
		borderRadius:17,
		height:35,
	},
	button:{
		padding:8,
		backgroundColor:"black",
		borderRadius:17,
		height:35,
		marginLeft:2, 
	},
}); 