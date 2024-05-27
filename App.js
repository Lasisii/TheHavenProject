import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/loginScreen';
import HomeScreen from './screens/homeScreen';
import TabNavigation from './navigation/TabNavigation';
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
import { Feather } from '@expo/vector-icons';
import { enableScreens } from 'react-native-screens';




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
    <Tab.Navigator screenOptions={{headerShown: false, tabBarShowLabel: false}  }>
        <Tab.Screen name ='Home' component ={HomeScreen} options={{
          tabBarIcon: ()=> (<Foundation name="home" size={24} color="black" />),
        }}/>
        <Tab.Screen name ='MyCourse' component ={MyCourse} options={{
          tabBarIcon: ()=> (<FontAwesome5 name="book-open" size={20} color="black" />)
        }}/>
        <Tab.Screen name ='LeaderBoard' component ={LeaderBoard}   options={{
          tabBarIcon: ()=> (<MaterialIcons name="leaderboard" size={24} color="black" />)
        }}/>
        <Tab.Screen name ='Profile' component ={ProfileScreen}  options={{
          tabBarIcon: ()=> (<FontAwesome name="user" size={24} color="black" />)
        }}/>
    </Tab.Navigator>
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
    backgroundColor: 'transparent',
    borderTopWidth: 0, // Remove top border
    borderRadius: 20, // Adjust border radius as needed
    overflow: 'hidden', // Clip content to rounded edges
  }
});
