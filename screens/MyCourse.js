/*import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
//import SubjectsTab from '../components/HomeScreen/SubjectsTab';
import userplaceholder from '../assets/images/userplaceholder.png'
import flame from '../assets/images/flame.png'
import SubjectList from '../components/Courses/SubjectList';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
const Tab = createMaterialTopTabNavigator();

const CoursesScreen = ({ route, navigation }) => {
  const [classIds, setClassIds] = useState([]);

  useEffect(() => {
    const getClassIds = async () => {
      try {
        // Fetch class IDs from your "classes" collection (modify as needed)
        const classesQuery = query(collection(db, 'classes'));
        const querySnapshot = await getDocs(classesQuery);

        const fetchedClassIds = querySnapshot.docs.map((doc) => doc.id);
        setClassIds(fetchedClassIds);
      } catch (error) {
        console.error('Error fetching class IDs:', error);
      }
    };

    getClassIds();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.topper}>
        <Image source ={userplaceholder} style={{ width:30, height: 30, borderRadius:99, margin:10}}/>
        <Text style={styles.title}>Subjects</Text>
        <View style={{ display: 'flex', flexDirection: 'row', gap: 0.0002, alignItems: 'center' }}>
          <Image source={flame} style={{ width: 35, height: 35 }}/>
          <Text style={{ fontSize: 15, fontFamily: 'PoppinsBold', color: 'gray' }}>1234</Text>
        </View>
      </View>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: {
            fontSize: 18, 
            fontWeight: 'bold', 
            fontFamily: 'PoppinsBold', 
            color: 'grey', 
          },
          tabBarIndicatorStyle: {
            backgroundColor: '#D0AA66', 
            height: 2, 
            color: 'white' // Fixed typo in Color to color
          },
        }}
      >
         {classIds.map((classId) => (
            <Tab.Screen key={classId} name={classId} component={SubjectList} props={{ classId }} />
          ))}
      </Tab.Navigator>
    </View>
  );
};

export default CoursesScreen;
*/
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SubjectList from '../components/Courses/SubjectList'; // Assuming SubjectList.js is in the Courses folder
import { db } from '../firebase';
import userplaceholder from '../assets/images/userplaceholder.png';
import profileplaceholder from '../assets/images/profileplaceholder.jpg';
import flame from '../assets/images/flame.png';
import { collection, getDocs, query } from 'firebase/firestore';

const Tab = createMaterialTopTabNavigator();

const CoursesScreen = () => {
  const [classIds, setClassIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Flag for loading state

  useEffect(() => {
    const getClassIds = async () => {
      try {
       
        const classesQuery = query(collection(db, 'classes'));
        const querySnapshot = await getDocs(classesQuery);

        const fetchedClassIds = querySnapshot.docs.map((doc) => doc.id);
        setClassIds(fetchedClassIds);
      } catch (error) {
        console.error('Error fetching class IDs:', error);
      } finally {
        setIsLoading(false); 
      }
    };

    getClassIds();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topper}>
        <Image source={profileplaceholder} style={{ width: 40, height: 40, borderRadius: 99, margin: 10 }} />
        <Text style={styles.title}>Subjects</Text>
        <View style={{ display: 'flex', flexDirection: 'row', gap: 0.0002, alignItems: 'center' }}>
          <Image source={flame} style={{ width: 35, height: 35 }} />
          <Text style={{ fontSize: 15, fontFamily: 'PoppinsBold', color: 'gray' }}>1234</Text>
        </View>
      </View>
      {isLoading ? (
        <Text>Fetching class IDs...</Text>
      ) : (
        classIds.length > 0 ? (
          <Tab.Navigator
            screenOptions={{
              tabBarLabelStyle: {
                fontSize: 18,
                fontWeight: 'bold',
                fontFamily: 'PoppinsBold',
                color: 'grey',
              },
              tabBarIndicatorStyle: {
                backgroundColor: '#D0AA66',
                height: 2,
                color: 'white',
              },
            }}
          >
            {classIds.map((classId) => (
              <Tab.Screen 
                key={classId} 
                name={classId} 
                component={SubjectList} 
                initialParams={{ classId }} // Correct way to pass initial params
              />
            ))}
          </Tab.Navigator>
        ) : (
          <Text>No classes found.</Text>
        )
      )}
    </View>
  );
};

export default CoursesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 25,
    fontFamily: 'PoppinsBold',
    color: 'grey'
  },
  topper: {
    backgroundColor: 'white',
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10
  }
});
