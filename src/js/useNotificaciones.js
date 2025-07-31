import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  getFirestore, doc, updateDoc, getDoc
} from 'firebase/firestore';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const messaging = getMessaging();
const db = getFirestore();
const auth = getAuth();

// const VAPID_KEY = 'AIzaSyDiRtVGM2wzVLPlNifkUgvy7PZ-amI6234'; // la que ya estás usando
const VAPID_KEY = 'BPPxNy7QZbW9LcwhkxBPmUJDkS99dXIAoEszbmhZTMNmgbhniDSjaDokFBxxGexlYkxez8QFcV-m9CPAUcvHcDo';

export const iniciarManejoFCM = async () => {
  const messaging = getMessaging();
  const auth = getAuth();

  onAuthStateChanged(auth, async (user) => {
    if (!user) return;

    try {
      const registration = await navigator.serviceWorker.ready;

      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      if (token) {
        await updateDoc(doc(db, 'usuario', user.uid), { fcmToken: token });
        console.log('✅ Token actualizado para usuario:', user.email);
      } else {
        console.warn('⚠️ No se obtuvo un token. ¿Permisos denegados?');
      }

    } catch (error) {
      console.error('❌ Error al obtener o guardar el token FCM:', error);
    }
  });
};

export const useNotificacionesStore = defineStore('notificaciones', () => {
  const notificaciones = ref([]);

  // 🔄 Cargar notificaciones para usuarios comunes
  const cargarNotificaciones = (uid) => {
    const q = query(
      collection(db, 'notificaciones'),
      where('paraUid', 'in', [uid, null]),
      where('tipo', '==', 'usuario'),
      orderBy('fecha', 'desc')
    );

    onSnapshot(q, (snapshot) => {
      notificaciones.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    });
  };

  // 🔄 Cargar notificaciones para administradores
  const cargarNotificacionesAdmin = (uid) => {
    const q = query(
      collection(db, 'notificaciones'),
      where('paraUid', 'in', [uid, null]),
      where('tipo', '==', 'admin'),
      orderBy('fecha', 'desc')
    );

    onSnapshot(q, (snapshot) => {
      notificaciones.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    });
  };

  // 📤 Enviar una notificación
  const enviarNotificacion = async ({ titulo, mensaje, paraUid = null, deUid, tipo = 'usuario' }) => {
    console.log("📤 Llamada a enviarNotificacion con datos:", { titulo, mensaje, paraUid, deUid, tipo });
    await addDoc(collection(db, 'notificaciones'), {
      titulo,
      mensaje,
      paraUid,
      deUid,
      tipo,
      leida: false,
      fecha: serverTimestamp()
    });
  };

  // 🔢 Contador de notificaciones no leídas
  const notificationCount = computed(() =>
    notificaciones.value.filter(n => !n.leida).length
  );

  return {
    notificaciones,
    cargarNotificaciones,
    cargarNotificacionesAdmin,
    enviarNotificacion,
    notificationCount,
    iniciarManejoFCM
  };
});
