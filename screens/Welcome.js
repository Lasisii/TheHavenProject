import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebase'; // assuming you use Firebase for auth

const Welcome = () => {
  const [fadeAnim] = useState(new Animated.Value(0)); // for fading animation
  const [slideAnim] = useState(new Animated.Value(0)); // for sliding animation
  const [isWelcomeTextVisible, setWelcomeTextVisible] = useState(true); // control which text is shown
  const navigation = useNavigation();

  const username = auth.currentUser.displayName; // assuming username is stored in Firebase

  useEffect(() => {
    // Fade in Welcome Text
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start(() => {
      // After 3 seconds, show the username
      setTimeout(() => {
        setWelcomeTextVisible(false);
        Animated.timing(slideAnim, {
          toValue: -50, // slide up
          duration: 1000,
          useNativeDriver: true,
        }).start();
      }, 3000); // display Welcome text for 3 seconds
    });
  }, []);

  // Handle screen tap
  const handleScreenTap = () => {
    navigation.replace('Homer');
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleScreenTap}>
      {isWelcomeTextVisible ? (
        <Animated.Text style={[styles.welcomeText, { opacity: fadeAnim }]}>
          Welcome!
        </Animated.Text>
      ) : (
        <View>
          <Animated.Text style={[styles.usernameText, { transform: [{ translateY: slideAnim }] }]}>
            {username}
          </Animated.Text>
          <Text style={styles.subtitleText}>
            Haven helps you study effectively
          </Text>
        </View>
      )}
      {!isWelcomeTextVisible && (
        <Text style={styles.tapToContinue}>Tap to continue</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#002D5D', // Blue background
  },
  welcomeText: {
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
  },
  usernameText: {
    fontSize: 30,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitleText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  tapToContinue: {
    marginTop: 50,
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
});

export default Welcome;
