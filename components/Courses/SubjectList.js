import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const SubjectList = ({ route }) => {
  const { classId } = route.params;
  const [subjects, setSubjects] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'classes', classId, 'subjects'),
      (snapshot) => {
        const subjectData = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        console.log('Fetched subjects:', subjectData); // Debugging log
        setSubjects(subjectData);
      },
      (error) => {
        console.error('Error fetching subjects: ', error);
      }
    );

    return () => unsubscribe();
  }, [classId]);

  const handleSubjectPress = (item) => {
    navigation.navigate('TopicList', { classId, subjectId: item.id });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleSubjectPress(item)}>
      <View style={styles.subjectItem}>
        <View style={styles.iconContainer}>
          <FontAwesome name="book" size={24} color="#fff" />
        </View>
        <Text style={styles.subjectName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
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
    backgroundColor: 'white',
    marginVertical: 1,
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D0AA66',
   // elevation: 2,
  },
  iconContainer: {
    backgroundColor: '#002D5D',
    padding: 10,
    borderRadius: 25,
    marginRight: 15,
  },
  subjectName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'gray',
  },
});

export default SubjectList;
