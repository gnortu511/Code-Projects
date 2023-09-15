// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyD1S1Wka9hXimWpWJD8M3GApr7n3-hAeDs",
  authDomain: "monkey-blogging-b448b.firebaseapp.com",
  projectId: "monkey-blogging-b448b",
  storageBucket: "monkey-blogging-b448b.appspot.com",
  messagingSenderId: "618689635640",
  appId: "1:618689635640:web:71ba0287b6da5d64fe4dcd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);