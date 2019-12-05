import React, { useState, useEffect } from "react"; 
import { View, ScrollView, Text, Image, StyleSheet, TouchableOpacity } from "react-native"; 
import UserPosts from "../components/userposts";
import api from "../services/api";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Profile({ navigation }){ 
	const [ user, setUser] = useState({});
	const [ user_id, setUserId ] = useState("");
	
	useEffect( () =>{
		async function loadUser(){
			const user = navigation.getParam("user");
			setUserId(user);
			
			const response = await api.get(`/users/${ user }`);
			const { data } = response;
			
			setUser(data);
		};
		loadUser();
	}, [ ] ); 
	
	return(
		<ScrollView style={ styles.container }>
		<View>
			<Image source={{ uri:user.avatar_url }} style={styles.avatar} />
			<View style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"center"}} >
				<View style={{ flex:1, width:"20%" }} />
				<Text style={ styles.name } >{ user.username }</Text>
				<TouchableOpacity style={{ width:"20%"}} onPress={ ()=>navigation.navigate("Inbox", { talkingTo:user }) }>
					 <Text style={ styles.editLabel } ><MaterialCommunityIcons name="message" size={ 24 } color="grey" /></Text>
				</TouchableOpacity>
			</View>
			<Text style={ styles.bio } >Aqui iria alguma descrição/Bio do perfil, para que possam dar boas vindas, contato ou apenas se apresentar</Text> 
			
			<UserPosts id={ user_id } />
			
		</View>
		</ScrollView>
	); 
};

const styles = StyleSheet.create({
	container:{
		flex:1,
	},
	avatar:{
		flex:1,
		height:500,
		maxHeight:500,
		width:"100%",
		resizeMode:"cover",
		marginBottom:15,
	},
	name:{
		fontSize:30,
		fontWeight:"bold",
		marginRight:15,
		textAlign:"center",
		width:"50%"
		
	},
	editLabel:{
		fontSize:8,
		fontWeight:"normal",
	},
	bio:{
		paddingHorizontal:15
	},
	
}); 