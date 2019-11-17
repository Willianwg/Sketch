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

const TabNavigator = createBottomTabNavigator({
		Dashboard,
		NewPost,
		Profile
	},{
		defaultNavigationOptions:({ navigation })=>({
			tabBarIcon:({ focused, horizontal, tintColor })=>{
				const { routeName } = navigation.state;
				let IconComponent = MaterialCommunityIcons;
				let iconName;
				if( routeName === "Dashboard"){
					iconName = `home-outline`;
      
				}  else if(routeName === "Profile") {
       		 		iconName = `user`;
       				
       				IconComponent = Feather;
    			}  else if( routeName === "NewPost"){
    					iconName = "ios-add-circle"
    
    					IconComponent = Ionicons;
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
	ChatList
},{
	headerMode:"none"
})

export default createAppContainer(StackNavigator);