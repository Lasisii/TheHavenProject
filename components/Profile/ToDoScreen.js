import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, StyleSheet } from 'react-native';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function TodoScreen() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
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
          if (!userData.tasks) {
            await updateDoc(userDocRef, { tasks: [] });
            setTasks([]);
          } else {
            setTasks(userData.tasks);
          }
        } else {
          setTasks([]);
        }
      }
    };
    fetchTasks();
  }, []);

  const addTask = async () => {
    const user = auth.currentUser;
    if (user && newTask && deadline && description) {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      const newTaskObject = { title: newTask, description, deadline: deadline.toISOString(), completed: false };

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const updatedTasks = [...(userData.tasks || []), newTaskObject];
        await updateDoc(userDocRef, { tasks: updatedTasks });
        setTasks(updatedTasks);
      } else {
        await updateDoc(userDocRef, { tasks: [newTaskObject] });
        setTasks([newTaskObject]);
      }

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

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = (date) => {
    setDeadline(date);
    hideDatePicker();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>To-Do List</Text>
      {tasks.length === 0 ? (
        <Text>Let's set some goals and reminders!</Text>
      ) : (
        <FlatList
          data={tasks}
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
                  {item.completed && <Text>✔️</Text>}
                </View>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
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
              placeholderTextColor= '#002D5D'
              value={newTask}
              onChangeText={setNewTask}
            />
           <TextInput
              style={styles.input}
              placeholder="Description"
              placeholderTextColor= '#002D5D' 
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f8fa',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    color: 'black',
  },
  addButton: {
    backgroundColor: '#D0AA66',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 80, 
    right: 30,
    width: 60,
    height: 60,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 36,
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  taskTitle: {
    fontWeight: 'bold',
  },
  taskDescription: {
    fontStyle: 'italic',
  },
  taskDeadline: {
    fontSize: 12,
    color: '#002D5D',
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalView: {
    height: '50%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#002D5D',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  modalHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#D0AA66',
    padding: 15,
    borderWidth: 1,
    borderColor: '#002D5D',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    color:'#002D5D',
    
  },
  cancelButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#D0AA66',
    fontSize: 16,
  },
});
