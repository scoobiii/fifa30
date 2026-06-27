import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "synthetic-interface-v07pf",
  appId: "1:481287563987:web:efb6f78b865818d5f54226",
  apiKey: "AIzaSyBx9HH3v8b5KvgHcPJfcTeUGelhdjymDas",
  authDomain: "synthetic-interface-v07pf.firebaseapp.com",
  storageBucket: "synthetic-interface-v07pf.firebasestorage.app",
  messagingSenderId: "481287563987"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
// We use the default database or custom database ID if specified. Since the config has firestoreDatabaseId: "ai-studio-v-54ff1dc9-85f6-4c37-bea9-407fc5d8039a", we should initialize with that databaseId
export const db = getFirestore(app, "ai-studio-v-54ff1dc9-85f6-4c37-bea9-407fc5d8039a");
