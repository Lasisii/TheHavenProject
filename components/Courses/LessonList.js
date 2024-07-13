import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, Dimensions, Button } from 'react-native';
import { collection, onSnapshot, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { WebView } from 'react-native-webview';

const LessonList = ({ route }) => {
  const { classId, subjectId, topicId, userId } = route.params;
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [nextLesson, setNextLesson] = useState(null);

  useEffect(() => {
    const fetchLessons = async () => {
      const unsubscribe = onSnapshot(
        collection(db, 'classes', classId, 'subjects', subjectId, 'topics', topicId, 'lessons'),
        async (snapshot) => {
          const lessonData = snapshot.docs.map((doc) => ({
            id: doc.id,
            title: doc.data().name,
            description: doc.data().description,
            lectureLink: doc.data().lectureLink,
          }));
          setLessons(lessonData);

          if (lessonData.length > 0) {
            const userDocRef = doc(db, 'users', userId);
            const userDoc = await getDoc(userDocRef);
            const lastWatchedLesson = userDoc.data()?.lastWatchedLesson?.[topicId];

            const currentLesson = lastWatchedLesson
              ? lessonData.find((lesson) => lesson.id === lastWatchedLesson) || lessonData[0]
              : lessonData[0];
            setSelectedLesson(currentLesson);
            setNextLesson(lessonData[lessonData.indexOf(currentLesson) + 1] || null);
          }
        },
        (error) => {
          console.error('Error fetching lessons: ', error);
        }
      );

      return () => unsubscribe();
    };

    fetchLessons();
  }, [classId, subjectId, topicId, userId]);

  const handleLessonSelect = async (lesson) => {
    setSelectedLesson(lesson);

    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      [`lastWatchedLesson.${topicId}`]: lesson.id,
    });

    const currentIndex = lessons.findIndex((l) => l.id === lesson.id);
    setNextLesson(lessons[currentIndex + 1] || null);
  };

  const handleNextLesson = () => {
    if (nextLesson) {
      handleLessonSelect(nextLesson);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleLessonSelect(item)}>
      <View style={styles.lessonItem}>
        <Text style={styles.lessonTitle}>{item.title}</Text>
        {selectedLesson?.id === item.id && (
          <View style={styles.lessonDetails}>
            <Text style={styles.lessonDescription}>{item.description}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const getEmbedLink = (lectureLink) => {
    const videoId = lectureLink.split('v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <View style={styles.container}>
      {selectedLesson && (
        <>
          <WebView
            style={styles.webview}
            source={{ uri: getEmbedLink(selectedLesson.lectureLink) }}
            allowsFullscreenVideo
            javaScriptEnabled
            domStorageEnabled
          />
          {nextLesson && (
            <TouchableOpacity style={styles.nextButton} onPress={handleNextLesson}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          )}
        </>
      )}
      <FlatList
        data={lessons}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    backgroundColor: '#fff',
    height: 200, // Adjust height as needed
  },
  listContainer: {
    padding: 10,
  },
  lessonItem: {
    backgroundColor: '#e0f7fa',
    marginVertical: 8,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#b2ebf2',
    elevation: 2,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00796b',
  },
  lessonDetails: {
    marginTop: 10,
  },
  lessonDescription: {
    fontSize: 14,
    color: '#004d40',
  },
  nextButton: {
    position: 'absolute',
    right: 20,
    bottom: 10,
    backgroundColor: '#00796b',
    padding: 10,
    borderRadius: 5,
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default LessonList;
