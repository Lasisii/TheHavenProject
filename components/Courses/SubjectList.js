import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, View, Image } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { FontAwesome } from '@expo/vector-icons';

const SubjectList = ({ route }) => {
  const { classId } = route.params;
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'classes', classId, 'subjects'),
      (snapshot) => {
        const subjectData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSubjects(subjectData);
      },
      (error) => {
        console.error('Error fetching subjects: ', error);
      }
    );

    return () => unsubscribe();
  }, [classId]);

  const renderItem = ({ item }) => (
    <View style={styles.subjectItem}>
      <View style={styles.iconContainer}>
        <FontAwesome name={item.iconName || 'book'} size={24} color="#fff" />
      </View>
      <Text style={styles.subjectName}>{item.name}</Text>
    </View>
  );

  return (
    <FlatList
      data={subjects}
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
  subjectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    marginVertical: 8,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    elevation: 2,
  },
  iconContainer: {
    backgroundColor: '#ff6347',
    padding: 10,
    borderRadius: 25,
    marginRight: 15,
  },
  subjectName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default SubjectList;
