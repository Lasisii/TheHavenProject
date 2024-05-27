// Import the functions you need from the SDKs you need
//import * as firebase from "firebase/app";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXpHBciaSbPE7n1p6cqchFmDP5IkWSdZ0",
  authDomain: "haven-7395d.firebaseapp.com",
  projectId: "haven-7395d",
  storageBucket: "haven-7395d.appspot.com",
  messagingSenderId: "476634609704",
  appId: "1:476634609704:web:1a616d05f008a562959d1d"
};

// Initialize Firebase
let app;
if(firebase.apps.length === 0){
    app = firebase.initializeApp(firebaseConfig)
}else{
    app = firebase.app()
}

const auth = firebase.auth()

export {auth};