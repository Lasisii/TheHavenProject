import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { collection, onSnapshot, doc, updateDoc, getDocs, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';

const TopicList = ({ route }) => {
  const { classId, subjectId } = route.params;
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(null);
  const [userId, setUserId] = useState(null);
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
            setUserId(user.uid);
            console.log('userId:', user.uid);
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
    if (!userId) return;

    const unsubscribe = onSnapshot(
      collection(db, 'classes', classId, 'subjects', subjectId, 'topics'),
      (snapshot) => {
        const topicData = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          description: doc.data().description,
        }));
        setTopics(topicData);
        setLoading(false);
        console.log('Fetched topics:', topicData);
      },
      (error) => {
        console.error('Error fetching topics: ', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [classId, subjectId, userId]);

  const fetchLessons = async (topicId) => {
    const lessonsSnapshot = await getDocs(collection(db, 'classes', classId, 'subjects', subjectId, 'topics', topicId, 'lessons'));
    const lessons = {};
    lessonsSnapshot.forEach(doc => {
      lessons[doc.data().name] = false;
    });
    console.log('Fetched lessons for topic:', topicId, lessons);
    return lessons;
  };

  const handleTopicSelect = async (topicId, topicName) => {
    try {
      setButtonLoading(topicId);
      const lessons = await fetchLessons(topicId);

      const userDocRef = doc(db, 'users', userId);
      const topicPath = `topics.${topicName}`;
      const updateObject = {
        [`${topicPath}.classId`]: classId,
        [`${topicPath}.subjectId`]: subjectId,
        [`${topicPath}.lessons`]: lessons
      };

      console.log('Update object:', updateObject);

      await updateDoc(userDocRef, updateObject);
      console.log('User topics updated successfully');
      navigation.navigate('LessonList', { classId, subjectId, topicId, userId });
    } catch (error) {
      console.error('Error updating user topics:', error);
    } finally {
      setButtonLoading(null);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.topicItem}>
      <TouchableOpacity
        style={styles.topicButton}
        onPress={() => handleTopicSelect(item.id, item.name)}
        activeOpacity={0.7}
      >
        <View style={styles.topicInfo}>
          <Text style={styles.topicName}>{item.name}</Text>
          <Text style={styles.topicDescription}>{item.description}</Text>
        </View>
        {buttonLoading === item.id ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Ionicons name="arrow-forward-circle" size={24} color="#FFF" />
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#002D5D" />
      ) : (
        <FlatList
          data={topics}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
    justifyContent: 'center',
  },
  listContainer: {
    paddingHorizontal: 15,
  },
  topicItem: {
    marginVertical: 10,
    backgroundColor: '#002D5D',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
  },
  topicButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  topicInfo: {
    flex: 1,
  },
  topicName: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: '700',
  },
  topicDescription: {
    fontSize: 14,
    color: '#BBDEFB',
    marginTop: 5,
  },
});

export default TopicList;
