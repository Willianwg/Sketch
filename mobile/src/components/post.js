import React, { useState } from "react"; 
import { AsyncStorage, View, Text, FlatList, StyleSheet, Image, TouchableOpacity, TextInput, Alert } from "react-native"; 
import { MaterialCommunityIcons } from "@expo/vector-icons";
import api from "../services/api";
import Button from "./postButton"

export default function Post({ post, user_id, postComment, deletePost, navigation }){ 
	const [ newComment, setComment ] = useState("");
	
	async function navigate(){
		navigation.navigate("Inbox", { talkingTo:post.author, previousMessages:"" });
	};
	
	function options(){
		Alert.alert(
 		 `------${ post.author.username }------`,"",
		  [
		    {text: 'Message', onPress: navigate },
			{},
  		  {text: 'Add Friend', onPress: addFriend },
		  ],
		  {cancelable: true},
		);
	};
	
	async function addFriend(){
		const response = await api.post(`/users/${ post.author._id }/friends`, {}, { headers:{ user_id } });
		alert(JSON.stringify(response.data)); 
	};
	
	function handleLongPress(){
		if(user_id !==post.author._id)
			return options();
		navigation.navigate("Profile")
	};
	
	function visitProfile(comment){
		if(user_id === comment.author._id)
			return navigation.navigate("Profile");
			
		return navigation.navigate("VisitProfile", { user:comment.author._id });
	};
	
	return(
			<View style={styles.container} >
				<View style={{ flex:1,flexDirection:"row", alignItems:"center", paddingBottom:8}}>
					<Image source={{ uri:post.author.avatar_url }} style={ styles.avatar } />
					<TouchableOpacity onPress={()=>post.author._id !== user_id?navigation.navigate("VisitProfile", { user: post.author._id }):navigation.navigate("Profile") } onLongPress={ handleLongPress } style={{flex:1, justifyContent:"center", alignSelf:"center" }} >
					<Text style={{ marginLeft:8, fontSize:14, lineHeight:30, color:"white", fontWeight:"bold" }}>
						{ post.author.username }
					</Text>
					</TouchableOpacity >
					<TouchableOpacity onLongPress={ user_id===post.author._id?()=>deletePost(post._id):()=>{ alert(`${ user_id } --- ${ post.author._id }`) }} >
						<Text style={{ color:"white", fontSize:17, marginRight:15 }}>•••</Text> 
					</TouchableOpacity>
				</View>
				{ post.description !== "" && <Text style={ styles.description } >{ post.description }</Text> }
				<View style={{ borderBottomWidth:1, borderBottomColor:"gray", flexDirection:"row", flex:1 }}  />
				<Image source={{ uri:post.image_url }} style={styles.image} />
				<View style={{ borderTopWidth:1, borderTopColor:"gray", flexDirection:"row", flex:1 }}  />
				<View style={{ flexDirection:"row", justifyContent:"space-around", marginVertical:10 }} >
					<Button simbol="thumb-up" number={ post.comments.length } callback={()=>{}}/>
					<Button simbol="comment-text" number={ post.comments.length } callback={()=>{}}/>
					<Button simbol="star" number={ post.comments.length } callback={()=>{}}/>
				</View>
				<FlatList
					data={ post.comments }
					keyExtractor={ (item, index)=>String(index) }
					renderItem={({ item })=>(
					<View style={{ flexDirection:"row", marginBottom:10, alignItems:"center"}} >
						<Image source={{ uri:item.author.avatar_url }} style={ styles.avatar } />
						<View>
							<TouchableOpacity onPress={ ()=>visitProfile(item) } >
								<Text style={{ marginLeft:10, fontSize:12, fontWeight:"bold", marginBottom:2, color:"#919191" }}> { item.author.username }</Text>
							</TouchableOpacity >
							<Text style={{ marginLeft:15, fontSize:14, fontWeight:"bold", color:"white" }}>{ item.comment }</Text>
						</View>
					</View>
					)}
				/>
				<View style={{ flexDirection:"row", flex:1 }} >
				<TextInput value={ newComment } placeholder="Comment here.." onChangeText={ setComment } style={ styles.commentInput } placeholderTextColor="#919191"/>
				<TouchableOpacity onPress={ ()=>{ postComment(post._id, newComment); setComment(""); } } style={ styles.submitButton } >
					<Text style={ styles.submitText } >Ok</Text>
				</TouchableOpacity>
				</View>
			</View> 
	); 
} ;

const styles = StyleSheet.create({
	container:{
		backgroundColor:"#333437",
		marginBottom:10,
		borderRadius:5,
		paddingVertical:8,
	},
	avatar:{
		
		marginLeft:10,
		height:40,
		width:40,
		borderRadius:20,
		
	},
	image:{
		height:400,
		width:"100%",
		resizeMode:"cover",
	},
	description:{
		padding:8,
		fontSize:16,
		lineHeight:20, 
		color:"white",
		paddingHorizontal:10,
		
	},
	commentInput:{
		flex:1,
		backgroundColor:"#1F2021",
		marginLeft:8,
		paddingHorizontal:10,
		height:30,
		borderRadius:10,
		color:"white",
	},
	submitButton:{
		alignItems:"center",
		justifyContent:"center",
		height:30,
		flexDirection:"row",
		backgroundColor:"#030303",
		marginHorizontal:5,
		width:50,
		borderRadius:10,
	},
	submitText:{
		color:"white",
		fontSize:12,
		fontWeight:"bold",
	},
}); 