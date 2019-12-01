import React, { useState, useEffect } from "react"; 
import { View, Text, Image, FlatList, StyleSheet, TextInput } from "react-native"; 
import api from "../services/api";

export default function({ navigation }){ 
	const [ search, setSearch ] = useState("");
	const [ friends, setFriends ] = useState([]);
	const [ requests, setRequests ] = useState([]);
	
	useEffect( () =>{
		async function loadFriends(){
			const user_id = navigation.getParam("user_id");
			const response = await api.get(`/users/${ user_id }/friends`);
			const { data } = response;
			
			//alert(JSON.stringify(data)); 
			setFriends(data.friends);
			setRequests(data.requests);
		};
		loadFriends();
	}, [ ] ); 
	return(
		<View style={ styles.container } >
			<TextInput 
				placeholder="Search..." 
				placeholderTextColor="black"
				onChangeText={ setSearch } 
				style={ styles.input } />
			<FlatList
				data={ requests }
				keyExtractor={(item, index)=>String(index) }
				renderItem={({ item })=>(
					<Text>{ item.from.username }</Text>
				)}
			/>
			{ friends.length <1 && requests.length < 1 && <Text style={{ alignSelf:"center" }} >There  are no friends in your list</Text> }
			<FlatList
				data={ friends }
				keyExtractor={(item, index)=>String(index) }
				renderItem={({ item })=>(
					<Text>{ item.username }</Text>
				)}
			/>
		</View>
	); 
} 

const styles = StyleSheet.create({
	container:{
		paddingTop:50,
		paddingHorizontal:10,
		flex:1,
	},
	input:{
		backgroundColor:"#E3E3E3",
		paddingHorizontal:8,
		borderRadius:6,
		fontSize:16,
	},
}); 