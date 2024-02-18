// Import the functions you need from the SDKs you need
import firebase from "@react-native-firebase/app";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

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

export const FIREBASE_APP = firebase.initializeApp(firebaseConfig);


