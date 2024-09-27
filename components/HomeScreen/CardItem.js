
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';

const CardItem = ({ title, description, progress }) => {
  const progressPercentage = Math.round(progress * 100);

  return (
    <View style={styles.card}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.progressLabel}>Overall Progress: {progressPercentage}%</Text>
        <Progress.Bar 
          progress={progress} 
          width={180} 
          color={'#B08D57'} 
          unfilledColor={'#D3D3D3'} 
          borderWidth={0}
          style={styles.progressBar} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 270,
    height: 150,
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D0AA66',
    overflow: 'hidden',
  },
  textContainer: {
    padding: 15,
  },
  title: {
    fontSize: 20,
    color: '#002D5D',
  },
  description: {
    fontSize: 14,
    color: '#9E9E9E',
  },
  progressLabel: {
    marginTop: 50,
    marginBottom: 5,
    fontSize: 14,
    color: '#002D5D',
  },
  progressBar: {
    marginBottom: 10,
  },
});

export default CardItem;
