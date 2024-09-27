import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import LoginScreen from './screens/loginScreen';
import HomeScreen from './screens/homeScreen';
import SignUp from './screens/SignUp';
import MyCourse from './screens/MyCourse';
import LeaderBoard from './screens/LeaderBoard';
import ProfileScreen from './screens/ProfileScreen';
import TopicList from './components/Courses/TopicList';
import QuizIntro from './components/Courses/QuizIntro';
import Quiz from './components/Courses/Quiz';
import QuizResults from './components/Courses/QuizResults';
import LessonList from './components/Courses/LessonList';
import TodoScreen from './components/Profile/ToDoScreen';
import Welcome from './screens/Welcome';
import { auth } from './firebase';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Foundation, FontAwesome, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import registerNNPushToken from 'native-notify';
import logo from './assets/images/logo.png'

SplashScreen.preventAutoHideAsync();


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  registerNNPushToken(22997, 'YZ7If3fpYWiMaGCU7EKpBW');



  const [fontsLoaded] = useFonts({
    'Nunito': require('./assets/fonts/Nunito-Regular.ttf'),
    'NunitoMedium': require('./assets/fonts/Nunito-Medium.ttf'),
    'Nunito-SemiBold': require('./assets/fonts/Nunito-SemiBold.ttf'),
    'Nunito-Bold': require('./assets/fonts/Nunito-Bold.ttf'),
    'PoppinsRegular': require('./assets/fonts/Poppins-Regular.ttf'),
    'PoppinsBold': require('./assets/fonts/Poppins-Bold.ttf'),
    'PoppinsMedium': require('./assets/fonts/Poppins-Medium.ttf'),
    'PoppinsExtraBold': require('./assets/fonts/Poppins-ExtraBold.ttf'),
  });

  const [isAppReady, setAppReady] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function prepare() {
      await new Promise(resolve => setTimeout(resolve, 2000)); 
      setAppReady(true);
      await SplashScreen.hideAsync();
    }
    prepare();
  }, []);

  if (!isAppReady || !fontsLoaded) {
    return (
      <View style={styles.splashContainer}>
        <View style={styles.logoContainer}>
        <Image source = {logo} />
        </View>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <HomeTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}

const HomeTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
      tabBarActiveBackgroundColor: '#D0AA66',
      tabBarStyle: styles.tabBar,
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeNavigator}
      options={{
        tabBarIcon: ({ focused }) => (
          <Foundation name="home" size={24} color={focused ? '#002D5D' : 'grey'} />
        ),
      }}
    />
    <Tab.Screen
      name="MyCourse"
      component={MyCourseNavigator}
      options={{
        tabBarIcon: ({ focused }) => (
          <FontAwesome5 name="book-open" size={20} color={focused ? '#002D5D' : 'grey'} />
        ),
      }}
    />
    <Tab.Screen
      name="LeaderBoard"
      component={LeaderBoard}
      options={{
        tabBarIcon: ({ focused }) => (
          <MaterialIcons name="leaderboard" size={24} color={focused ? '#002D5D' : 'grey'} />
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileNavigator}
      options={{
        tabBarIcon: ({ focused }) => (
          <FontAwesome name="user" size={24} color={focused ? '#002D5D' : 'grey'} />
        ),
      }}
    />
  </Tab.Navigator>
);

const HomeNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
  </Stack.Navigator>
);

const MyCourseNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Courses" component={MyCourse} options={{ headerShown: false }} />
    <Stack.Screen name="TopicList" component={TopicList} />
    <Stack.Screen name="LessonList" component={LessonList}  />
    <Stack.Screen name="QuizIntro" component={QuizIntro} options={{ headerShown: false }} />
    <Stack.Screen name="Quiz" component={Quiz} options={{ headerShown: false }} />
    <Stack.Screen name="QuizResults" component={QuizResults} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="SignUp" component={SignUp} />
    <Stack.Screen name="Welcome" component={Welcome} />
  </Stack.Navigator>
);

const ProfileNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Profile">
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="Todo" component={TodoScreen} />
  </Stack.Navigator>
);

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logoContainer: {
    // Style for your logo
  },
  tabBar: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
});
