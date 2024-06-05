import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SubjectsTab from '../components/HomeScreen/SubjectsTab';

const Tab = createMaterialTopTabNavigator();

const CoursesScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.topper}>
      <Text style={styles.title}>Subjects</Text>
      </View>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: {
            fontSize: 18, // Customize font size
            fontWeight: 'bold', // Customize font weight
            fontFamily: 'PoppinsBold', // Use custom font (make sure it's loaded in your project)
            color: '#002D5D', // Customize label color
            
          },
         
          tabBarIndicatorStyle: {
            backgroundColor: '#D0AA66', // Customize the color of the indicator line
            height: 50, // Customize the height of the indicator line
            Color: 'white'
          },
        }}
      >
        <Tab.Screen name="1" component={SubjectsTab} />
        <Tab.Screen name="2" component={SubjectsTab} />
        <Tab.Screen name="3" component={SubjectsTab} />
        <Tab.Screen name="4" component={SubjectsTab} />
        <Tab.Screen name="5" component={SubjectsTab} />
      </Tab.Navigator>
    </View>
  );
};

export default CoursesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    
   //fontWeight: 'bold',
    marginTop: 15,
    paddingLeft:10,
    fontSize:30 ,
    fontFamily:'PoppinsBold',
    color: 'white'
  },
  topper: {
    backgroundColor:'#002D5D',
    marginTop:20
  }
});