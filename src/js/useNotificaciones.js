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
  getFirestore
} from 'firebase/firestore';

const db = getFirestore();

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
    notificationCount
  };
});
