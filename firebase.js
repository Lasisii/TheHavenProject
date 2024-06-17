/*// Import the functions you need from the SDKs you need
//import * as firebase from "firebase/app";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import 'firebase/firestore';
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBXpHBciaSbPE7n1p6cqchFmDP5IkWSdZ0",
  authDomain: "haven-7395d.firebaseapp.com",
  projectId: "haven-7395d",
  storageBucket: "haven-7395d.appspot.com",
  messagingSenderId: "476634609704",
  appId: "1:476634609704:web:1a616d05f008a562959d1d"
};


let app;
if(firebase.apps.length === 0){
    app = firebase.initializeApp(firebaseConfig)
}else{
    app = firebase.app()
}

const firestore = firebase.firestore();

export { firestore };
const db = getFirestore(app);
const auth = firebase.auth()

export {auth, db};
*/
// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import { getFirestore } from 'firebase/firestore';

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
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const db = getFirestore(app);
const auth = firebase.auth();
const firestore = firebase.firestore();

export { auth, db, firestore };

/*
const setupDatabaseSchema = async () => {
  try {
    // Sample data for the schema
    const classes = [
      { id: '1', name: 'Class 1' },
      { id: '2', name: 'Class 2' },
      { id: '3', name: 'Class 3' },
      { id: '4', name: 'Class 4' },
      { id: '5', name: 'Class 5' }
    ];

    const subjects = [
      { id: 'English', name: 'English' },
      { id: 'Math', name: 'Math' },
      { id: 'Science', name: 'Science' },
      { id: 'Social', name: 'Social' }
    ];

  

    // Create collections and documents
    for (let classData of classes) {
      const classRef = firestore.collection('classes').doc(classData.id);
      await classRef.set({ name: classData.name });

      for (let subjectData of subjects) {
        const subjectRef = classRef.collection('subjects').doc(subjectData.id);
        await subjectRef.set({ name: subjectData.name });

        
      }
    }
    console.log('Database schema setup completed.');
  } catch (error) {
    console.error('Error setting up database schema:', error);
  }
};

// Call the function to set up the database schema
setupDatabaseSchema();
*/