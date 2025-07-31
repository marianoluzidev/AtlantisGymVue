// src/js/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup,createUserWithEmailAndPassword } from 'firebase/auth';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

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
const messaging = getMessaging(app);

const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();


export const solicitarPermisoNotificacion = async () => {
  console.log('🔔 Solicitando permiso para notificaciones...');
  try {
    const registration = await navigator.serviceWorker.ready;
    console.log('✅ Service Worker listo:', registration);

    const token = await getToken(messaging, {
      vapidKey: 'BPPxNy7QZbW9LcwhkxBPmUJDkS99dXIAoEszbmhZTMNmgbhniDSjaDokFBxxGexlYkxez8QFcV-m9CPAUcvHcDo',
      serviceWorkerRegistration: registration
    });     

    console.log('✅ FCM Token obtenido:', token);
    return token;
  } catch (err) {
    console.error('❌ Error al obtener token:', err);
  }
};


// ✅ Escuchar mensajes en foreground
export const escucharMensajes = () => {  
  console.log('✅ Escuchando notificaciones');
  onMessage(messaging, (payload) => {
    console.log('Mensaje recibido:', payload);
    const { title, body } = payload.notification;
    alert(`${title}: ${body}`);
  });
};


export { db, auth, signInWithEmailAndPassword, provider, signInWithPopup, createUserWithEmailAndPassword };
export default app;


