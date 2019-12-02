import React, { useState, useEffect } from "react"; 
import { View, Text, Image, FlatList, StyleSheet, TextInput, TouchableOpacity } from "react-native"; 
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
					<View style={ styles.requestContainer} >
						<Image source={{ uri:item.from.avatar_url }} style={ styles.avatar } />
						<View style={{ flex:1 }} >
							<Text style={ styles.username } >{ item.from.username }</Text>
							<View style={{ flexDirection:"row", flex:1, alignItems:"flex-end", justifyContent:"space-between"}} >
								<TouchableOpacity style={[ styles.button, { backgroundColor:"#6FDC00" }] } ><Text style={ styles.buttonText } >Accept</Text></TouchableOpacity> 
								<TouchableOpacity style={[ styles.button, { backgroundColor:"#E40C00" }]  } ><Text style={ styles.buttonText } >Delete</Text></TouchableOpacity> 
							</View>
						</View>
					</View>
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
	requestContainer:{
		padding:5,
		marginTop:15,
		flexDirection:"row",
	
		borderRadius:8,
		height:90,
	},
	avatar:{
		alignSelf:"center",
		width:80,
		height:80,
		borderRadius:40,
		marginHorizontal:5,
	},
	username:{
		fontWeight:"bold",
		fontSize:16,
	},
	button:{
		alignItems:"center",
		justifyContent:"center",
		width:"45%",
		height:40,
		borderRadius:10,
	},
	buttonText:{
		color:"white",
		fontWeight:"bold",
		
	},
}); 