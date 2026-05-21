import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyApwo5jT7F7sO8n4p0VfKs7sWgz-pMzpL8",
  authDomain: "hirehive-81d6c.firebaseapp.com",
  projectId: "hirehive-81d6c",
  storageBucket: "hirehive-81d6c.firebasestorage.app",
  messagingSenderId: "731525776241",
  appId: "1:731525776241:web:4eebe103a67a32f102ecd0",
  measurementId: "G-HEMCC00PZT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Analytics (optional)
export const analytics = getAnalytics(app);

export default app;
