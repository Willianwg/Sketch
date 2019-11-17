import React, { useState, useEffect } from "react";
import { AsyncStorage, ScrollView, KeyboardAvoidingView, View, Text, TextInput, StyleSheet, Image, TouchableOpacity  } from "react-native"; 
import api from "../services/api";

import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

import { AntDesign } from "@expo/vector-icons";

export default function NewPost({ navigation }){ 
	const [ image, setImage ] = useState({});
	const [ description, setDescription ] = useState("");
	
	useEffect( () =>{
		//getImage();
	}, [ ] ); 
	
	async function getImage(){
			try {
				const selectedImage = await ImagePicker.launchImageLibraryAsync({
					mediaTypes:ImagePicker.MediaTypeOptions.Images,
					allowsEditing:true,
					quality:1,
				});
				if( selectedImage.uri ){
					selectedImage.name = selectedImage.uri.substring(selectedImage.uri.length - 15);
					setImage(selectedImage);
				};
			}catch(err){
				alert(err);
			};
		};
	
	async function upload(){
		if(!image.name) return;
		try {
		const user_id = await AsyncStorage.getItem("user");
		const data = new FormData();
		const newImage ={ ...image, type:"image/jpeg" };
		
		data.append("description", description );
		data.append("image",newImage);
		
		const response = await api.post("/posts", data,{
			headers:{
				user_id,
			},
		});
		//alert(JSON.stringify(response.data)); 
		navigation.navigate("Dashboard");
		}catch(err){
			alert(err);
		};
	};
	
	return(
		<KeyboardAvoidingView style={ styles.container } behavior="padding">
		<ScrollView style={{ flex:1 }} >
			<View style={ styles.form } >
				{ !image.name && <View style={{ height:300, width:"100%", backgroundColor:"#f3f3f3" }} /> }
				{ image.name && <Image source={{ uri: image.uri }} style={{ height:300, width:"100%" , resizeMode:"cover" }} /> }
				<View style={{ flexDirection:"row" }} >
				<Text style={{ fontWeight:"bold", fontSize:15, marginTop:20, flex:1}}>Description:</Text>
				<TouchableOpacity onPress={ getImage }>
					<AntDesign name="retweet" size={ 16 } color="black"  />
				</TouchableOpacity>
				</View>
				<TextInput 
					value={ description }
					placeholder="Insira uma descrição..." 
					onChangeText={ setDescription }
					multiline={ true }
					style={ styles.input } 
				/>
				
			</View>
			
			</ScrollView>
			<View style={{ alignItems:"flex-end", justifyContent:"flex-end"}} >
				<TouchableOpacity  onPress={ upload } style={ styles.button }>
					<Text style={ styles.buttonText } >Post</Text> 
				</TouchableOpacity>
				</View>
		</KeyboardAvoidingView>
	);
 };
 
 const styles = StyleSheet.create({
	container:{
		flex:1,
		justifyContent:"center",
		alignItems:"stretch",
	},
	form:{
		flex:1,
		marginTop:35,
		paddingHorizontal:5,
	},
	input:{
		backgroundColor:"#f3f3f3",
		paddingHorizontal:8,
		height:70,
	},
	button:{
		alignItems:"center",
		justifyContent:"center",
		height:44,
		width:"100%",
		borderRadius:5,
		backgroundColor:"blue",
		
	},
	buttonText:{
		color:"white",
		fontWeight:"bold",
		
	},
}); 