import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SubjectDetailScreen = ({ route }) => {
  const { subject } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{subject}</Text>
      <Text style={styles.detail}>Details about {subject}...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFC',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  detail: {
    fontSize: 16,
    marginTop: 20,
  },
});

export default SubjectDetailScreen;
