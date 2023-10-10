// Import the functions you need from the SDKs you need
import { getFirestore} from 'firebase/firestore'
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-Fm5RRuM-9sVWYGtxr8EgBxhbIF-aRfc",
  authDomain: "gather-round-5167f.firebaseapp.com",
  projectId: "gather-round-5167f",
  storageBucket: "gather-round-5167f.appspot.com",
  messagingSenderId: "321160559205",
  appId: "1:321160559205:web:52e8bd8e7eb4ab0660648c",
  measurementId: "G-6G4E3VM2HN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app, "gather-round-5167f.appspot.com");
export const db = getFirestore(app);
export const auth = getAuth();