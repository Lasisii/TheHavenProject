import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const TaskList = ({ user }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const db = getFirestore();

  const fetchTasks = async () => {
    if (user) {
      setLoading(true);
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setTasks(userData.tasks || []);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Your Tasks</Text>
        <TouchableOpacity style={styles.reloadButton} onPress={fetchTasks} disabled={loading}>
          <Icon name="refresh" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text style={styles.taskDescription}>{item.description}</Text>
            {item.deadline && (
              <Text style={styles.taskDeadline}>
                Deadline: {new Date(item.deadline).toLocaleString()}
              </Text>
            )}
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  heading: {
    fontFamily: 'PoppinsExtraBold',
    fontSize: 15,
    color: '#002D5D',
  },
  reloadButton: {
    backgroundColor: '#D0AA66',
    padding: 5,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskContainer: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D0AA66',
    backgroundColor: '#fff',

  },
  taskTitle: {
    fontWeight: 'bold',
  },
  taskDescription: {
    fontStyle: 'italic',
  },
  taskDeadline: {
    fontSize: 12,
    color: 'gray',
  },
});

export default TaskList;
