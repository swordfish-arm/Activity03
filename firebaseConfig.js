import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
//import { getAuth } from 'firebase/auth';

import {getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, FacebookAuthProvider} from 'firebase/auth';

//for delete
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCsg_t2sGb42Qd5ku913M-XnG09OgbaXO0",
  authDomain: "martineztodoapp.firebaseapp.com",
  projectId: "martineztodoapp",
  storageBucket: "martineztodoapp.appspot.com",
  messagingSenderId: "658706858962",
  appId: "1:658706858962:web:48aa9ca2386e513ac8be0b",
  measurementId: "G-5QXN49ML2B"
};

const app = initializeApp(firebaseConfig);

//const auth = initializeAuth(app, {
 // persistence: getReactNativePersistence(ReactNativeAsyncStorage),
//});

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});



//const auth = getAuth(app);

const firestore = getFirestore(app);

//export { app, auth  };  ->original
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

export { auth,firestore   };
