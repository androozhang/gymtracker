// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA5tu0yoRtnRM-ftMKH0VgOe_TrmOnqxLE",
  authDomain: "gymtracker-b8086.firebaseapp.com",
  projectId: "gymtracker-b8086",
  storageBucket: "gymtracker-b8086.appspot.com",
  messagingSenderId: "583572974340",
  appId: "1:583572974340:web:b2d3be18dca7aa7ab3be51",
  measurementId: "G-PF6N6PT4TL"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_ANALYTICS = getAnalytics(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);