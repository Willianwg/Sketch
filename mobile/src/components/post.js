import React, { useState } from "react"; 
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, TextInput } from "react-native"; 
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Post({ item, user_id, postComment, deletePost }){ 
	const [ comment, setComment ] = useState("");
	
	return(
			<View style={styles.container} >
				<View style={{ flex:1,flexDirection:"row", alignItems:"center", borderBottomWidth:1, borderBottomColor:"#C6C6C6", paddingBottom:8}}>
					<Image source={{ uri:item.author.avatar_url }} style={ styles.avatar } />
					<Text style={{ flex:1,marginLeft:8, fontSize:14, lineHeight:30 }}>
						{ item.author.username }
					</Text>
					<TouchableOpacity onLongPress={ user_id===item.author._id?()=>deletePost(item._id):()=>{ alert(`${ user_id } --- ${ item.author._id }`) }} >
						<Text style={{ color:"grey", fontSize:17, marginRight:15}}>•••</Text> 
					</TouchableOpacity>
				</View>
				<Image source={{ uri:item.image_url }} style={styles.image} />
				<Text style={ styles.description } >{ item.description }</Text>
				<Text style={{ marginLeft:8, fontSize:20, lineHeight:30, fontWeight:"bold", marginBottom:10 }} >♡17	☆2	<MaterialCommunityIcons name="comment-text" size={ 20 } color="black" />{ item.comments.length }</Text>
				
				<FlatList
					data={ item.comments }
					keyExtractor={ (item, index)=>String(index) }
					renderItem={({ item })=>(
					<View style={{ flexDirection:"row", marginBottom:10, alignItems:"center"}} >
						<Image source={{ uri:item.author.avatar_url }} style={ styles.avatar } />
						<Text style={{ marginLeft:15, fontSize:14, lineHeight:30, fontWeight:"bold", color:"grey" }}>{ item.comment }</Text>
					</View>
					)}
				/>
				<View style={{ flexDirection:"row", flex:1 }} >
				<TextInput value={ comment } placeholder="Comment here.." onChangeText={ setComment } style={ styles.commentInput }/>
				<TouchableOpacity onPress={ ()=>{ postComment(item._id, comment); setComment(""); } } style={ styles.submitButton } >
					<Text style={ styles.submitText } >Ok</Text>
				</TouchableOpacity>
				</View>
			</View> 
	); 
} ;

const styles = StyleSheet.create({
	container:{
		backgroundColor:"white",
		marginBottom:10,
		borderRadius:0,
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
		fontSize:20,
		lineHeight:30, 
		fontWeight:"bold", 
		borderTopWidth:1, 
		borderTopColor:"#C6C6C6",
	},
	commentInput:{
		flex:1,
		backgroundColor:"#f3f3f3",
		marginLeft:8,
		paddingHorizontal:5,
		height:30,
		borderRadius:5,
	},
	submitButton:{
		alignItems:"center",
		justifyContent:"center",
		height:30,
		flexDirection:"row",
		backgroundColor:"#030303",
		marginHorizontal:5,
		width:50,
		borderRadius:8,
	},
	submitText:{
		color:"white",
		fontSize:12,
		fontWeight:"bold",
	},
}); 