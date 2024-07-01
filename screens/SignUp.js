import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import image from './../assets/images/image.png';
import { auth, firestore } from '../firebase'; 
import { useNavigation } from '@react-navigation/native';

export default function SignUp() {
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
  }, []);

  const handleSignUp = () => {
    // Check if username is unique
    const userRef = firestore.collection('users').doc(username);
    userRef.get().then(docSnapshot => {
      if (docSnapshot.exists) {
        alert('Username already taken. Please choose another one.');
      } else {
        // Username is unique, proceed with user creation
        auth
          .createUserWithEmailAndPassword(email, password)
          .then(userCredentials => {
            const user = userCredentials.user;
            user.updateProfile({ displayName: username });
            console.log('Registered with ', user.email, user.displayName);

            userRef.set({
              username: username,
              userId: user.uid,
              email: user.email,
              points: 0,
              topics: {} 
            }).then(() => {
              console.log('User data added to Firestore');
              navigation.replace('Homer');
            }).catch(error => {
              console.error('Error adding user data to Firestore:', error);
            });
          })
          .catch(error => alert(error.message));
      }
    }).catch(error => {
      console.error('Error checking username:', error);
      alert('Error checking username. Please try again.');
    });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior='padding'>
      <View style={styles.inputContainer}>
        <Image source={image} style={{ width: 100, height: 150, objectFit: 'contain', paddingLeft: 300, marginBottom: 10 }} />
        <Text style={styles.titleText}>New here? Join us now!</Text>
        <TextInput
          placeholder='Username'
          value={username}
          onChangeText={text => setUsername(text)}
          style={styles.input}
        />
        <TextInput
          placeholder='Email'
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder='Set Password'
          value={password}
          onChangeText={text => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleSignUp}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

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
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
    fontFamily: 'PoppinsRegular'
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
  }
});
