import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SubjectList from '../components/Courses/SubjectList'; // Assuming SubjectList.js is in the Courses folder
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, collection, query, getDocs } from 'firebase/firestore'; // Import necessary Firestore functions
import profileplaceholder from '../assets/images/profileplaceholder.jpg';
import flame from '../assets/images/flame.png';

const Tab = createMaterialTopTabNavigator();

const CoursesScreen = () => {
  const [classIds, setClassIds] = useState([]);
  const [userId, setUserId] = useState(null); // Add state for userId
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClassIds = async () => {
      try {
        const classesQuery = query(collection(db, 'classes'));
        const querySnapshot = await getDocs(classesQuery);

        const fetchedClassIds = querySnapshot.docs.map(doc => doc.id);
        setClassIds(fetchedClassIds);
      } catch (error) {
        console.error('Error fetching class IDs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchUserId = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            setUserId(user.uid);
            console.log('userId:', user.uid); // Log userId here
          } else {
            console.error('User document does not exist');
          }
        } catch (error) {
          console.error('Error fetching userId:', error);
        }
      }
    };

    fetchClassIds();
    fetchUserId(); 
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
                initialParams={{ classId, userId }} // Pass userId to SubjectList
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
    color: '#002D5D'
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
