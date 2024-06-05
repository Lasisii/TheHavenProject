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
            fontSize: 18, 
            fontWeight: 'bold', 
            fontFamily: 'PoppinsBold', 
            color: '#002D5D', 
            
          },
         
          tabBarIndicatorStyle: {
            backgroundColor: '#D0AA66', 
            height: 50, 
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
