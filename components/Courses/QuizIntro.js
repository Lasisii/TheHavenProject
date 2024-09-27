import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const QuizIntro = ({ route }) => {
  const { classId, subjectId, topicId, userId } = route.params;
  const navigation = useNavigation();

  const handleStartQuiz = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Quiz', params: { classId, subjectId, topicId, userId } }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.quizTitle}>Quiz: {topicId} Quiz</Text>
      <Text style={styles.classInfo}>Class: {classId}</Text>
      <Text style={styles.subjectInfo}>Subject: {subjectId}</Text>
      <TouchableOpacity style={styles.startButton} onPress={handleStartQuiz}>
        <Text style={styles.startButtonText}>Begin Quiz</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#002D5D', 
  },
  quizTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700', 
    marginBottom: 20,
    textAlign: 'center',
  },
  classInfo: {
    fontSize: 20,
    color: '#ffffff', 
    marginBottom: 10,
  },
  subjectInfo: {
    fontSize: 20,
    color: '#ffffff', 
    marginBottom: 30,
  },
  startButton: {
    backgroundColor: '#FFD700', 
    padding: 15,
    borderRadius: 15,
    width: '50%',
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002D5D', 
  },
});

export default QuizIntro;
