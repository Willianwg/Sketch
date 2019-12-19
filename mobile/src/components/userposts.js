import React, { useEffect, useState } from "react"; 
import { View, FlatList, Image, StyleSheet, Dimensions  } from "react-native"; 
import api from "../services/api";

const { width } = Dimensions.get("window");

export default function UserPosts({ id }){ 
	const [ posts, setPosts ] = useState([]);
	
	useEffect( () =>{
		async function loadUserPosts(){
			if(! id) return;
			const response = await api.get(`/users/${ id }/posts`);
			
			setPosts(response.data);
		};
		loadUserPosts();
	}, [ id ] ); 
	
	return(
		<FlatList
			style={ styles.list } 
			data={ posts }
			keyExtractor={ post => post.description }
			renderItem={({ item })=>(
				<View style={{flex:1}} >
					<Image source={{ uri:item.image_url }} style={ styles.post } /> 
				</View>
			)} 
			numColumns={ 3 }
			initialNumToRender={ 2 }
		/>
	);
 };
 
const styles = StyleSheet.create({
	list:{ 
		flex:1,
		backgroundColor:"#f3f3f3",
		width,
		marginTop:20,
	},
	post:{
		height:110,
		width:width/3,
		resizeMode:"cover",
		borderWidth:1,
		borderColor:"gray",
	},
}); 