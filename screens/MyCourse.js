import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SubjectList from '../components/Courses/SubjectList'; 
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, collection, query, getDocs } from 'firebase/firestore'; 
import flame from '../assets/images/flame.png';

const Tab = createMaterialTopTabNavigator();

const CoursesScreen = () => {
  const [classIds, setClassIds] = useState([]);
  const [userId, setUserId] = useState(null); 
  const [userProfilePhoto, setUserProfilePhoto] = useState(null); 
  const [userPoints, setUserPoints] = useState(null); 
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
      }
    };

    const fetchUserDetails = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            setUserId(user.uid);
            setUserProfilePhoto(userData.profilePhoto || 'path/to/default/profileImage.jpg'); 
            setUserPoints(userData.points || 0); 
          } else {
            console.error('User document does not exist');
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
      setIsLoading(false);
    };

    fetchClassIds();
    fetchUserDetails(); 
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topper}>
        <Image 
          source={{ uri: userProfilePhoto }} 
          style={{ width: 40, height: 40, borderRadius: 99, margin: 10 }} 
        />
        <Text style={styles.title}>Subjects</Text>
        <View style={{ display: 'flex', flexDirection: 'row', gap: 0.0002, alignItems: 'center' }}>
          <Image source={flame} style={{ width: 35, height: 35 }} />
          <Text style={{ fontSize: 18, fontFamily: 'PoppinsBold', color: 'white' }}>
            {userPoints !== null && userPoints !== undefined ? userPoints : 'Points Unavailable'} 
          </Text>
        </View>
      </View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#D0AA66" />
        </View>
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
                initialParams={{ classId, userId }} 
              />
            ))}
          </Tab.Navigator>
        ) : (
          <View style={styles.noClassesContainer}>
            <Text>error.</Text>
          </View>
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
    color: 'white'
  },
  topper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#002D5D',
    height: 95,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noClassesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
