import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import React, {useEffect, useState} from 'react'
import image from './../assets/images/image.png';
import { auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';




export default function SignUp() {
    const[email, setEmail] = useState('')
    const[password, setPassword] = useState('')
    const[username, setUsername] = useState('')
    const navigation = useNavigation()

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
              if (user){
                  navigation.replace('Homer')
              }
          })
          return unsubscribe;
      }, [])

      const handleSignUp =()=>{
        auth
        .createUserWithEmailAndPassword(email, password)
        .then(userCredentials =>{
            const user =userCredentials.user;
            userCredentials.user.updateProfile({ displayName: username });
            console.log('Registered with ', user.email, user.displayName);
        })
        .catch(error=> alert(error.message))}
  return (
   <KeyboardAvoidingView style={styles.container} behavior='padding'>

<View style={styles.inputContainer}>
        <Image source ={image} style ={{width: 100, height: 150, objectFit:'contain', paddingLeft: 300, marginBottom:10}} /> 
        <Text style={{
            textAlign:'center',
            fontSize: 20,
            color: '#002D5D',
            fontFamily: 'PoppinsMedium',
            marginTop: -2
            }}
            >New here? Join us now!</Text>
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
            onChangeText={text => setPassword(text) }
          style={styles.input}
          secureTextEntry/>
    </View>

<View style={styles.buttonContainer}>
            <TouchableOpacity
            onPress={handleSignUp}
            style={ [styles.button, styles.buttonOutline]}>
               <Text style={styles.buttonOutlineText}>Register</Text> 
            </TouchableOpacity>
</View>

   </KeyboardAvoidingView>
  )
}





const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    inputContainer:{
        width:'80%'
    },
    input:{
        backgroundColor:'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 10
    },
    buttonContainer:{
        width: '60%',
        justifyContent:'center',
        alignItems: 'center',
        marginTop: 25
    },
    button:{
        backgroundColor:'#002D5D',
        width: '100%',
        padding:15 ,
        borderRadius: 10,
        alignItems: 'center',
        borderColor: 'black',
        borderWidth:2,
    }, 
    buttonOutline: {
        backgroundColor:'#D0AA66',
        marginTop: 5,
        borderColor: '#002D5D',
        borderWidth:2,

    },
    buttonText:{
        color: 'white',
        fontWeight:'700',
        fontSize:16,
        fontFamily:'PoppinsRegular'
    },
    buttonOutlineText:{
        color: '#002D5D',
        fontWeight:'700',
        fontSize:16
    }
    
  
})