import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, Image, RefreshControl, Animated, Easing } from 'react-native';
import { firestore } from '../firebase';

const LeaderBoard = ({ userId }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userPosition, setUserPosition] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const fetchLeaderboardData = async () => {
    try {
      const snapshot = await firestore.collection('users')
        .orderBy('points', 'desc')
        .limit(40)
        .get();

      const leaderboard = snapshot.docs.map((doc, index) => ({
        id: doc.id,
        position: index + 1,
        username: doc.data().username,
        points: doc.data().points,
        profilePic: doc.data().profilePhoto, 
      }));

      setLeaderboardData(leaderboard);

     
      const userIndex = leaderboard.findIndex(user => user.id === userId);
      if (userIndex !== -1) {
        setUserPosition(userIndex + 1); 
      } else {
        setUserPosition(null); 
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  useEffect(() => {
    fetchLeaderboardData();
  }, [userId]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [scaleAnim]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLeaderboardData();
    setRefreshing(false);
  };

  const renderTopThree = () => (
    <View style={styles.topThreeContainer}>
      {leaderboardData[1] && (
        <View key={leaderboardData[1].id} style={[styles.topThreeItem, styles.lowerPosition]}>
          <Image source={{ uri: leaderboardData[1].profilePhoto }} style={styles.profilePic} />
          <Text style={styles.topThreePosition}>2</Text>
          <Text style={styles.topThreeUsername}>{leaderboardData[1].username}</Text>
          <Text style={styles.topThreePoints}>{leaderboardData[1].points} pts</Text>
        </View>
      )}
      {leaderboardData[0] && (
        <View key={leaderboardData[0].id} style={styles.topThreeItem}>
          <Animated.Image source={{ uri: leaderboardData[0].profilePhoto }} style={[styles.profilePicLarge, { transform: [{ scale: scaleAnim }] }]} />
          <View style={styles.crownContainer}>
            <Text style={styles.crown}>👑</Text>
          </View>
          <Text style={styles.topThreePosition}>1</Text>
          <Text style={styles.topThreeUsername}>{leaderboardData[0].username}</Text>
          <Text style={styles.topThreePoints}>{leaderboardData[0].points} pts</Text>
        </View>
      )}
      {leaderboardData[2] && (
        <View key={leaderboardData[2].id} style={[styles.topThreeItem, styles.lowerPosition]}>
          <Image source={{ uri: leaderboardData[2].profilePhoto }} style={styles.profilePic} />
          <Text style={styles.topThreePosition}>3</Text>
          <Text style={styles.topThreeUsername}>{leaderboardData[2].username}</Text>
          <Text style={styles.topThreePoints}>{leaderboardData[2].points} pts</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      {renderTopThree()}
      {userPosition !== null && (
        <Text style={styles.userPosition}>
          Your Position: {userPosition}
        </Text>
      )}
      <FlatList
        data={leaderboardData.slice(3)}
        renderItem={({ item }) => (
          <View style={[styles.leaderboardItem, item.id === userId && styles.highlight]}>
            <Text style={styles.position}>{item.position}</Text>
            <Image source={{ uri: item.profilePic }} style={styles.smallProfilePic} />
            <Text style={styles.username}>{item.username}</Text>
            <Text style={styles.points}>{item.points} pts</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#a0e075']}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#002D5D',
  },
  topThreeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  topThreeItem: {
    alignItems: 'center',
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#D0AA66',
  },
  profilePicLarge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#a0e075',
  },
  lowerPosition: {
    marginTop: 50,
  },
  crownContainer: {
    position: 'absolute',
    top: -10,
    right: 0,
  },
  crown: {
    fontSize: 20,
    color: '#a0e075',
  },
  topThreePosition: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    color: '#002D5D',
  },
  topThreeUsername: {
    fontSize: 14,
    color: '#424242',
    marginTop: 5,
  },
  topThreePoints: {
    fontSize: 14,
    color: '#424242',
  },
  userPosition: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    color: '#004D40',
  },
  leaderboardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
  highlight: {
    backgroundColor: '#a0e075',
  },
  position: {
    fontSize: 18,
    width: 50,
    textAlign: 'center',
    color: '#424242',
  },
  smallProfilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  username: {
    flex: 1,
    marginLeft: 10,
    fontSize: 18,
    color: '#424242',
  },
  points: {
    fontSize: 18,
    width: 80,
    textAlign: 'right',
    color: '#424242',
  },
  listContainer: {
    paddingBottom: 20,
  },
});

export default LeaderBoard;
