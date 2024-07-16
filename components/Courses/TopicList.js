import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native';
import { collection, onSnapshot, doc, updateDoc, getDocs, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';

const TopicList = ({ route }) => {
  const { classId, subjectId } = route.params;
  const [topics, setTopics] = useState([]);
  const [userId, setUserId] = useState(null); // State to store userId
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserId = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            setUserId(user.uid); // Set userId state
            console.log('userId:', user.uid); // Log userId here
          } else {
            console.error('User document does not exist');
          }
        } catch (error) {
          console.error('Error fetching userId:', error);
        }
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (!userId) return; // Return if userId is not set

    const unsubscribe = onSnapshot(
      collection(db, 'classes', classId, 'subjects', subjectId, 'topics'),
      (snapshot) => {
        const topicData = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          description: doc.data().description,
        }));
        setTopics(topicData);
      },
      (error) => {
        console.error('Error fetching topics: ', error);
      }
    );

    return () => unsubscribe();
  }, [classId, subjectId, userId]); // Added userId dependency

  const fetchLessons = async (topicId) => {
    const lessonsSnapshot = await getDocs(collection(db, 'classes', classId, 'subjects', subjectId, 'topics', topicId, 'lessons'));
    const lessons = {};
    lessonsSnapshot.forEach(doc => {
      lessons[doc.data().name] = false;
    });
    return lessons;
  };

  const handleTopicSelect = async (topicId, topicName) => {
    try {
      const lessons = await fetchLessons(topicId);

      // Update Firestore document
      const userDocRef = doc(db, 'users', userId);
      const topicPath = `topics.${topicName}.lessons`;
      const updateObject = {
        [topicPath]: lessons
      };

      await updateDoc(userDocRef, updateObject);
      console.log('User topics updated successfully');
      navigation.navigate('LessonList', { classId, subjectId, topicId, userId });
    } catch (error) {
      console.error('Error updating user topics:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.topicItem}>
      <TouchableOpacity onPress={() => handleTopicSelect(item.id, item.name)}>
        <Text style={styles.topicName}>{item.name}</Text>
        <Text style={styles.topicDescription}>{item.description}</Text>
      </TouchableOpacity>
      <Button title="Learn" onPress={() => handleTopicSelect(item.id, item.name)} />
    </View>
  );

  return (
    <FlatList
      data={topics}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
  },
  topicItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 25,
    marginVertical: 5,
    borderRadius: 10,
    width: '100%',
    borderColor:'#002D5D',
    borderWidth: 2
  },
  topicName: {
    fontSize: 20,
    color: '#002D5D',
    fontFamily: 'PoppinsBold'
  },
  topicDescription: {
    fontSize: 14,
    color: '#004d40',
  },
});

export default TopicList;
