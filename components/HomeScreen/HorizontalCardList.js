import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import CardItem from './CardItem';
import { firestore, auth } from '../../firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const HorizontalCardList = () => {
  const [topics, setTopics] = useState([]);
  const navigation = useNavigation();

  const fetchTopics = useCallback(async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error('User not authenticated');
        return;
      }

      const userDoc = await firestore.collection('users').doc(user.uid).get();
      if (!userDoc.exists) {
        console.error('User document does not exist');
        return;
      }

      const userData = userDoc.data();
      console.log('User Data:', userData); 

      const topicsData = userData.topics || {};
      console.log('Topics Data:', topicsData); 
      const studiedTopics = Object.entries(topicsData)
        .filter(([topicName, topicData]) => Object.values(topicData.lessons).some(value => value === false))
        .map(([topicName, topicData]) => {
          const lessons = topicData.lessons || {};
          const totalLessons = Object.keys(lessons).length;
          const completedLessons = Object.values(lessons).filter(value => value === true).length;
          const progress = totalLessons > 0 ? completedLessons / totalLessons : 0;

          return {
            id: topicName,
            title: topicName,
            description: `${topicName} studied recently`,
            progress: progress,
            subjectId: topicData.subjectId,
            classId: topicData.classId,
          };
        });

      console.log('Studied Topics:', studiedTopics);

      setTopics(studiedTopics);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  }, []);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  const handleTopicPress = (topic) => {
    const user = auth.currentUser;
    navigation.navigate('LessonList', {
      classId: topic.classId,
      subjectId: topic.subjectId,
      topicId: topic.id,
      userId: user.uid,
    });
  };

  return (
    <View style={styles.listContainer}>
      <View style={styles.header}>
        <Text style={styles.TopText}>Continue Learning</Text>
        <TouchableOpacity style={styles.reloadButton} onPress={fetchTopics}>
          <Icon name="refresh" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      {topics.length > 0 ? (
        <FlatList
          data={topics}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleTopicPress(item)}>
              <CardItem title={item.title} description={item.description} progress={item.progress} />
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      ) : (
        <Text style={styles.noTopicsText}>No topics to display</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    marginTop: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginBottom: 0,
  },
  TopText: {
    fontFamily: 'PoppinsExtraBold',
    fontSize: 15,
    color: '#002D5D',
  },
  noTopicsText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
  reloadButton: {
    backgroundColor: '#D0AA66',
    padding: 5,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HorizontalCardList;
