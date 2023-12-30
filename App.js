// Navigations
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import { getAuth } from 'firebase/auth';

// Screens

import SignUpScreen from './app/screens/SignUpScreen';
import SignInScreen from './app/screens/SignInScreen';
import OnBoarding from './app/screens/OnBoarding';
import ForgotPasswordScreen from './app/screens/ForgotPasswordScreen';
import HomeScreen from './app/screens/HomeScreen';





const auth = getAuth();

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignInScreen"
        screenOptions={{
          headerShown: false,
          animation: 'simple_push',
        }}>
        <Stack.Screen name="OnBoarding" component={OnBoarding} />
        <Stack.Screen name="SignInScreen" component={SignInScreen} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
