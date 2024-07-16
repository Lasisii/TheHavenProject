import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigation } from '@react-navigation/native';

const SubjectList = ({ route }) => {
  const { classId, userId } = route.params;
  const [subjects, setSubjects] = useState([]);
  const navigation = useNavigation();
  const numColumns = 2;

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, `classes/${classId}/subjects`),
      (snapshot) => {
        const subjectData = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          banner: doc.data().banner,
        }));
        console.log('Fetched subjects:', subjectData);
        setSubjects(subjectData);
      },
      (error) => {
        console.error('Error fetching subjects: ', error);
      }
    );

    return () => unsubscribe();
  }, [classId, userId]);

  // Log userId to console to check its value
  console.log('SubjectList userId:', userId);

  const handleSubjectPress = (item) => {
    navigation.navigate('TopicList', { classId, subjectId: item.id, userId });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleSubjectPress(item)} style={styles.subjectItem}>
      <Image source={{ uri: item.banner }} style={styles.subjectBanner} resizeMode="cover" />
      <Text style={styles.subjectName}>{item.name}</Text>
    </TouchableOpacity>
  );

  if (subjects.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={subjects}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      numColumns={numColumns}
      key={`flatlist-columns-${numColumns}`}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
  },
  subjectItem: {
    flex: 1,
    margin: 5,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D0AA66',
    paddingBottom: 10,
    elevation: 2,
  },
  subjectBanner: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  subjectName: {
    fontSize: 16,
    fontFamily: 'PoppinsBold',
    color: '#002D5D',
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SubjectList;
