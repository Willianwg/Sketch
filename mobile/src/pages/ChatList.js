import React, { useState, useEffect } from "react"; 
import { AsyncStorage, KeyboardAvoidingView, View, Image, StyleSheet, Text, FlatList, TextInput, TouchableOpacity } from "react-native"; 
import socketio from "socket.io-client";

export default function ChatList({ navigation }){
	const [ user_id, setUserId ] = useState("");
	const [ chat, setChat ] = useState([]);
	
	
	async function navigate(){
		// await AsyncStorage.setItem("chat", JSON.stringify({ ...item.author }) );
		navigation.navigate("Inbox",{ talkingTo:chat });
	};
	useEffect( () =>{
		AsyncStorage.getItem("chat").then(data=>{
			const parsed = JSON.parse(data);
			setChat([parsed]);
		}).catch(err=>console.log(err));
		AsyncStorage.getItem("user").then(user=>setUserId(user));
		
		//socket.on("previousMessages", data=>setMessages(data));
	}, [ ] ); 
	
	function Item({ item }){
		return (
			<View style={ styles.itemContainer } >
				<Image source={{ uri:item.avatar_url }} style={ styles.avatar }  />
				<TouchableOpacity onPress={ navigate } style={{ flex:1, alignSelf:"center" }} >
					<Text style={{ marginLeft:8, fontSize:18, lineHeight:30, fontWeight:"bold"}}>
						{ item.username }
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