import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, StyleSheet, Image } from 'react-native';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import flame from '../../assets/images/flame.png';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

function MyTasks({ tasks, completeTask }) {
  return (
    <FlatList
      data={tasks.filter(task => !task.completed)}
      renderItem={({ item, index }) => (
        <View style={styles.taskContainer}>
          <View>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text style={styles.taskDescription}>{item.description}</Text>
            {item.deadline && (
              <Text style={styles.taskDeadline}>
                Deadline: {new Date(item.deadline).toLocaleString()}
              </Text>
            )}
          </View>
          <TouchableOpacity onPress={() => completeTask(index)}>
            <View style={styles.circle}>
              {item.completed ? <Text>✔️</Text> : null}
            </View>
          </TouchableOpacity>
        </View>
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  );
}

function CompletedTasks({ tasks }) {
  return (
    <FlatList
      data={tasks.filter(task => task.completed)}
      renderItem={({ item }) => (
        <View style={styles.taskContainer}>
          <View>
            <Text style={[styles.taskTitle, styles.completedTask]}>{item.title}</Text>
            <Text style={[styles.taskDescription, styles.completedTask]}>{item.description}</Text>
            {item.deadline && (
              <Text style={[styles.taskDeadline, styles.completedTask]}>
                Deadline: {new Date(item.deadline).toLocaleString()}
              </Text>
            )}
          </View>
        </View>
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  );
}

export default function TodoScreen() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userId, setUserId] = useState(null); 
  const [userProfilePhoto, setUserProfilePhoto] = useState(null); 
  const [userPoints, setUserPoints] = useState(null); 
  const [isLoading, setIsLoading] = useState(true);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setTasks(userData.tasks || []);
        }
      }
    };
    fetchTasks();
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const user = auth.currentUser;

      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            setUserId(user.uid);
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

  const addTask = async () => {
    const user = auth.currentUser;
    if (user && newTask && deadline && description) {
      const userDocRef = doc(db, 'users', user.uid);
      const newTaskObject = { 
        title: newTask, 
        description, 
        deadline: deadline.toISOString(), 
        completed: false 
      };
  
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.exists() ? userDoc.data() : {};
      const updatedTasks = [...(userData.tasks || []), newTaskObject];
      await updateDoc(userDocRef, { tasks: updatedTasks });
      setTasks(updatedTasks);
  
      setNewTask('');
      setDescription('');
      setDeadline(null);
      setModalVisible(false);
    }
  };

  const completeTask = async (index) => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const updatedTasks = userData.tasks.map((task, i) =>
          i === index ? { ...task, completed: true } : task
        );
        await updateDoc(userDocRef, { tasks: updatedTasks });
        setTasks(updatedTasks);
      }
    }
  };

  const showDatePicker = () => setDatePickerVisible(true);

  const hideDatePicker = () => setDatePickerVisible(false);

  const handleConfirm = (date) => {
    setDeadline(date);
    hideDatePicker();
  };

  return (
    <>
      <View style={styles.topper}>
        <Image 
          source={{ uri: userProfilePhoto }} 
          style={styles.profileImage} 
        />
        <Text style={styles.title}>Tasks</Text>
        <View style={styles.pointsContainer}>
          <Image source={flame} style={styles.flameIcon} />
          <Text style={styles.pointsText}>
            {userPoints !== null ? userPoints : 'Points Unavailable'} 
          </Text>
        </View>
      </View>
      <Tab.Navigator>
        <Tab.Screen name="My Tasks">
          {() => <MyTasks tasks={tasks} completeTask={completeTask} />}
        </Tab.Screen>
        <Tab.Screen name="Completed Tasks">
          {() => <CompletedTasks tasks={tasks} />}
        </Tab.Screen>
      </Tab.Navigator>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide" 
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalHeading}>Add New Task</Text>
            <TextInput
              style={styles.input}
              placeholder="New Task"
              placeholderTextColor="#002D5D"
              value={newTask}
              onChangeText={setNewTask}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              placeholderTextColor="#002D5D"
              value={description}
              onChangeText={setDescription}
            />
            <TouchableOpacity style={styles.input} onPress={showDatePicker}>
              <Text>
                {deadline ? deadline.toLocaleString() : 'Set Deadline'}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="datetime"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
              textColor="#D0AA66"
            />
            <TouchableOpacity style={styles.saveButton} onPress={addTask}>
              <Text style={styles.saveButtonText}>Save Task</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: '#D0AA66',
    padding: 15,
    borderRadius: 30, 
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 80, 
    right: 30,
    width: 60,
    height: 60,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, 
  },
  addButtonText: {
    color: '#fff',
    fontSize: 60,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002D5D',
  },
  taskDescription: {
    fontSize: 14,
    color: '#002D5D',
  },
  taskDeadline: {
    fontSize: 12,
    color: '#D0AA66',
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#D0AA66',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#002D5D',
    height: 100,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  modalHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#002D5D',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#D0AA66',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#D0AA66',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#999',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
