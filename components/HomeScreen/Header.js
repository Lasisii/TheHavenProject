import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { auth, firestore } from '../../firebase'; // Assuming you have Firestore imported
import flame from '../../assets/images/flame.png';
import { Ionicons } from '@expo/vector-icons';

const Header = () => {
  const [user, setUser] = useState(null);
  const [userPoints, setUserPoints] = useState(null);
  const [userProfilePhoto, setUserProfilePhoto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const userDocRef = firestore.collection('users').doc(currentUser.uid);
        const doc = await userDocRef.get();

        if (doc.exists) {
          const userData = doc.data();
          setUserPoints(userData.points);
          setUserProfilePhoto(userData.profilePhoto); // Get profilePhoto from Firestore
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View>
      <View style={styles.headerContainer}>
        <View style={styles.topRow}>
          <Ionicons name="notifications" size={24} color="white" />
          <Image 
            source={{ uri: userProfilePhoto || 'path/to/default/profileImage.jpg' }} 
            style={styles.userImage} 
          />
        </View>
        <View style={styles.greetingRow}>
          <View style={styles.greetingTextContainer}>
            <View>
              <Text style={styles.greetingText}>
                Hello, {user?.displayName || 'Guest'}
              </Text>
              <Text style={styles.subGreetingText}>Let's absorb information today!</Text>
            </View>
          </View>
          <View style={styles.flameContainer}>
            <Image source={flame} style={styles.flameImage} />
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.flameText}>
                {userPoints !== null ? userPoints : 'Points Unavailable'}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search Courses"
            placeholderTextColor="#D0AA66"
            style={styles.searchInput}
          />
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
    padding: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 10,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    padding: 10,
  },
  greetingTextContainer: {
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  flameImage: {
    width: 35,
    height: 35,
  },
  flameText: {
    fontSize: 15,
    fontFamily: 'PoppinsMedium',
    color: 'white',
    marginLeft: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    marginTop: 10,
    padding: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: 'white',
    marginLeft: 5,
  },
  searchIcon: {
    marginRight: 5,
  },
});

export default Header;
