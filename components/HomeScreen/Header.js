import { View, Text,  Image, TextInput} from 'react-native'
import React, {useState, useEffect}from 'react'
import { auth } from '../../firebase';
import firebase from "firebase/compat/app";
import logonew from '../../assets/images/logonew.png';
import userplaceholder from '../../assets/images/userplaceholder.png';
import flame from '../../assets/images/flame.png';
import logo from '../../assets/images/logo.png';
import { Ionicons } from '@expo/vector-icons';
///import { TextInput } from 'react-native-gesture-handler';

const Header =()=>{
    const [user, setUser] = useState('');
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
          setUser(currentUser);
        });
    
        return () => unsubscribe();
      }, []);
  return (
    <View>
    <View style={{height:250,  margin:10, backgroundColor:'#002D5D', borderRadius: 20}}>
        <View>
            <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'flex-end'}}>
            
             <Image source ={userplaceholder} style={{ width:40, height: 40, borderRadius:99, margin:10}}/>
            </View>
        <View style ={{display:'flex', flexDirection:'row', gap: 10, alignItems:'center', justifyContent:'space-between', padding: 10}} >
            <View style ={{display:'flex', flexDirection:'row', gap: 1, alignItems:'center'}} >
              
                <View>
                   
                    <Text style={{ fontSize:25 ,fontFamily:'PoppinsBold', color: 'white'}}> Hello {user.displayName},</Text>
                    <Text style={{fontSize: 15, fontFamily:'PoppinsMedium', color:'white', opacity: 0.7, paddingLeft: 5}}>Let's absorb information today!</Text>
                </View>
            </View>
        <View style ={{display:'flex', flexDirection:'row', gap: 0.0002, alignItems:'center', justifyContent:'center'}}>
            <Image source={flame} style={{width: 35, height: 35}}/>
            <Text style={{ fontSize:15 ,fontFamily:'PoppinsMedium', color: 'white'}}>1234</Text>
        </View>
        </View>
        </View>
        <View style={{backgroundColor:'rgba(255, 255, 255, 0.1)', padding: 10, display:'flex', flexDirection:'row', justifyContent:'space-between', borderRadius:15, marginTop: 10, margin: 10}}>
            <TextInput placeholder='Search Courses' cursorColor='#D0AA66' style={{fontSize: 15, fontFamily:'PoppinsRegular', opacity:0.5}}/>
            <Ionicons name="search" size={24} color="white" opacity={0.5} />
        </View>
    </View>
    </View>
  )
}

export default Header;