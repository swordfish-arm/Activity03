import React, { useState } from 'react';
import { View, Text, Image, Button, Alert,TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getAuth, signInWithEmailAndPassword, signInWithCredential} from 'firebase/auth';
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";

import firebaseConfig   from './../../firebaseConfig'; 
import 'expo-dev-client';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';


const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const SignInScreen = ({ navigation }) => {
  GoogleSignin.configure({
    webClientId: "658706858962-9odn226n4aepqa62d8sl689r7ta6a90j.apps.googleusercontent.com",
  });

  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = React.useState(true);
  const [user, setUser] = React.useState();

  const onGoogleButtonPress = async() => {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const { idToken } = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    const user_sign_in = auth().signInWithCredential(googleCredential);
    
    user_sign_in
      .then((user) => {
        
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: "SUCCESS",
          textBody: "Welcome!",
          button: "Close",
        });
        navigation.navigate("HomeScreen")
        console.log(user);
    })
      .catch((error) => {
        console.log(error);
      });
  };

  

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  React.useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  React.useEffect(() => {
    if (user){
    navigation.navigate("HomeScreen")
    AsyncStorage.setItem(
      "UserLoggedInData",
      JSON.stringify({ user, loggedIn: true})
    );
  }else {
    console.log("NO USER!!");
  }
  }, []);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const userCredential = await signInWithEmailAndPassword(getAuth(firebaseConfig), values.email, values.password);
        navigation.navigate('HomeScreen');
      } catch (error) {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
          Dialog.show({
            type: ALERT_TYPE.WARNING,
            title: "Error",
            textBody: "Invalid email or password. Please try again.",
            button: "Close",
          });
        } else {
          Dialog.show({
            type: ALERT_TYPE.WARNING,
            title: "Error",
            textBody: "Invalid Credential', 'Please try again!",
            button: "Close",
          });
          formik.resetForm();
        }
      }
    },
  });
  

  return (
    <AlertNotificationRoot style={styles.container}>
    <View>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={{
          width: '100%',
          height: '100%',
          paddingVertical: 10,
          paddingHorizontal: 20,
        }}
      >
        <ScrollView
          showsHorizontalScrollIndicator={false}
          style={{
            paddingTop: 60,
          }}
        >
          
          <Text
            style={{
              fontSize: 50,
              fontWeight: '500',
              marginVertical: 20,
              marginBottom: 100,
              textAlign: 'center',
              color: '#fff',
            }}
          >
            Login
          </Text>
          
          <View
            style={{
              width: '100%',
              marginBottom: 20,
            }}
          >
            <View>
              <TextInput
                placeholder="Enter Email"
                onChangeText={formik.handleChange('email')}
                value={formik.values.email}
                keyboardType="email-address"
                placeholderTextColor="#fff"
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  fontSize: 14,
                  color: '#fff',
                  borderRadius: 10,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                }}
              />
              {formik.touched.email && formik.errors.email && (
                <Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>{formik.errors.email}</Text>
              )}
            </View>
          </View>
          <View
            style={{
              width: '100%',
              marginBottom: 20,
            }}
          >
            <View
              style={{
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
              }}
            >
              <TextInput
                placeholder="Password"
                placeholderTextColor="#fff"
                secureTextEntry
                onChangeText={formik.handleChange('password')}
                value={formik.values.password}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  fontSize: 14,
                  color: '#fff',
                  flex: 1,
                }}
              />
            </View>
            {formik.touched.password && formik.errors.password && (
              <Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>{formik.errors.password}</Text>
            )}
          </View>
          <Text
            onPress={() => navigation.navigate('ForgotPasswordScreen')}
            style={{
              textAlign: 'right',
              color: '#fff',
              fontSize: 14,
              marginTop: 10,
              marginRight: 20,
            }}
          >
            Forgot Password
          </Text>
          <TouchableOpacity
            onPress={formik.handleSubmit}
            style={{
              width: '100%',
              paddingVertical: 14,
              paddingHorizontal: 20,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#4285f4',
              borderRadius: 10,
              marginVertical: 10,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 16 }}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('SignUpScreen')}
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
            <Text style={{ color: '#fff', fontSize: 16 }}>Don't have an account? Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onGoogleButtonPress().then(() => console.log('Signed in with Google!'))}
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
            <Text style={{ color: '#fff', fontSize: 16 }}>Signed in with Google!</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </View>
    </AlertNotificationRoot>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
