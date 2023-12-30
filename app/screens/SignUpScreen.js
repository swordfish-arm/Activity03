import React, { useState } from 'react';
import { View, Alert,Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createUserWithEmailAndPassword, getAuth,updateProfile } from 'firebase/auth';
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { app, auth } from './../../firebaseConfig';


const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const SignUpScreen = ({ navigation }) => {
  const [registrationError, setRegistrationError] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const registrationCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: "SUCCESS",
          textBody: "User Successfully Created!",
          button: "Close",
          onPressButton: () => navigation.navigate("SignInScreen"),
        });
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          Dialog.show({
            type: ALERT_TYPE.WARNING,
            title: "Error",
            textBody: "Email is already in use. Please use a different email!",
            button: "Close",
          });
        } else {
          Dialog.show({
            type: ALERT_TYPE.WARNING,
            title: "Error",
            textBody: "Registration error!",
            button: "Close",
          });
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
            Registration
          </Text>
          {registrationError && (
            <Text style={{ color: 'red', marginBottom: 10, textAlign: 'center' }}>{registrationError}</Text>
          )}
          <View
            style={{
              width: '100%',
              marginBottom: 20,
            }}
          >
            <View>
              <TextInput
                placeholder="Enter Name"
                onChangeText={formik.handleChange('name')}
                value={formik.values.name}
                keyboardType="default"
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
              {formik.touched.name && formik.errors.name && (
                <Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>{formik.errors.name}</Text>
              )}
            </View>
          </View>
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
                placeholder="Confirm Password"
                placeholderTextColor="#fff"
                secureTextEntry
                onChangeText={formik.handleChange('confirmPassword')}
                value={formik.values.confirmPassword}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  fontSize: 14,
                  color: '#fff',
                  flex: 1,
                }}
              />
            </View>
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>{formik.errors.confirmPassword}</Text>
            )}
          </View>
          <TouchableOpacity
            onPress={formik.handleSubmit}
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
            <Text style={{ color: '#fff', fontSize: 16 }}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('SignInScreen')} 
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
            <Text style={{ color: '#fff', fontSize: 16 }}>Already have an account? Login</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </View>
    </AlertNotificationRoot>
  );
};

export default SignUpScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});