import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
//import * as React from 'react';
//import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/loginScreen';
import HomeScreen from './screens/homeScreen';
//import CoursesScreen from './screens/MyCourse';
//import SubjectDetailScreen from './components/HomeScreen/SubjectDetailScreen';
//import TabNavigation from './navigation/TabNavigation';
import SignUp from './screens/SignUp';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MyCourse from './screens/MyCourse';
import LeaderBoard from './screens/LeaderBoard';
import { auth } from './firebase';
import ProfileScreen from './screens/ProfileScreen';
import { Foundation } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

import { enableScreens } from 'react-native-screens';
//import TopicDetailScreen from './components/HomeScreen/TopicDetailScreen';
//import LessonScreen from './components/HomeScreen/LessonScreen';




export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    'Nunito': require('./assets/fonts/Nunito-Regular.ttf'),
    'NunitoMedium': require('./assets/fonts/Nunito-Medium.ttf'),
    'Nunito-SemiBold': require('./assets/fonts/Nunito-SemiBold.ttf'),
    'Nunito-Bold': require('./assets/fonts/Nunito-Bold.ttf'),
    'PoppinsRegular': require('./assets/fonts/Poppins-Regular.ttf'),
    'PoppinsBold': require('./assets/fonts/Poppins-Bold.ttf'),
    'PoppinsMedium': require('./assets/fonts/Poppins-Medium.ttf'),

  });
  const Tab = createBottomTabNavigator();
  const Stack = createNativeStackNavigator();
  
enableScreens();
   const Home = () => (
   
    <Tab.Navigator screenOptions={{headerShown: false, tabBarShowLabel: false, tabBarActiveBackgroundColor: '#D0AA66',  tabBarStyle: styles.tabBar,}  }>
        <Tab.Screen name ='Home' component ={HomeScreen} options={{
          tabBarIcon: ({ focused })=> (<Foundation name="home" size={24} color={focused ? '#002D5D' : 'grey'} />),
        }}/>
        <Tab.Screen name ='MyCourse' component ={CoursesNavigator} options={{
           tabBarIcon: ({ focused }) => (
            <FontAwesome5 name="book-open" size={20} color={focused ? '#002D5D' : 'grey'} />
          ),
        }}/>
        <Tab.Screen name ='LeaderBoard' component ={LeaderBoard}   options={{
          tabBarIcon: ({ focused })=> (<MaterialIcons name="leaderboard" size={24} color={focused ? '#002D5D' : 'grey'} />)
        }}/>
        <Tab.Screen name ='Profile' component ={ProfileScreen}  options={{
          tabBarIcon: ({ focused })=> (<FontAwesome name="user" size={24} color={focused ? '#002D5D' : 'grey'}/>)
        }}/>
    </Tab.Navigator>
   
  );
  
  const CoursesNavigator = () => (
    <Stack.Navigator>
      <Stack.Screen name="Courses" component={MyCourse} options={{ headerShown: false }} />
  
      
    </Stack.Navigator>
  );

  const AuthStack = () => (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen options={{headerShown: false}} name="Login" component={LoginScreen} />
      <Stack.Screen name="Homer" component={Home} />
      <Stack.Screen options={{headerShown: false}} name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );

 // const App = () => {
    const [user, setUser] = useState('');
  
  
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((currentUser) => {
        setUser(currentUser);
      });
  
      return () => unsubscribe();
    }, []);
 // }

  return (
    
    <NavigationContainer>
     {user ? <Home /> : <AuthStack />}
    
    </NavigationContainer>
  
  );
}

const styles = StyleSheet.create({
  container: {
    
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow:'hidden'
  },
});
