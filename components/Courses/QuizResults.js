import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, BackHandler } from 'react-native';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as Progress from 'react-native-progress';

const QuizResults = ({ route }) => {
  const { score, questions, userId, classId, subjectId } = route.params;
  const navigation = useNavigation();
  const totalQuestions = questions.length;
  const scorePercentage = (score / (totalQuestions * 3)) * 100; 

  useEffect(() => {
    const updateUserPoints = async () => {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, {
        points: increment(score),
      });
    };

    updateUserPoints();
  }, [score, userId]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => true; 
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  const handleBackToTopics = () => {
    navigation.replace('Courses', { classId, subjectId, userId });
  };

  const getEmojiForScore = () => {
    if (scorePercentage >= 80) return '🎉'; 
    if (scorePercentage >= 50) return '👏'; 
    return '😕'; 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz Completed {getEmojiForScore()}</Text>

      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>Your Score:</Text>
        <Text style={styles.scoreValue}>{score} points</Text>
        <Progress.Circle 
          size={150} 
          progress={scorePercentage / 100} 
          showsText 
          formatText={() => `${Math.round(scorePercentage)}%`} 
          color={scorePercentage >= 50 ? '#4caf50' : '#f44336'} 
          style={styles.progressCircle} 
        />
      </View>

      <Text style={styles.totalQuestions}>Total Questions: {totalQuestions}</Text>

      <TouchableOpacity style={styles.button} onPress={handleBackToTopics}>
        <Text style={styles.buttonText}>Back to Topics</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#002D5D',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#D0AA66',
    marginBottom: 30,
    textAlign: 'center',
  },
  scoreContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreLabel: {
    fontSize: 18,
    color: '#495057',
    marginBottom: 10,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 20,
  },
  progressCircle: {
    marginVertical: 20,
  },
  totalQuestions: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default QuizResults;
