
import { View, Text, Image, TextInput, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import userplaceholder from '../../assets/images/userplaceholder.png';
import flame from '../../assets/images/flame.png'
import profileplaceholder from '../../assets/images/profileplaceholder.jpg'
import { Ionicons } from '@expo/vector-icons';


const Header = () => {
  const [user, setUser] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View>
      <View style={styles.headerContainer}>
        <View style={styles.topRow}>
          <Ionicons name="notifications" size={24} color="white" />
          <Image source={profileplaceholder} style={styles.userImage} />
        </View>
        <View style={styles.greetingRow}>
          <View style={styles.greetingTextContainer}>
            <View>
              <Text style={styles.greetingText}>Hello, {user.displayName}</Text>
              <Text style={styles.subGreetingText}>Let's absorb information today!</Text>
            </View>
          </View>
          <View style={styles.flameContainer}>
            <Image source={flame} style={styles.flameImage} />
            <Text style={styles.flameText}>1234</Text>
          </View>
        </View>
        <View style={styles.searchContainer}>
          <TextInput placeholder='Search Courses' cursorColor='#D0AA66' style={styles.searchInput} />
          <Ionicons name="search" size={24} color="white" style={styles.searchIcon} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 250,
    margin: 10,
    backgroundColor: '#002D5D',
    borderRadius: 20,
  },
  topRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 99,
    margin: 10,
  },
  greetingRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  greetingTextContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 25,
    fontFamily: 'PoppinsBold',
    color: 'white',
  },
  subGreetingText: {
    fontSize: 15,
    fontFamily: 'PoppinsMedium',
    color: 'white',
    opacity: 0.7,
    paddingLeft: 0,
  },
  flameContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flameImage: {
    width: 35,
    height: 35,
  },
  flameText: {
    fontSize: 15,
    fontFamily: 'PoppinsMedium',
    color: 'white',
  },
  searchContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 15,
    marginTop: 10,
    margin: 10,
  },
  searchInput: {
    fontSize: 15,
    fontFamily: 'PoppinsRegular',
    opacity: 0.5,
  },
  searchIcon: {
    opacity: 0.5,
  },
});

export default Header;
