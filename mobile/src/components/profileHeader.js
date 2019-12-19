import React, { useEffect, useState } from "react"; 
import { Animated, StyleSheet, Text, View, Dimensions, ImageBackground, TouchableOpacity  } from 'react-native';
import { PanGestureHandler, State } from "react-native-gesture-handler";
const { width, height } = Dimensions.get("window");
import { AntDesign } from "@expo/vector-icons";

export default function Header({ image, username, getImage }){
	let offset =0;
	const size =-height/3;
	const translateY = new Animated.Value(0);
	const animatedEvent = Animated.event([
		{
			nativeEvent:{
				translationY:translateY
			}
		}
	],{ useNativeDriver:true });
	
	function onHandlerStateChanged(event){
		if(event.nativeEvent.oldState === State.ACTIVE){
			let opened = true;
			const { translationY } = event.nativeEvent;
			offset += translationY;
			if(translationY <= -80){
				opened = false;
			}else {
				translateY.setValue(offset);
				translateY.setOffset(0);
				offset = 0;
			}
			
			Animated.timing(translateY, {
				toValue:opened?0:-420,
				duration:600,
				useNativeDriver:true
			}).start(()=>{
				offset = opened?0:-420;
				translateY.setOffset(offset);
				translateY.setValue(0);
			});
		}
	}
	
	const config ={
		inputRange:[-450, 0],
		outputRange:[-420, 0],
		extrapolate:"clamp"
	};
	const configOpacity ={
		inputRange:[-450, 0],
		outputRange:[1, 0],
		extrapolate:"clamp"
	};
  return (
	<View style={{ ...styles.container,  width, height:480 }} >
    <PanGestureHandler onHandlerStateChange={onHandlerStateChanged} onGestureEvent={ animatedEvent } >
    	<Animated.View style={{ flex:1,width, height:480, alignItems:"center", justifyContent:"center", transform:[{ translateY:translateY.interpolate(config) }], overflow:"visible" }} >
    	<ImageBackground source={ image } style={{ height:480, width, zIndex:2, justifyContent:"flex-end" }} >
    		<Animated.Text style={{ ...styles.username, opacity:translateY.interpolate(configOpacity), left:10 }}>{ username }</Animated.Text>
    		<TouchableOpacity style={{ alignSelf:"flex-end", marginRight:5}} onPress={ ()=>getImage(true) }>
				<Text style={ styles.editLabel } ><AntDesign name="edit" size={ 18 } color="white" /></Text>
			</TouchableOpacity>
    	</ImageBackground>	
    	</Animated.View>
    </PanGestureHandler>
    	<Animated.Image source={ image } style={{ opacity:translateY.interpolate(configOpacity),position:"absolute", borderRadius:45, height:90, width:90, bottom:-45, borderWidth:1, borderColor:"grey", transform:[{ translateY:translateY.interpolate(config) }]}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  	position:"absolute",
    backgroundColor: "transparent",
    alignItems: 'center',
    justifyContent:"center",
  },
	username:{
		fontSize:24,
		fontWeight:"bold",
		color: "white", 
		position:"absolute", 
		bottom:0,
		textShadowColor:"blue",
		textShadowOffset: {
			width: 2,
			height: 5,
		},
  },
	editLabel:{
		fontSize:18,
		fontWeight:"normal",
		color:"white",
	},
  
});
