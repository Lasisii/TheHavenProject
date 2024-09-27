import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigation } from '@react-navigation/native';
import * as Progress from 'react-native-progress';

const Quiz = ({ route }) => {
  const { classId, subjectId, topicId, userId } = route.params;
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30); 
  const navigation = useNavigation();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, 'classes', classId, 'subjects', subjectId, 'topics', topicId, 'quizQuestions')
        );
        const questionData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setQuestions(questionData);
      } catch (err) {
        setError('Failed to load questions. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [classId, subjectId, topicId]);

  useEffect(() => {
    if (timeLeft === 0) {
      handleNextQuestion();
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerSelection = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];

    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(prevScore => prevScore + 3);
    }

    setSelectedAnswer(null);
    setTimeLeft(30);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      navigation.replace('QuizResults', {
        score: score + (selectedAnswer === currentQuestion.correctAnswer ? 3 : 0),
        questions,
        userId,
      });
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D0AA66" />
        <Text style={styles.loadingText}>Loading Quiz...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = (currentQuestionIndex + 1) / questions.length;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Progress.Bar progress={progress} width={null} height={10} color="#D0AA66" style={styles.progressBar} />

        {currentQuestion && (
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>

            {currentQuestion.image && (
              <Image source={{ uri: currentQuestion.image }} style={styles.image} />
            )}

            {currentQuestion.answers.map((answer, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.answerButton,
                  selectedAnswer === answer && styles.selectedAnswerButton,
                ]}
                onPress={() => handleAnswerSelection(answer)}
              >
                <Text style={styles.answerText}>{answer}</Text>
              </TouchableOpacity>
            ))}

            <Text style={styles.timerText}>Time Left: {timeLeft}s</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.nextButton, !selectedAnswer && styles.disabledButton]}
          onPress={handleNextQuestion}
          disabled={!selectedAnswer}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#002D5D',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 199,
    justifyContent: 'space-between',
  },
  progressBar: {
    marginBottom: 20,
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 15,
  },
  answerButton: {
    padding: 15,
    backgroundColor: '#ffffff',
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    transition: 'background-color 0.3s ease',
  },
  selectedAnswerButton: {
    backgroundColor: '#4caf50',
    borderColor: '#388e3c',
  },
  answerText: {
    fontSize: 16,
    color: '#333',
  },
  timerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D0AA66',
    marginTop: 20,
  },
  nextButton: {
    backgroundColor: '#D0AA66',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: '#002D5D',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#D0AA66',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginHorizontal: 20,
  },
});

export default Quiz;
