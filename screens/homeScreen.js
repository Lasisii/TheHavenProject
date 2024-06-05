import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image } from 'react-native';
import firebase from 'firebase/app';
import image from './../assets/images/image.png';
//import 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebase';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigation from '../navigation/TabNavigation';
import Header from '../components/HomeScreen/Header';
import HorizontalCardList from '../components/HomeScreen/HorizontalCardList';


const HomeScreen = () => {
  const [user, setUser] = useState('');
  const[username, setUsername] = useState('')
  
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  return (
    
    <View style={{paddingTop: 40}} >
      {user? (
        <>
        <Header/>
       <View>
        <HorizontalCardList />
       </View>
        </>



       
        
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
    
  );
};

export default HomeScreen;
