import React, { useState, useEffect } from "react";
import { withNavigationFocus } from "react-navigation";
import { ImageBackground, AsyncStorage, ScrollView, KeyboardAvoidingView, View, Text, TextInput, StyleSheet, Image, TouchableOpacity, FlatList  } from "react-native"; 
import camera from "../assets/camera.svg";

import api from "../services/api";

import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from "expo-media-library";
import * as Permissions from "expo-permissions";

import { Camera } from 'expo-camera';

import { Ionicons, FontAwesome } from "@expo/vector-icons";

function NewPost({ navigation }){ 
	const [ image, setImage ] = useState({});
	const [ description, setDescription ] = useState("");
	const [ gallery, setGallery ] = useState([]);
	const [ lastImage, setLastImage ] = useState(0);
	
	 const [ cameraPermission, setPermission ] = useState(false);
	const [ camera, setCamera ] = useState("");
	const [ type, setType ] = useState(Camera.Constants.Type.back);
	const [ ratio, setRatio ] = useState("4:3");
	
	const [ open, setOpen ] = useState(true);
	const back = Camera.Constants.Type.back;
	const front = Camera.Constants.Type.front;
	
	useEffect( () =>{
		//getImage();
		getLibrary();
	
	}, [ ] ); 
	
	async function  getLibrary(afterNumber=lastImage){ 
			const { status } = await Permissions.askAsync(Permissions.CAMERA);
			setPermission(status === "granted"); 
			
			const { assets } = await MediaLibrary.getAssetsAsync({ first:10 , after:String(afterNumber) });
			//alert(JSON.stringify(photos));
			lastImage?setGallery([...gallery, ...assets]):setGallery(assets);
			setLastImage(lastImage+10);
			
		};
		
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
	
	function changeCamera(){
		if( type === front ){
			setType(back);
			setRatio("4:3");
		} else {
			setType(front);
			setRatio("16:9");
		};
	};
	
	return(
	
		<KeyboardAvoidingView  behavior="padding" style={ styles.container } >
			{ navigation.isFocused() && 
				<Camera 
					style={ styles.camera } 
					type={ type }
					ratio={ ratio }
					ref={ ref=>setCamera(ref) }
				/>
           }
           <FlatList
           	showsHorizontalScrollIndicator={ false }
           	contentContainerStyle={{ justifyContent:"flex-end", alignItems:"flex-end" }}
           	style={ styles.list } 
				data={ gallery }
				keyExtractor={ (item, index)=>String(index) }
				horizontal
				renderItem={({ item })=>(
					<Image source={{ uri:item.uri }} style={{ height:60, width:60, margin:3, resizeMode:"cover", borderWidth:1, borderColor:"grey"}} /> 
				)}
				onEndReached={ ()=>getLibrary(lastImage) }
				onEndReachedThreshold={ 0.2 }
			/>
				
           <View style={ styles.optionsContainer } >
           
           <Text style={{ fontSize:60, color:"white", flex:1 }}>☆</Text> 
           
       	    <TouchableOpacity style={{ flex:1  }}  onPress={ async ()=>{ const foto = await camera.takePictureAsync({ quality:1 }); alert(JSON.stringify(foto));  }} >
					<FontAwesome name="circle" size={ 60 } color="white" /> 
				</TouchableOpacity >
				
				<TouchableOpacity style={ styles.takePicture }  onPress={ changeCamera }>
					<Ionicons name="ios-reverse-camera" size={ 60 } color="white" /> 
				</TouchableOpacity >
				
			</View>
		</KeyboardAvoidingView>
	
	);
 };
 
 export default withNavigationFocus(NewPost);
 
 const styles = StyleSheet.create({
	container:{
		flex:1,
		alignItems:"center",
		justifyContent:"flex-end",
		backgroundColor:"white",
	},
	camera:{
		flex: 1,
		height:"100%",
		width:"100%" ,
		position:"absolute",
	},
	list:{
		flex:1,
		flexGrow:0.12,
		height:100,
		backgroundColor:"transparent",
		
		marginBottom:10,
	},
	optionsContainer:{
		flex:0.1,
		paddingHorizontal:10,
		flexDirection:"row",
		backgroundColor:"transparent",
		marginVertical:10,
		justifyContent:"space-around",
		alignItems:"center",
	},
	takePicture:{
		
	},
}); 