import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA8jxPknLpLDTSQDVKHB_Sx5X_OsUrQP54",
  authDomain: "habits-47cc3.firebaseapp.com",
  databaseURL: "https://habits-47cc3-default-rtdb.firebaseio.com",
  projectId: "habits-47cc3",
  storageBucket: "habits-47cc3.appspot.com",
  messagingSenderId: "708967829520",
  appId: "1:708967829520:web:9b099c55c253e3cccefa95",
  measurementId: "G-GEJ093C3NB"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
