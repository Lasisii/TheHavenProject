import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/homeScreen';
import MyCourse from '../screens/MyCourse';
import LeaderBoard from '../screens/LeaderBoard';
import ProfileScreen from '../screens/ProfileScreen';


const Tab = createBottomTabNavigator();
export default function TabNavigation() {
    const TabNav =  <Tab.Navigator>
    <Tab.Screen name ='Home' component ={HomeScreen}/>
    <Tab.Screen name ='MyCourse' component ={MyCourse}/>
    <Tab.Screen name ='LeaderBoard' component ={LeaderBoard}/>
    <Tab.Screen name ='Profile' component ={ProfileScreen}/>
</Tab.Navigator>
  return (
   TabNav
  )
}