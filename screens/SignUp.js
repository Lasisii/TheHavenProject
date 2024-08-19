import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, firestore } from '../firebase'; 

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigation.replace('Home'); 
      }
    });
    return unsubscribe;
  }, [navigation]);

  const handleSignUp = async () => {
    try {
      const userRef = firestore.collection('users').doc(username);
      const docSnapshot = await userRef.get();

      if (docSnapshot.exists) {
        alert('Username already taken. Please choose another one.');
        return;
      }

      const userCredentials = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredentials.user;

      await user.updateProfile({ displayName: username });

      const userDocRef = firestore.collection('users').doc(user.uid);

      await userDocRef.set({
        username: username,
        userId: user.uid,
        email: user.email,
        points: 0,
        topics: {}
      });

      console.log('User data added to Firestore');
      navigation.replace('Home');
    } catch (error) {
      console.error('Error during sign up:', error);
      alert(error.message);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.inputContainer}>
      <Image source={require('./../assets/images/image.png')} style={styles.image} />
        <Text style={styles.titleText}>New here? Join us now!</Text>
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          placeholder="Set Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSignUp} style={[styles.button, styles.buttonOutline]}>
          <Text style={styles.buttonOutlineText}>Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputContainer: {
    width: '80%'
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25
  },
  button: {
    backgroundColor: '#002D5D',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 2,
  },
  buttonOutline: {
    backgroundColor: '#D0AA66',
    marginTop: 5,
    borderColor: '#002D5D',
    borderWidth: 2,
  },
  buttonOutlineText: {
    color: '#002D5D',
    fontWeight: '700',
    fontSize: 16
  },
  titleText: {
    textAlign: 'center',
    fontSize: 20,
    color: '#002D5D',
    fontFamily: 'PoppinsMedium',
    marginTop: -2
  },
  image: {
    width: 100,
    height: 150,
    objectFit: 'contain',
    paddingLeft: 300,
    marginBottom: 10
  }
});

export default SignUp;
