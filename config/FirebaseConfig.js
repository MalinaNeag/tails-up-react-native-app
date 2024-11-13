import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "process.env.EXPO_PUBLIC_FIREBASE_API_KEY",
    authDomain: "tailsup-9ec38.firebaseapp.com",
    projectId: "tailsup-9ec38",
    storageBucket: "tailsup-9ec38.appspot.com",
    messagingSenderId: "801063292436",
    appId: "1:801063292436:web:3bf17cd4212d8e37c52101",
    measurementId: "G-BG57E6RNDH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage=getStorage(app);
