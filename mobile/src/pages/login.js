import React, { useState, useEffect } from "react"; 
import { View, AsyncStorage, Image, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native"; 
import api from "../services/api";
import logo from "../sketch2.png";


export default function Login({ navigation }){ 
	const [username, setUser] = useState("");
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
	
	useEffect(() =>{
		async function getUserId(){
			const userId = await AsyncStorage.getItem("user");
			if(userId){
				navigation.navigate("Dashboard");
			};
		};
		getUserId();
	}, [ ] ); 
	
	async function enterUser(){
		if(!username.trim() || !password ) return;
		
		const response = await api.post("/users",{ 
			email,
			username,
			password,
		});
		
		const { data } = response;
		await AsyncStorage.setItem("user", data._id);
		navigation.navigate("Dashboard");
	};
	
	
	
	return(
		<KeyboardAvoidingView style={ styles.container} behavior="padding">
		
			<Image style={ styles.logo }  source={ logo } alt="logo"/>
			<View style={styles.form} >
				<TextInput 
					value={ email }
					keyboardType="email-address"
					autoCapitalize="none"
					placeholder="Email" 
					autoCorrect={ false }
					style={ styles.input } 
					onChangeText={ setEmail }
				/>
				<TextInput 
					value={ username }
					autoCapitalize="none"
					placeholder="Username" 
					style={ styles.input } 
					onChangeText={ setUser }
				/>
				<TextInput 
					value={ password }
					autoCapitalize="none"
					secureTextEntry={true} 
					placeholder="Password" 
					style={ styles.input } 
					onChangeText={ setPassword }
				/>
				<TouchableOpacity style={ styles.button } onPress={ enterUser } >
					<Text style={ { color:"white" } } >SingIn</Text> 
				</TouchableOpacity> 
			</View>
		</KeyboardAvoidingView> 
	); 
};

const styles = StyleSheet.create({
  container: {
	flex: 1,
    backgroundColor: "#000",
    alignItems: 'center',
    justifyContent: 'center',
  },
  form:{
 	alignSelf:"stretch",
 	paddingHorizontal:30,
 	marginTop:20,
  },
  logo:{
	height:200,
	width:200,
	resizeMode:"contain",
 },
  input:{
	height:40,
	marginBottom:15,
	paddingHorizontal:10,
	color:"white",
	borderBottomWidth:1,
	borderBottomColor:"grey",
  },
  button:{
  	alignItems:"center",
  	justifyContent:"center",
  	height:50,
 	backgroundColor:"blue",
	 borderRadius:6,
  },
  

});