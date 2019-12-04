import React, { useState, useEffect } from "react"; 
import { View, Text, Image, FlatList, StyleSheet, TextInput, TouchableOpacity } from "react-native"; 
import api from "../services/api";

export default function({ navigation }){ 
	const [ search, setSearch ] = useState("");
	const [ friends, setFriends ] = useState([]);
	const [ requests, setRequests ] = useState([]);
	const [ user_id, setId ] = useState("");
	
	useEffect( () =>{
		async function loadFriends(){
			const user = navigation.getParam("user_id");
			const response = await api.get(`/users/${ user }/friends`);
			const { data } = response;
			
			//alert(JSON.stringify(data)); 
			setId(user);
			setFriends(data.friends);
			setRequests(data.requests);
			
		};
		loadFriends();
	}, [ ] ); 
	
	async function acceptRequest(request){
		await api.post(`/friendRequests/${ request._id }/approvals`, {}, { headers:{ user_id } });
		
		const filtered = requests.filter(item=>item._id !== request._id);
		setRequests(filtered);
		setFriends([...friends, request.from]);
	};
	async function rejectRequest(request){
		await api.post(`/friendRequests/${ request._id }/rejections`);
		
		const filtered = requests.filter(item=>item._id !== request._id);
		setRequests(filtered);
	};
	
	
	return(
		<View style={ styles.container } >
			<TextInput 
				placeholder="Search..." 
				placeholderTextColor="black"
				onChangeText={ setSearch } 
				style={ styles.input } />
			{ requests.length>0 && 
				<FlatList
				style={{ flexGrow:0 }}
				data={ requests }
				keyExtractor={(item, index)=>String(index) }
				ListHeaderComponent={ <Text style={{ fontSize:25, color:"grey", fontWeight:"bold"}} >Requests</Text> }
				renderItem={({ item })=>(
					<View style={ styles.requestContainer} >
						<Image source={{ uri:item.from.avatar_url }} style={ styles.avatar } />
						<View style={{ flex:1 }} >
							<Text style={ styles.username } >{ item.from.username }</Text>
							<View style={{ flexDirection:"row", flex:1, alignItems:"flex-end", justifyContent:"space-between"}} >
								<TouchableOpacity style={[ styles.button, { backgroundColor:"#6CD600" }] } onPress={ ()=>acceptRequest(item) } ><Text style={ styles.buttonText } >Accept</Text></TouchableOpacity> 
								<TouchableOpacity style={[ styles.button, { backgroundColor:"#E40C00" }]  } onPress={ ()=>rejectRequest(item) }><Text style={ styles.buttonText } >Delete</Text></TouchableOpacity> 
							</View>
						</View>
					</View>
				)}
				
			/> }
			{ friends.length <1 && requests.length < 1 && <Text style={{ alignSelf:"center" }} >There  are no friends in your list</Text> }
			{ friends.length>0 && 
			<FlatList
				style={{ marginTop:10 }} 
				data={ friends }
				keyExtractor={(item, index)=>String(index) }
				ListHeaderComponent={ <Text style={{ fontSize:25, color:"grey", fontWeight:"bold"}} >Friends</Text> }
				renderItem={({ item })=>(
					<View style={ [styles.requestContainer, { backgroundColor:"white", borderColor:"grey" }] } >
						<Image source={{ uri:item.avatar_url }} style={ styles.avatar } />
						<View style={{ flex:1 }} >
							<Text style={[ styles.username, { color:"black" }] } >{ item.username }</Text>
							<View style={{ flexDirection:"row", flex:1, alignItems:"flex-end", justifyContent:"space-between"}} >
								<TouchableOpacity style={[ styles.button, { backgroundColor:"blue" }] } onPress={ ()=>{} } ><Text style={ styles.buttonText } >Profile</Text></TouchableOpacity> 
								<TouchableOpacity style={[ styles.button, { backgroundColor:"white", borderWidth:1, borderColor:"black"  }]  } onPress={ ()=>navigation.navigate("Inbox", { talkingTo:item }) }><Text style={[ styles.buttonText, { color:"black" }] } >Message</Text></TouchableOpacity> 
							</View>
						</View>
					</View>
				)}
			/> }
			
		</View>
	); 
} 

const styles = StyleSheet.create({
	container:{
		paddingTop:40,
		paddingHorizontal:10,
		flex:1,
		
	},
	input:{
		backgroundColor:"#E3E3E3",
		paddingHorizontal:10,
		borderRadius:17,
		fontSize:16,
		marginBottom:10,
		height:35,
	},
	requestContainer:{
		padding:5,
		flexDirection:"row",
	
		borderRadius:10,
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
		borderRadius:12,
	},
	buttonText:{
		color:"white",
		fontWeight:"bold",
		
	},
}); 