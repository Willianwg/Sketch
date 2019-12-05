import React, { useEffect, useState } from "react"; 
import { View, FlatList, Image, StyleSheet  } from "react-native"; 
import api from "../services/api";

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
			contentContainerStyle={{ alignItems:"stretch" }}
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
		marginTop:50, 
		flex:1,
	},
	post:{
		height:110,
		resizeMode:"cover",
		borderWidth:1,
		borderColor:"gray",
	},
}); 