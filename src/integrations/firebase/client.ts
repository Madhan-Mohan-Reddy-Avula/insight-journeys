// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWEfvKQBp4azOBqh9yRKDBH9PUa-cn_2g",
  authDomain: "genaiproject-3394b.firebaseapp.com",
  projectId: "genaiproject-3394b",
  storageBucket: "genaiproject-3394b.firebasestorage.app",
  messagingSenderId: "151368970631",
  appId: "1:151368970631:web:19c2b78bf5cbd50764a322",
  measurementId: "G-GT42CS5D8T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

export { app, analytics };