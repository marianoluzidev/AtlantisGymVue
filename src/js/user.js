import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const auth = getAuth();
const db = getFirestore();

export const useUserStore = defineStore('user', () => {
  const user = ref(null);

  const setUser = (data) => {
    if (!data) {
      user.value = null;
      return;
    }

    user.value = {
      uid: data.uid || '',
      email: data.email || '',
      nombre: data.nombre || '',
      apellido: data.apellido || '',
      peso: data.peso || '',
      altura: data.altura || '',
      objetivo: data.objetivo || ''
    };
  };

  const clearUser = () => setUser(null);

  const login = async (email, password) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;

      const userRef = doc(db, 'usuario', uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setUser({
          uid,
          email: cred.user.email,
          ...data
        });
      } else {
        console.error('Usuario no encontrado en Firestore.');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  };

  let unsubscribeAuth = null;

  const initAuth = () => {
    if (unsubscribeAuth) unsubscribeAuth(); // Detener cualquier suscripción previa
    unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const uid = firebaseUser.uid;
        const userRef = doc(db, 'usuario', uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.exists() ? userSnap.data() : {};

        setUser({
          uid,
          email: firebaseUser.email,
          ...userData
        });
      } else {
        user.value = null;
        if (window?.f7?.views?.main) {
          window.f7.views.main.router.navigate('/login/');
        }
      }
    });
  };

  return {
    user,
    setUser,
    initAuth,
    login,
    clearUser
  };
});
