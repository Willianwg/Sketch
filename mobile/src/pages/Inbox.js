import React, { useState, useEffect, useMemo } from "react"; 
import { AsyncStorage, KeyboardAvoidingView, View, StyleSheet, Text, FlatList, TextInput, TouchableOpacity } from "react-native"; 
import socketio from "socket.io-client";

export default function Inbox({ navigation }){
	const [ messages, setMessages ] = useState([]);
	const [ newMessage, setNewMessage ] = useState("");
	const [ user_id, setUserId ] = useState("");
	const [ list , setList ] = useState("");
	
	const socket = useMemo(()=>socketio("http://localhost:3001", { query:{ user_id } }), [ user_id ]);
	
	useEffect( () =>{
		AsyncStorage.getItem("user").then(user=>setUserId(user));
		
		socket.on("previousMessages", data=>setMessages(data));
	}, [ ] ); 
	
	function sendMessage(){
		const message ={ to:navigation.getParam("talkingTo")._id, message:newMessage };
		
		setMessages([...messages, message]);
		
		socket.emit("newMessage", message);
		
		setNewMessage(" ");
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
				onEndReachedThreshold={ 1 }
				keyExtractor={ (item, index)=>String(index) }
				renderItem={({ item, index })=>(
				<View style={{ flex:1 }} >
				{ item.to === user_id && <View style={[styles.messageContainer,{ backgroundColor:"#929292", alignSelf:"flex-start" }]}> <Text style={ styles.receivedMessage } >{ item.message }</Text></View>	}
				
				{ item.to !== user_id && <View style={[styles.messageContainer,{ backgroundColor:"black", alignSelf:"flex-end" }]}><Text style={ styles.myMessage } >{ item.message }</Text></View>	}
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
		paddingHorizontal:5,
	},
	button:{
		padding:8,
		backgroundColor:"black",
		borderRadius:5,
	},
}); 