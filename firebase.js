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

//import { firestore } from './firebase'; // Adjust the path as necessary
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

    const uniqueTopics = {
      English: [
        { id: 'Grammar', name: 'Grammar', description: 'Grammar basics', banner: 'url_to_banner_english_1' },
        { id: 'Literature', name: 'Literature', description: 'Introduction to Literature', banner: 'url_to_banner_english_2' }
      ],
      Math: [
        { id: 'Algebra', name: 'Algebra', description: 'Introduction to Algebra', banner: 'url_to_banner_math_1' },
        { id: 'Geometry', name: 'Geometry', description: 'Basics of Geometry', banner: 'url_to_banner_math_2' }
      ],
      Science: [
        { id: 'Physics', name: 'Physics', description: 'Basics of Physics', banner: 'url_to_banner_science_1' },
        { id: 'Biology', name: 'Biology', description: 'Introduction to Biology', banner: 'url_to_banner_science_2' }
      ],
      Social: [
        { id: 'History', name: 'History', description: 'World History overview', banner: 'url_to_banner_social_1' },
        { id: 'Geography', name: 'Geography', description: 'Basics of Geography', banner: 'url_to_banner_social_2' }
      ]
    };

    const uniqueLessons = {
      Grammar: [
        { lectureLink: 'url_to_lecture_grammar_1', lessonnumber: '1' },
        { lectureLink: 'url_to_lecture_grammar_2', lessonnumber: '2' }
      ],
      Literature: [
        { lectureLink: 'url_to_lecture_literature_1', lessonnumber: '1' },
        { lectureLink: 'url_to_lecture_literature_2', lessonnumber: '2' }
      ],
      Algebra: [
        { lectureLink: 'url_to_lecture_algebra_1', lessonnumber: '1' },
        { lectureLink: 'url_to_lecture_algebra_2', lessonnumber: '2' }
      ],
      Geometry: [
        { lectureLink: 'url_to_lecture_geometry_1', lessonnumber: '1' },
        { lectureLink: 'url_to_lecture_geometry_2', lessonnumber: '2' }
      ],
      Physics: [
        { lectureLink: 'url_to_lecture_physics_1', lessonnumber: '1' },
        { lectureLink: 'url_to_lecture_physics_2', lessonnumber: '2' }
      ],
      Biology: [
        { lectureLink: 'url_to_lecture_biology_1', lessonnumber: '1' },
        { lectureLink: 'url_to_lecture_biology_2', lessonnumber: '2' }
      ],
      History: [
        { lectureLink: 'url_to_lecture_history_1', lessonnumber: '1' },
        { lectureLink: 'url_to_lecture_history_2', lessonnumber: '2' }
      ],
      Geography: [
        { lectureLink: 'url_to_lecture_geography_1', lessonnumber: '1' },
        { lectureLink: 'url_to_lecture_geography_2', lessonnumber: '2' }
      ]
    };

    // Create collections and documents
    for (let classData of classes) {
      const classRef = firestore.collection('classes').doc(classData.id);
      await classRef.set({ name: classData.name });

      for (let subjectData of subjects) {
        const subjectRef = classRef.collection('subjects').doc(subjectData.id);
        await subjectRef.set({ name: subjectData.name });

        const topics = uniqueTopics[subjectData.id];
        for (let topicData of topics) {
          const topicRef = subjectRef.collection('topics').doc(topicData.id);
          await topicRef.set({ name: topicData.name, description: topicData.description, banner: topicData.banner });

          const lessons = uniqueLessons[topicData.id];
          for (let lessonData of lessons) {
            const lessonRef = topicRef.collection('lessons').doc();
            await lessonRef.set({ lectureLink: lessonData.lectureLink, lessonnumber: lessonData.lessonnumber });
          }
        }
      }
    }

    console.log('Database schma setup completed.');
  } catch (error) {
    console.error('Error setting up database schema:', error);
  }
};

// Call the function to set up the database schema
setupDatabaseSchema();
*/