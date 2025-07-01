// firebase/config.ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBbGmXuvrboZ-mmUouFlJqkQEwE6tkB1Ec",
  authDomain: "results-makers.firebaseapp.com",
  projectId: "results-makers",
  storageBucket: "results-makers.firebasestorage.app",
  messagingSenderId: "921667917567",
  appId: "1:921667917567:web:0707ceb2bb43ed0d20deca",
  measurementId: "G-2BY178B0N4",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
