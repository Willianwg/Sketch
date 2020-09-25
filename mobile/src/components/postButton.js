import React from "react"; 
import { Text, TouchableOpacity, Image } from "react-native"; 
import { MaterialCommunityIcons } from "@expo/vector-icons";
import logo from "../assets/smallSketch.png";

export default function Button({ simbol, number, callback }){ 
	return(
		<TouchableOpacity onPress={ callback } >
			<Text style={{ color:"#f3f3f3", fontWeight:"bold", fontSize:24}} ><MaterialCommunityIcons name={ simbol } size={ 24 } color="#f3f3f3" /> { number }</Text>
			{ number === undefined && <Image source={ logo } style={{ resizeMode:"contain", width:85, height:54, alignSelf:"center" }}/>  }
		</TouchableOpacity >
	); 
} 