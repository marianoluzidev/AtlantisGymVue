import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore'
import { setActivePinia, createPinia } from 'pinia'
import { signInWithEmailAndPassword } from 'firebase/auth'

setActivePinia(createPinia())


const auth = getAuth()
const db = getFirestore()

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const isLoading = ref(false)

  // Set user data
  const setUser = (firebaseUser) => {
    user.value = firebaseUser
  }

  // Clear user data
  const clearUser = () => {
    user.value = null
  }

  // Register and create Firestore doc
  const registerUser = async (email, password, nombre, apellido) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    const uid = cred.user.uid

    // Crear doc en Firestore
    await setDoc(doc(db, 'usuario', uid), {
      uid,
      nombre,
      apellido,
      email,
      createdAt: new Date().toISOString()
    })

    user.value = cred.user
  }

  // Cargar datos desde Firestore (si los necesitás)
  const fetchUserData = async () => {
    isLoading.value = true;
    if (!user.value) {
      isLoading.value = false;
      return null;
    }
    isLoading.value = true;    
    try {
      const docSnap = await getDoc(doc(db, 'usuario', user.value.uid))
      return docSnap.exists() ? docSnap.data() : null
    } finally {      
      isLoading.value = false;
    }
  }

  const login = async (email, password) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      const uid = cred.user.uid
  
      // Cargar datos adicionales desde Firestore (opcional)
      const userDoc = await getDoc(doc(db, 'usuario', uid))
      const userData = userDoc.exists() ? userDoc.data() : null      
      // Guardar usuario en el store
      user.value = {
        ...cred.user,
        ...userData
      }
  
      return user.value
    } catch (err) {
      console.error('Error al iniciar sesión:', err.message)
      throw err
    }
  }

  
  // Logout
  const logout = async () => {
    await signOut(auth)
    clearUser()
  }

  // Monitor auth state (ejecutar esto en main)
  const initAuth = () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const uid = firebaseUser.uid
        const userDoc = await getDoc(doc(db, 'usuario', uid))
        const userData = userDoc.exists() ? userDoc.data() : {}
        
        // Combinar los datos de Firebase Auth con los de Firestore
        user.value = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          ...userData
        }
      } else {
        user.value = null
      }
    })
  }

  
  return {
    user,
    isLoading,
    setUser,
    clearUser,
    registerUser,
    fetchUserData,
    logout,
    initAuth,
    login
  }
})
