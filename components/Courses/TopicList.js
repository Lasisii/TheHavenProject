import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigation } from '@react-navigation/native';

const TopicList = ({ route }) => {
  const { classId, subjectId, userId } = route.params;
  const [topics, setTopics] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
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
  }, [classId, subjectId]);

  const handleTopicSelect = (topicId) => {
    navigation.navigate('LessonList', { classId, subjectId, topicId, userId });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleTopicSelect(item.id)}>
      <View style={styles.topicItem}>
        <Text style={styles.topicName}>{item.name}</Text>
        <Text style={styles.topicDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
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
    backgroundColor: '#e0f7fa',
    marginVertical: 8,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#b2ebf2',
    elevation: 2,
  },
  topicName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00796b',
  },
  topicDescription: {
    fontSize: 14,
    color: '#004d40',
  },
});

export default TopicList;
