import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "buzzz-app-c5646.firebaseapp.com",
  projectId: "buzzz-app-c5646",
  storageBucket: "buzzz-app-c5646.appspot.com",
  messagingSenderId: "554387946956",
  appId: "1:554387946956:web:c995744f23a1b7ef5f7169"
};

const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);
// export const auth = getAuth();
export const storage = getStorage(app);