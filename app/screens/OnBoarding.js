import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';



const OnBoarding = ({ navigation }) => {                           

  return (
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

         
         
         <View style={{ width: '100%', height: '50%', padding: 16 }}>
          <View
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 20,
            }}
          >
            <Image
              source={require('../../assets/images/todo.png')}
              style={{ height: '100%', aspectRatio: 1 / 1 }}
            />
          </View>
        </View>
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 40,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 30,
              color: '#fff',
              letterSpacing: 1,
            }}
          >
            Simplify your Notes{' '}
          </Text>
          <Text
            style={{
              fontSize: 30,
              color: '#fff',
              letterSpacing: 1,
            }}
          >
            Boost Your Productivity{' '}
          </Text>
        </View>
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 40,
          }}
        >
        </View>
         
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
            <Text style={{ color: '#fff', fontSize: 16 }}>Get Started</Text>
          </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

export default OnBoarding;
