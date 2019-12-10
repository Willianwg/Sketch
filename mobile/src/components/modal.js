import React, { useState, useEffect } from "react"; 
import { AsyncStorage, View, Text, StyleSheet, Image, TextInput, TouchableOpacity } from "react-native"; 
import api from "../services/api";
import * as ImageManipulator from 'expo-image-manipulator';

export default function SelectedImageModal({ image, navigation, setVisibility }){ 
	const [ description, setDescription ] = useState("");
	
	
	async function formatImageAndUpload(){
		let imageProps = image;
		if( imageProps.height > 1000 && imageProps.width > 1000)
			imageProps = await ImageManipulator.manipulateAsync(image.uri, [{ resize:{ height:400 }}] );
			
		const selectedImage ={ ...imageProps, type:"image/jpeg" };
		selectedImage.name = selectedImage.uri.substring(selectedImage.uri.length - 15);
		
		upload(selectedImage);
	};
	
	async function upload(selectedImage){
		if(!selectedImage.name) return;
		try {
		const user_id = await AsyncStorage.getItem("user");
		const data = new FormData();
		
		data.append("description", description );
		data.append("image", selectedImage);
		
		const response = await api.post("/posts", data,{
			headers:{
				user_id,
			},
		});
		//alert(JSON.stringify(response.data)); 
		navigation.navigate("Dashboard");
		setVisibility(false);
		}catch(err){
			alert(err);
		};
	};
	
	return(
		<View style={ styles.container } >
			<Image source={{ uri:image.uri }} style={ styles.image } />
			<TextInput 
				value={ description }
				onChangeText={ setDescription }
				placeholder="Description..." 
				placeholderTintColor="white"
				style={ styles.input } 
			/>
			<TouchableOpacity onPress={ formatImageAndUpload } style={ styles.button } >
				<Text style={styles.buttonText}>Post</Text> 
			</TouchableOpacity>
		</View>
	);
 } 
 
 const styles = StyleSheet.create({
	container:{
		flex:1,
	},
	image:{
		height:"70%",
		width:"100%",
		resizeMode:"contain"
	},
	input:{
		flex:1,
		backgroundColor:"#030303",
		color:"white",
	},
	button:{
		alignItems:"center",
		justifyContent:"center",
		alignSelf:"flex-end",
		marginLeft:10,
		backgroundColor:"blue",
		height:40,
		width:60,
		borderRadius:5,
		position:"absolute",
		bottom:5,
		right:5
	},
	buttonText:{
		fontWeight:"bold",
		color:"white"
	},
}); 