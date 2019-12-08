import React, { useState, useEffect } from "react"; 
import { KeyboardAvoidingView, View, AsyncStorage, FlatList, Image, Text, TouchableOpacity , StyleSheet, ActivityIndicator, TextInput } from "react-native"; 
import Post from "../components/post";
import Comment from "../components/comment";
// import socketio from "socket.io-client";

import api from "../services/api";
import logo from "../assets/smallSketch.png";
import { SimpleLineIcons, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function Dashboard({ navigation }){ 
	const [feed, setFeed] = useState([]);
	const [refreshing, setRefreshing] = useState(false);
	const [ totalPages, setTotal ] = useState(0);
	const [ loading, setLoading ] = useState(false);
	const [ page, setPage ] = useState(1);
	const [ user_id, setId ] = useState("");
	
	
	useEffect( () =>{
		async function getUserId(){
			const user = await AsyncStorage.getItem("user");
			setId(user);
			// const socket = socketio("http://localhost:3001");
			// socket.emit("myName", "Willian");
		};
		getUserId();
		loadFeed(1);
		
	}, [ ] ); 
	
	async function loadFeed(pageNumber=page, shouldRefresh=false){
		if( totalPages && pageNumber > totalPages  ) return;
		
		setLoading(true);
		const response =await api.get(`/posts/?page=${ pageNumber }`);
		const { data } = response;
		const { docs } = data;
		
		setTotal(data.totalPages);
		
		shouldRefresh?setFeed([ ...feed, ...docs ]):setFeed(docs);
		
		setPage(pageNumber+1);
		setLoading(false);
		// alert(JSON.stringify(response));
	};
	
	async function logout(){
		await AsyncStorage.clear();
		navigation.navigate("Login");
	};
	
	async function refresh(){
		setRefreshing(true);
		await loadFeed(1);
		setRefreshing(false);
	};
	
	async function postComment(post_id, comment){
		if(! post_id || ! comment) return;
		
		const response = await api.post(`/posts/${ post_id }/new_comment`, { comment },
			{ 
				headers:{ user_id } 
			}
		);
		
		loadFeed(page - 1);
		//updatePost(post_id, user_id, comment);
	};
	
	async function deletePost(post_id){
		await api.delete(`/posts/${ post_id }/delete`);
		
		const filteredFeed = feed.filter(post=>{
			if(post._id !== post_id)
				return post;
		});
		
		setFeed(filteredFeed);
	};
	
	return(
		<KeyboardAvoidingView style={ styles.container } behavior="padding" >
			<View style={{ flexDirection:"row", marginTop:30, justifyContent:"space-between", alignItems:"center"}}>
				<TouchableOpacity onPress={ logout } >
					<Text style={{ color:"white", fontWeight:"bold", marginLeft:8}}>
						<SimpleLineIcons name="logout" size={ 12 } color="white" />  Logout
					</Text> 
				</TouchableOpacity>
				<Image source={ logo } style={{ resizeMode:"contain", width:85, height:54, alignSelf:"center" }}/> 
				<View style={{ width:"20%", alignItems:"flex-end", paddingHorizontal:10 }} >
					<TouchableOpacity onPress={ ()=>navigation.navigate("FriendList", { user_id:user_id }) } >
						<MaterialCommunityIcons name="account-group" size={ 25 } color="white" />
					</TouchableOpacity>
				</View>
			</View>
			<FlatList
				showsVerticalScrollIndicator={ false }
				style={{ width:"100%", marginTop:1, backgroundColor:"#1B1B1B", borderRadius:8}}
				data={ feed }
				keyExtractor={(item, index)=>index.toString()}
				renderItem={ ({ item })=><Post post={ item } user_id={ user_id } postComment={ postComment } deletePost={ deletePost } navigation={ navigation }/>}
				onRefresh={ refresh }
				refreshing={ refreshing }
				onEndReached={ ()=> loadFeed(page,true) }
				onEndReachedThreshold={ 0.3 }
				ListFooterComponent={ loading && <ActivityIndicator size="small" color="white"  style={{ marginVertical:30 }}/> }
				initialNumToRender={ 3 }
			/>

		</KeyboardAvoidingView> 
	); 
};


const styles = StyleSheet.create({
	container:{
		flex:1,
		backgroundColor:"#000",
	},
	
}); 