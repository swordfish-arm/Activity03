import { GoogleSignin } from '@react-native-google-signin/google-signin';
import React, { useState, useEffect } from 'react';
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import {
  View,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { app, firebaseConfig } from './../../firebaseConfig';
import { firestore } from './../../firebaseConfig';
import { signOut } from 'firebase/auth';
import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from '@react-native-firebase/auth';
const db = collection(firestore, 'tasks');



const HomeScreen = ({ navigation }) => {
  const [userDetails, setUserDetails] = React.useState();
  React.useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    const userData = await AsyncStorage.getItem("userData");
    const UserLoggedInData = await AsyncStorage.getItem("UserLoggedInData");

    if (userData) {
      console.log("Home Screen");
      console.log(JSON.parse(userData));
      setUserDetails(JSON.parse(userData));
    }

    if(UserLoggedInData){
      console.log("UserLoggedInData >>");
      console.log(JSON.stringify(JSON.parse(UserLoggedInData),null, 2));
      console.log("UserLoggedInData <<");

      let udata = JSON.parse(UserLoggedInData);
      setUserDetails(udata.user);
    }

  };
  const logout = () => {
    AsyncStorage.setItem(
      "userData",
      JSON.stringify({ ...userDetails, loggedIn: false })
    );
    auth()
    .signOut()
    .then(() => console.log('User signed out!'));

    navigation.navigate("SignInScreen");
  };

  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    getUserData();
  },[]);
  
  const toggleTaskStatus = async (taskId, isDone) => {
    try {
      const taskRef = doc(db, taskId);
      await updateDoc(taskRef, { done: !isDone });
      fetchData();
      const alertType = isDone ? ALERT_TYPE.WARNING : ALERT_TYPE.SUCCESS;
      const alertMessage = isDone ? 'Task Marked as Undone!' : 'Task Marked as Done!';

      Dialog.show({
        type: alertType,
        title: alertType === ALERT_TYPE.SUCCESS ? 'SUCCESS' : 'WARNING',
        textBody: alertMessage,
        button: "Close",
      });

    } catch (error) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "WARNING",
        textBody: "Failed to toggle task status. Please try again.",
        button: "Close",
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const querySnapshot = await getDocs(db);
        const tasksData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(tasksData);
      } catch (error) {
        Dialog.show({
          type: ALERT_TYPE.WARNING,
          title: "WARNING",
          textBody: "Failed to fetch tasks. Please try again.",
          button: "Close",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addTask = async () => {
    try {
      if (taskText.trim() === '') {
        Dialog.show({
          type: ALERT_TYPE.WARNING,
          title: "WARNING",
          textBody: "Task text cannot be empty",
          button: "Close",
        });
        return;
      }

      if (editTaskId) {
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: "SUCCESS",
          textBody: "Task Updated!",
          button: "Close",
        });
        const taskRef = doc(db, editTaskId);
        await updateDoc(taskRef, { text: taskText });

        setEditTaskId(null);
      } else {
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: "SUCCESS",
          textBody: "Task Added!",
          button: "Close",
        });
        await addDoc(db, { text: taskText });
      }
      setTaskText('');
      fetchData();
    } catch (error) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "WARNING",
        textBody: "Failed to add/update task. Please try again.",
        button: "Close",
      });
    }
  };

  const handleLogout = async () => {
    try {
      // Check if the user is signed in with Google
      const isGoogleSignedIn = await GoogleSignin.isSignedIn();
  
      // Check if the user is signed in with Firebase
      const isFirebaseSignedIn = auth().currentUser;
  
      if (isGoogleSignedIn) {
        // User is signed in with Google, perform Google Sign-Out
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
        navigation.replace('SignInScreen');
      } else if (isFirebaseSignedIn) {
        // User is signed in with Firebase, perform Firebase Sign-Out
        await auth().signOut();
        navigation.replace('SignInScreen');
      } else {
        // User is not signed in
        console.log('No user is currently signed in.');
      }
    } catch (error) {
      console.error('Logout error:', error.message);
      alert('Logout failed. Please try again.');
    }
  };

  const deleteTask = async (taskId) => {
    const confirmDelete = () => {

      Alert.alert('Confirm Deletion', 'Are you sure you want to delete this task?', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            await deleteDoc(doc(db, taskId));
            fetchData();
          },
        },
      ]);
    };

    confirmDelete();
  };

  const editTask = (taskId, taskText) => {
    setTaskText(taskText);
    setEditTaskId(taskId);
  };

  const fetchData = async () => {
    const querySnapshot = await getDocs(db);
    const tasksData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setTasks(tasksData);
  };

  showAlert = () => {
    this.setState({
      showAlert: true
    });
  };

  hideAlert = () => {
    this.setState({
      showAlert: false
    });
  };
  return (
    <AlertNotificationRoot style={styles.container}>
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
     
      
      

      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={{
          width: '100%',
          height: '100%',
          paddingVertical: 10,
          paddingHorizontal: 20,
        }}
      >
        <View style={{ flex: 1, padding: 16 }}>
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 40,
              marginBottom: 20,
            }}
          >
            {userDetails?.photoURL && (
              <Image style={styles.image} source={{ uri: userDetails?.photoURL }} />
              )}

            <Text
              style={{
                fontSize: 30,
                color: '#fff',
                letterSpacing: 1,
              }}
            >
             {userDetails?.displayName}
            </Text>
          </View>
          <TextInput
            placeholder="Add a new task"
            value={taskText}
            onChangeText={(text) => setTaskText(text)}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 20,
              fontSize: 14,
              color: '#fff',
              borderRadius: 10,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              marginBottom: 20,
            }}
          />
          <TouchableOpacity
            onPress={addTask}
            style={{
              width: '100%',
              paddingVertical: 14,
              paddingHorizontal: 20,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#4285f4',
              borderRadius: 10,
              marginVertical: 5,
            }}
          >
            <Text style={{ color: '#fff' }}>{editTaskId ? 'Update' : 'Add Task'}</Text>
          </TouchableOpacity>
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginVertical: 8,
                }}
              >
                <Text style={{ color: '#fff', textDecorationLine: item.done ? 'line-through' : 'none' }}>
                  {item.text}
                </Text>
                <View style={{ flexDirection: 'row' }}>
                  {item.done ? (
                    <View />
                  ) : (
                    <TouchableOpacity onPress={() => editTask(item.id, item.text)} style={{ marginRight: 8 }}>
                      <MaterialCommunityIcons name="circle-edit-outline" size={24} color="green" />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={() => toggleTaskStatus(item.id, item.done)}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      {item.done ? (
                        <AntDesign name="checkcircleo" size={24} color="blue" />
                      ) : (
                        <Feather name="circle" size={24} color="blue" />
                      )}
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteTask(item.id)}>
                    <MaterialCommunityIcons name="delete-circle" size={24} color="pink" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />

          {loading && <ActivityIndicator size="large" color="#3498db" />}
          {error && <Text style={{ color: 'red' }}>{error}</Text>}
        </View>
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            width: '100%',
            paddingVertical: 14,
            paddingHorizontal: 20,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#34a853',
            borderRadius: 10,
            marginVertical: 10,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 16 }}>Logout</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
    </AlertNotificationRoot>
  );
};


export default HomeScreen;

const styles = StyleSheet.create({
  text: {
    textAlign: "center",
    fontSize: 20,
    color: "black",
  },
  image:{
    width: 150,
    height: 150,
    alignSelf: 'center',
    borderRadius: 1000,
  }
});