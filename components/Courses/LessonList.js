import React, { useState, useEffect } from 'react'; 
import { FlatList, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { collection, onSnapshot, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../firebase';
import { WebView } from 'react-native-webview';

const LessonList = ({ route }) => {
  const { classId, subjectId, topicId, userId } = route.params;
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [nextLesson, setNextLesson] = useState(null);
  const [loading, setLoading] = useState(true); 
  const navigation = useNavigation();

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
            lessonnumber: doc.data().lessonnumber, 
          }));

          
          lessonData.sort((a, b) => a.lessonnumber - b.lessonnumber);
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
          setLoading(false); 
        },
        (error) => {
          console.error('Error fetching lessons: ', error);
          setLoading(false); 
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
      <View style={[styles.lessonItem, selectedLesson?.id === item.id && styles.selectedItem]}>
        <View style={styles.lessonHeader}>
          <Text style={styles.lessonTitle}>{item.title}</Text>
        </View>
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

  const handleQuizStart = () => {
    navigation.navigate('QuizIntro', { classId, subjectId, topicId, userId });
  };

  return (
    <View style={styles.container}>
      {loading ? ( 
        <ActivityIndicator size="large" color="#002D5D" style={styles.loader} />
      ) : (
        <>
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
                  <Text style={styles.nextButtonText}>Next Lesson</Text>
                </TouchableOpacity>
              )}
            </>
          )}
          <FlatList
            data={lessons}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            ListFooterComponent={
              <View style={styles.footer}>
                <TouchableOpacity style={styles.quizButton} onPress={handleQuizStart}>
                  <Text style={styles.quizButtonText}>Start Quiz</Text>
                </TouchableOpacity>
              </View>
            }
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webview: {
    height: 220,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  lessonItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    elevation: 3,
  },
  selectedItem: {
    backgroundColor: '#e0f7fa',
    borderColor: '#00796b',
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004d40',
  },
  lessonDetails: {
    marginTop: 5,
    padding: 5,
    borderRadius: 5,
  },
  lessonDescription: {
    fontSize: 14,
    color: '#004d40',
    lineHeight: 20,
  },
  nextButton: {
    backgroundColor: '#00796b',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    padding: 15,
    alignItems: 'center',
  },
  quizButton: {
    backgroundColor: '#002D5D',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
  },
  quizButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LessonList;
