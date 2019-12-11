import React, { useState, useEffect } from "react"; 
import { AsyncStorage, KeyboardAvoidingView, View, Image, StyleSheet, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator } from "react-native"; 
// import socketio from "socket.io-client";
import api from "../services/api";

export default function ChatList({ navigation }){
	const [ user_id, setUserId ] = useState("");
	const [ chat, setChat ] = useState([]);
	const [ loading, setLoading ] = useState(true);
	
	async function navigate(talkingTo){
		navigation.navigate("Inbox",{ talkingTo:talkingTo.user });
	};
	useEffect( () =>{
		async function getChatt(){
			const chatData= await AsyncStorage.getItem("chat");
			if(chatData){
				const parsed = JSON.parse(chatData);
				setChat(parsed);
			};
		
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
			await AsyncStorage.setItem("chat", JSON.stringify(filtered));
			setLoading(false);
			setChat(filtered);
		};
		
		getChatt();
		//socket.on("previousMessages", data=>setMessages(data));
	}, [ ] ); 
	
	function Item({ item }){
		
		return (
			<View style={ styles.itemContainer } >
				<Image source={{ uri:item.user.avatar_url }} style={ styles.avatar }  />
				<TouchableOpacity  onPress={()=>navigate(item)} style={{ flex:1, alignSelf:"center" }} >
					<Text style={{ marginLeft:8, fontSize:18, lineHeight:30, fontWeight:"bold"}}>
						{ item.user.username }
					</Text>
					<Text style={{ marginLeft:8, color:"grey", fontSize:14 }}>{ item.messages[ item.messages.length -1 ].message }</Text>
				</TouchableOpacity  >
			</View>
		);
	};
	
	return(
		<View style={ styles.container } >
			<FlatList
				data={ chat }
				keyExtractor={(item, index) =>String(index)}
				renderItem={ Item }
				ListFooterComponent={ loading && <ActivityIndicator size="small" color="grey"  style={{ marginVertical:30 }}/> }
				initialNumToRender={ 5 }
				maxToRenderPerBatch={ 5 }
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
		height:50,
		width:50,
		borderRadius:25,
		
	},
	itemContainer:{
		alignItems:"center",
		flexDirection:"row",
		padding:10,
		
	},
}); 