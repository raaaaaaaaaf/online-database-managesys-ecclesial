// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA0obstaxHvZj7vZ7FC-K4JtD--VQo1N94",
  authDomain: "online-management-ecclesial.firebaseapp.com",
  projectId: "online-management-ecclesial",
  storageBucket: "online-management-ecclesial.appspot.com",
  messagingSenderId: "610641653784",
  appId: "1:610641653784:web:c95962a3cfd2d23ec4136d",
  measurementId: "G-B2G41PBDCY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider()
export const db = getFirestore(app)
export const storage = getStorage()