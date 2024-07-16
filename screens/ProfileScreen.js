import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigation.replace('Login'); 
    });
  };

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.profileText}>Profile</Text>
      <View style={styles.profileImageContainer}>
        <Text style={styles.profileImageText}>{userData.username.charAt(0)}</Text>
      </View>
      <Text style={styles.userName}>{userData.username}</Text>
      <Text style={styles.userEmail}>{userData.email}</Text>
      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Privacy and Security</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f7f8fa',
    padding: 10,
  },
  profileText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#83a9d7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  profileImageText: {
    fontSize: 40,
    color: 'white',
  },
  userName: {
    fontSize: 30,
    color: '#1c3851',
    marginBottom: 5,
    fontFamily:'PoppinsBold'
  },
  userEmail: {
    fontSize: 20,
    color: '#6b6b6b',
    marginBottom: 20,
    fontFamily:'PoppinsRegular'
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 25,
    marginVertical: 5,
    borderRadius: 10,
    width: '100%',
    borderColor:'#002D5D',
    borderWidth: 2
  },
  buttonText: {
    fontSize: 18,
    color: '#002D5D',
  },
  logoutButton: {
    backgroundColor: '#D0AA66',
    borderColor:'#002D5D',
    borderWidth: 2
  },
});
