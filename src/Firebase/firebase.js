import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
const firebaseConfig = {
  apiKey: "AIzaSyBGyMnVnetm5ghVyaILGZm9W8V9t1E1Eys",
  authDomain: "webtool-2efd8.firebaseapp.com",
  projectId: "webtool-2efd8",
  storageBucket: "webtool-2efd8.firebasestorage.app",
  messagingSenderId: "56432045971",
  appId: "1:56432045971:web:e7b43946db5a440f06c266",
  measurementId: "G-CCCE4W5LFC",
 databaseURL: "https://webtool-2efd8-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getDatabase(app);