import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, RefreshControl } from 'react-native';
import { auth } from '../firebase';
import Header from '../components/HomeScreen/Header';
import HorizontalCardList from '../components/HomeScreen/HorizontalCardList';
import TaskList from '../components/HomeScreen/Tasklist';

const HomeScreen = () => {
  const [user, setUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000); 
  };

  const renderHeader = () => <Header />;

  const renderHorizontalCardList = () => (
    <View style={styles.horizontalListContainer}>
      <HorizontalCardList />
    </View>
  );

  const renderTaskList = () => (
    <View style={styles.taskListContainer}>
      <TaskList user={user} />
    </View>
  );

  const data = ['horizontalList', 'taskList'];

  return (
    <SafeAreaView style={styles.container}>
      {user ? (
        <FlatList
          data={data}
          renderItem={({ item }) =>
            item === 'horizontalList' ? renderHorizontalCardList() : renderTaskList()
          }
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.flatListContentContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#a0e075']} // You can customize the color of the refresh indicator
            />
          }
        />
      ) : (
        <Text>Loading...</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  horizontalListContainer: {
    marginVertical: 10,
  },
  taskListContainer: {
    marginVertical: 10,
  },
  flatListContentContainer: {
    paddingBottom: 100,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    paddingLeft: 10,
  },
});

export default HomeScreen;
