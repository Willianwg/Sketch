import React, { useState, useEffect } from "react"; 
import { View, AsyncStorage, ScrollView, Text, Image, StyleSheet, TouchableOpacity } from "react-native"; 
import UserPosts from "../components/userposts";
import api from "../services/api";
import { AntDesign } from "@expo/vector-icons";
import Header from "../components/profileHeader";

import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

export default function Profile({ navigation }){ 
	const [ image, setDraw ] = useState({});
	const [ user, setUser] = useState({});
	const [ user_id, setUserId ] = useState("");
	
	
	useEffect( () =>{
		async function loadUser(){
			const user = await AsyncStorage.getItem("user");
			setUserId(user);
			
			const response = await api.get(`/users/${ user }`);
			const { data } = response;
			
			setUser(data);
			
		};
		loadUser();
	}, [ ] ); 
	
	
	async function saveAvatar(avatar=image){
		if(!avatar.name) return;
		
		try {
		const data = new FormData();
		
		const newAvatar ={ ...avatar, type:"image/jpeg" };
	
		data.append("avatar",newAvatar);
		
		const response = await api.post(`/users/${ user_id }/avatar`, data);
		
		
		setUser(response.data);
		//alert(JSON.stringify(response.data)); 
		
		}catch(err){
			alert(err);
		};
	};
	
	async function getImage( uploadAvatar=false){
		const selectedImage = await ImagePicker.launchImageLibraryAsync({
			mediaTypes:ImagePicker.MediaTypeOptions.Images,
			allowsEditing:true,
			quality:1,
		});
		if( selectedImage.cancelled ) return;
		selectedImage.name = selectedImage.uri.substring(selectedImage.uri.length - 15);
		//alert(JSON.stringify(selectedImage));
		setDraw(selectedImage); 
		
		if(uploadAvatar){
			saveAvatar(selectedImage);
		};
	};
	
	return(
		<View style={ styles.container } >
			<Text style={ styles.bio } >Aqui iria alguma descrição/Bio do perfil, para que possam dar boas vindas, contato ou apenas se apresentar</Text> 
			<UserPosts id={ user_id } />
			<Header image={{ uri:user.avatar_url }} style={ styles.avatar } username={ user.username } getImage={ getImage }/>
		</View>
	); 
};

const styles = StyleSheet.create({
	container:{
		flex:1,
		alignItems:"center",
	},
	bio:{
		color:"grey",
		fontWeight:"bold",
		paddingHorizontal:15,
		marginTop:150,
		textAlign:"center",
	},
}); 