import React from "react"; 
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createStackNavigator } from "react-navigation-stack";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";

import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NewPost from "./pages/NewPost";
import ChatList from "./pages/ChatList";
import Inbox from "./pages/Inbox";
import FriendList from "./pages/FriendList"; 

const TabNavigator = createBottomTabNavigator({
		Dashboard,
		NewPost,
		Profile,
		ChatList,
	},{
		defaultNavigationOptions:({ navigation })=>({
			tabBarIcon:({ focused, horizontal, tintColor })=>{
				const { routeName } = navigation.state;
				let IconComponent = Ionicons;
				let iconName;
				if( routeName === "Dashboard"){
					iconName = `home-outline`;
      			IconComponent = MaterialCommunityIcons
				}  else if(routeName === "Profile") {
       		 		iconName = `user`;
       				
       				IconComponent = Feather;
    			}  else if( routeName === "NewPost"){
    					iconName = "ios-add-circle"
    
    			}  else if( routeName === "ChatList" ){
 						iconName = "ios-chatboxes"
 								
    			}
     
     			return <IconComponent name={iconName} size={25} color={ tintColor } />;
			},
		}),
		tabBarOptions: {
 		  activeTintColor: "white",
  		  inactiveTintColor: 'gray',
			showLabel:false,
			tabStyle:{
				backgroundColor:"#1C1C1C",
			}
 		}
		
});

const SwitchNavigator = createSwitchNavigator({
		Login,
		TabNavigator,
});

const StackNavigator = createStackNavigator({
	SwitchNavigator,
	Inbox,
	FriendList
},{
	headerMode:"none"
})

export default createAppContainer(StackNavigator);