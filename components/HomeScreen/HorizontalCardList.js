
import React from 'react';
import { FlatList, View, StyleSheet, Text } from 'react-native';
import CardItem from './CardItem';

const data = [
  { id: '1', title: '1.1 Living Things', description: 'Science. Class 3',  },
  { id: '2', title: '1.1 Living Things', description: 'Science. Class 3',  },
  { id: '3', title: '1.1 Living Things', description: 'Science. Class 3', },
];

const HorizontalCardList = () => {
  return (
    <View style={styles.listContainer}>
      <Text style={styles.TopText}>Continue Learning</Text>
      <FlatList
        data={data}
        renderItem={({ item }) => <CardItem title={item.title} description={item.description} imagelink={item.imagelink} />}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    marginTop: 5,
  },
  TopText:{
    fontFamily:'PoppinsBold',
    fontSize: 20,
    marginLeft: 12
  }
});

export default HorizontalCardList;
