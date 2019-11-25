import React, { useState, useEffect } from "react"; 
import { AsyncStorage, KeyboardAvoidingView, View, Image, StyleSheet, Text, FlatList, TextInput, TouchableOpacity } from "react-native"; 
// import socketio from "socket.io-client";
import api from "../services/api";

export default function ChatList({ navigation }){
	const [ user_id, setUserId ] = useState("");
	const [ chat, setChat ] = useState([]);
	const [ inboxes, setInbox ] = useState([]);
	
	async function navigate(talkingTo){
		// await AsyncStorage.setItem("chat", JSON.stringify({ ...item.author }) );
		navigation.navigate("Inbox",{ talkingTo:talkingTo.user, previousMessages:talkingTo.messages });
	};
	useEffect( () =>{
		async function getChatt(){
			const chatData= await AsyncStorage.getItem("chat");
			const parsed = JSON.parse(chatData);
			setChat([parsed]);
		
			const _id = await AsyncStorage.getItem("user");
			setUserId(_id);
			
			const response = await api.get("/chat", { headers:{ _id } });
			const { data } = response;
			const filtered = data.map(item=>{
				const { users }= item;
				const user = users.find( object => object._id !== _id);
				const { messages } = item;
				const object = { messages, user };
				return object
			});
			
			setInbox(filtered);
		};
		
		getChatt();
		//socket.on("previousMessages", data=>setMessages(data));
	}, [ ] ); 
	
	function Item({ item }){

		return (
			<View style={ styles.itemContainer } >
				<Image source={{ uri:item.avatar_url }} style={ styles.avatar }  />
				<TouchableOpacity onPress={()=>navigate(item)} style={{ flex:1, alignSelf:"center" }} >
					<Text style={{ marginLeft:8, fontSize:18, lineHeight:30, fontWeight:"bold"}}>
						{ item.username }
					</Text>
				</TouchableOpacity >
			</View>
		);
	};
	
	function Inbox({ item }){
		
		return (
			<View style={ styles.itemContainer } >
				<Image source={{ uri:item.user.avatar_url }} style={ styles.avatar }  />
				<TouchableOpacity onPress={()=>navigate(item)} style={{ flex:1, alignSelf:"center" }} >
					<Text style={{ marginLeft:8, fontSize:18, lineHeight:30, fontWeight:"bold"}}>
						{ item.user.username }
					</Text>
				</TouchableOpacity >
			</View>
		);
	};
	
	return(
		<View style={ styles.container } >
			<FlatList
				data={ chat }
				keyExtractor={(item, index) =>String(index)}
				renderItem={({ item }) => <Item item={item} />}
			/>
			<FlatList
				data={ inboxes }
				keyExtractor={(item, index) =>String(index)}
				renderItem={({ item }) => <Inbox item={item} />}
			/>
		</View>
	); 
};

const styles = StyleSheet.create({
	container:{
		flex:1,
		paddingTop:50,
	},
	avatar:{
		
		marginLeft:10,
		height:40,
		width:40,
		borderRadius:20,
		
	},
	itemContainer:{
		alignItems:"center",
		flexDirection:"row",
		padding:10,
		
	},
}); 