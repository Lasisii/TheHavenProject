import React from 'react';
import { View, StyleSheet } from 'react-native';
import SubjectCard from './SubjectCard';

const subjects = ['Math', 'Science', 'English', 'Social'];

const SubjectsTab = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {subjects.map(subject => (
        <SubjectCard
          key={subject}
          subject={subject}
          onPress={() => navigation.navigate('SubjectDetail', { subject })}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFC',
    padding: 10,
  },
});

export default SubjectsTab;
