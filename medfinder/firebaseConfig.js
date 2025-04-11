// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA8xd20LD2oCnlq3VKUzQHi2q-wuFTaI84",
  authDomain: "medfinder-app-1fb3d.firebaseapp.com",
  projectId: "medfinder-app-1fb3d",
  storageBucket: "medfinder-app-1fb3d.firebasestorage.app",
  messagingSenderId: "620910891707",
  appId: "1:620910891707:web:7a53c883494d10b07c0f9e",
  measurementId: "G-SVT6WCJ6GF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);