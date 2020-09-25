import React, { useEffect, useState } from "react"; 
import { Animated, StyleSheet, Text, View, Dimensions, TouchableOpacity  } from 'react-native';
const { width, height } = Dimensions.get("window");
import { AntDesign } from "@expo/vector-icons";

export default function Footer({ translateY }){
	const config ={
		inputRange:[-220, 0],
		outputRange:[0, 1],
		extrapolate:"clamp"
	};
  return (
	<Animated.View style={{ ...styles.container, opacity:translateY.interpolate(config) }} >
		<Text style={ styles.username} >Guedeswg</Text>
		<Text style={ styles.bio }>Aqui  sksksks sksksksk sksjsjsbsksi sosjss is ssiskks sosns 
sksksks osskkss oeneeke oeisis oeeieoe  
ekeieiei eoeioeeke ieeooe 
eieieieie </Text> 
	</Animated.View>
  );
}

const styles = StyleSheet.create({
	container: {
		flex:1,
		width,
		height:height-520,
		position:"absolute",
		top:480,
		backgroundColor: "#f3f3f3",
		padding:10,
	},
	username:{
		fontSize:24,
		fontWeight:"bold",
		color: "black", 
		
  },
	bio:{
		textAlign:"justify",
		color:"grey",
		alignSelf:"center",
		fontWeight:"bold",
	},
});
