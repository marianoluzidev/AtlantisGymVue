// src/js/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDiRtVGM2wzVLPlNifkUgvy7PZ-amI6234",
    authDomain: "atlantisgymvue.firebaseapp.com",
    projectId: "atlantisgymvue",
    storageBucket: "atlantisgymvue.firebasestorage.app",
    messagingSenderId: "972323308634",
    appId: "1:972323308634:web:10d7a65175020705ad4463",
    measurementId: "G-697VS11WYJ"
  };

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, signInWithEmailAndPassword };
export default app;
 