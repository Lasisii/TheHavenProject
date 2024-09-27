import React, { useState, useEffect, useRef } from 'react'; 
import { View, Text, FlatList, StyleSheet, Image, RefreshControl, Animated, Easing } from 'react-native';
import { firestore } from '../firebase';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
import flame from '../assets/images/flame.png';

const LeaderBoard = ({ userId }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userPosition, setUserPosition] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [userProfilePhoto, setUserProfilePhoto] = useState(null); 
  const [isLoading, setIsLoading] = useState(true);
  const [userPoints, setUserPoints] = useState(null); 
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const auth = getAuth();
  const db = getFirestore();

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
        profilePic: doc.data().profilePhoto || 'path/to/default/profileImage.jpg',
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

  useEffect(() => {
    const fetchUserDetails = async () => {
      const user = auth.currentUser;

      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            setUserProfilePhoto(userData.profilePhoto || 'path/to/default/profileImage.jpg'); 
            setUserPoints(userData.points || 0); 
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
      setIsLoading(false);
    };
    fetchUserDetails(); 
  }, []);

  const renderTopThree = () => (
    <View style={styles.topThreeContainer}>
      {leaderboardData[1] && (
        <View key={leaderboardData[1].id} style={[styles.topThreeItem, styles.lowerPosition]}>
          <Image source={{ uri: leaderboardData[1].profilePic }} style={styles.profilePic} />
          <Text style={styles.topThreePosition}>2</Text>
          <Text style={styles.topThreeUsername}>{leaderboardData[1].username}</Text>
          <Text style={styles.topThreePoints}>{leaderboardData[1].points} pts</Text>
        </View>
      )}
      {leaderboardData[0] && (
        <View key={leaderboardData[0].id} style={styles.topThreeItem}>
          <Animated.Image source={{ uri: leaderboardData[0].profilePic }} style={[styles.profilePicLarge, { transform: [{ scale: scaleAnim }] }]} />
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
          <Image source={{ uri: leaderboardData[2].profilePic }} style={styles.profilePic} />
          <Text style={styles.topThreePosition}>3</Text>
          <Text style={styles.topThreeUsername}>{leaderboardData[2].username}</Text>
          <Text style={styles.topThreePoints}>{leaderboardData[2].points} pts</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topper}>
        <Image 
          source={{ uri: userProfilePhoto }} 
          style={styles.profileImage} 
        />
        <Text style={styles.title}>Leaderboard</Text>
        <View style={styles.pointsContainer}>
          <Image source={flame} style={styles.flameIcon} />
          <Text style={styles.pointsText}>
            {userPoints !== null ? userPoints : 'Points Unavailable'} 
          </Text>
        </View>
      </View>
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
    padding: 0,
    backgroundColor: '#f8f8f8',
  },
  topper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#002D5D',
    height: 90,
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 18,
    color: 'white',
    marginLeft: 5,
  },
  flameIcon: {
    width: 24,
    height: 24,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  smallProfilePic: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  position: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#002D5D',
  },
  username: {
    flex: 1,
    fontSize: 16,
    color: '#424242',
  },
  points: {
    fontSize: 16,
    color: '#424242',
  },
  highlight: {
    backgroundColor: '#D0AA66',
  },
  listContainer: {
    paddingBottom: 20,
  },
});

export default LeaderBoard;
