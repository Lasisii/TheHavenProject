import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ActivityIndicator, Alert, Image } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function ProfileScreen() {
  const [userData, setUserData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigation = useNavigation();
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();

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

  const pickImage = async () => {
    // Request permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission required", "We need permission to access your media library to select a photo.");
      return;
    }

    // Launch the image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log("Image Picker Result:", result); // Log the picker result

    // Check if the result is valid
    if (result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      if (imageUri) {
        console.log("Selected Image URI:", imageUri); // Log the URI
        uploadImage(imageUri);
      } else {
        console.log("Image URI is undefined.");
      }
    } else {
      console.log("No image selected or selection was canceled.");
    }
  };

  const uploadImage = async (uri) => {
    setUploading(true);
    const user = auth.currentUser;
    if (user) {
      try {
        const response = await fetch(uri);
        const blob = await response.blob();
        const storageRef = ref(storage, `profilePhotos/${user.uid}`);
        const snapshot = await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(snapshot.ref);
        updateProfilePhoto(downloadURL);
      } catch (error) {
        console.error("Upload failed: ", error);
        Alert.alert("Upload failed", "Something went wrong while uploading the photo.");
      } finally {
        setUploading(false);
      }
    }
  };

  const updateProfilePhoto = async (url) => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { profilePhoto: url });
      setUserData({ ...userData, profilePhoto: url });
      setModalVisible(false);
    }
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
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.profileImageContainer}>
        {userData.profilePhoto ? (
          <Image source={{ uri: userData.profilePhoto }} style={styles.profileImage} />
        ) : (
          <Text style={styles.profileImageText}>{userData.username.charAt(0)}</Text>
        )}
      </TouchableOpacity>
      <Text style={styles.userName}>{userData.username}</Text>
      <Text style={styles.userEmail}>{userData.email}</Text>
      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Privacy and Security</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Todo')}>
        <Text style={styles.buttonText}>Tasks</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalHeading}>Upload Profile Photo</Text>
            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
              <Text style={styles.uploadButtonText}>Choose Photo</Text>
            </TouchableOpacity>
            {uploading && <ActivityIndicator size="large" color="#D0AA66" />}
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userName: {
    fontSize: 30,
    color: '#1c3851',
    marginBottom: 5,
    fontFamily: 'PoppinsBold'
  },
  userEmail: {
    fontSize: 20,
    color: '#6b6b6b',
    marginBottom: 20,
    fontFamily: 'PoppinsRegular'
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 25,
    marginVertical: 5,
    borderRadius: 10,
    width: '100%',
    borderColor: '#002D5D',
    borderWidth: 2
  },
  buttonText: {
    fontSize: 18,
    color: '#002D5D',
  },
  logoutButton: {
    backgroundColor: '#D0AA66',
    borderColor: '#002D5D',
    borderWidth: 2
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: '#D0AA66',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  cancelButton: {
    backgroundColor: '#ff4d4d',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});
