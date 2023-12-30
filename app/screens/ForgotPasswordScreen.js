import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity,Alert, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { sendPasswordResetEmail } from 'firebase/auth';
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import { auth } from './../../firebaseConfig';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
});

const ForgotPasswordScreen = ({ navigation }) => {                            
  const [resetPasswordError, setResetPasswordError] = useState(null);
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await sendPasswordResetEmail(auth, values.email);
        formik.resetForm();
        setResetPasswordSuccess(true);
        setResetPasswordError(null);
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: "SUCCESS",
          textBody: "Reset Instruction Successfully Sent!",
          button: "Close",
          onPressButton: () => navigation.navigate("SignInScreen"),
        });
      } catch (error) {
        setResetPasswordSuccess(false);
        Dialog.show({
          type: ALERT_TYPE.WARNING,
          title: "Error",
          textBody: "Error sending password reset email. Please try again!",
          button: "Close",
        });
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
            Forgot Password
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
            <Text style={{ color: '#fff', fontSize: 16 }}>Reset Password</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('SignInScreen')}
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
            <Text style={{ color: '#fff', fontSize: 16 }}>Got your new password? Log In</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </View>
    </AlertNotificationRoot>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
