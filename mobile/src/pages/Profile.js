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
			<View >
				<View style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"center"}} >
					<View style={{ flex:1, width:"20%" }} />
					<Text style={ styles.name } >{ user.username }</Text>
					<TouchableOpacity style={{ width:"20%"}} onPress={ ()=>getImage(true) }>
						<Text style={ styles.editLabel } ><AntDesign name="edit" size={ 24 } color="white" /> Edit</Text>
					</TouchableOpacity>
				</View>
				<Text style={ styles.bio } >Aqui iria alguma descrição/Bio do perfil, para que possam dar boas vindas, contato ou apenas se apresentar</Text> 
			
				<UserPosts id={ user_id } />
				<Header image={{ uri:user.avatar_url }} style={ styles.avatar } username={ user.username } getImage={ getImage }/>
				<View style={ styles.teste } >
				<Text style={ styles.username } >LALALALALALALA</Text>
				</View>
			</View>
		</View>
	); 
};

const styles = StyleSheet.create({
	container:{
		flex:1,
		alignItems:"center",
		justifyContent:"center",
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
		width:"50%",
		zIndex:-1,
		marginTop:110,
		opacity:0,
		
	},
	editLabel:{
		fontSize:8,
		fontWeight:"normal",
		color:"white",
	},
	bio:{
		paddingHorizontal:15
	},
	username:{
		fontSize:24,
		fontWeight:"bold",
		color: "red", 
  },
  teste:{
  	flex:1,
		textShadowColor:"#0005FF",
		textShadowOffset:{
			width:15,
			height:8,
		},
		elevation:6,
		backgroundColor:"white",
	}
}); 