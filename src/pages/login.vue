// login.vue corregido con validaciones de datos
<template>
  <f7-page class="home">
    <f7-navbar title="Login"></f7-navbar>
    <f7-list strong-ios dividers-ios outline-ios>
      <f7-list-input v-model:value="email" label="Email" type="email" placeholder="Correo electrónico"></f7-list-input>
      <f7-list-input v-model:value="password" label="Contraseña" type="password" placeholder="Contraseña"></f7-list-input>
      <f7-button @click="login" large>Iniciar sesión</f7-button>
      <f7-button @click="signup" large>Crear cuenta</f7-button>
      <f7-button @click="loginWithGoogle" large fill class="google-btn" style="width: 70%; margin: 0 auto;">
        <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" class="google-icon" />
        Iniciar sesión con Google
      </f7-button>
    </f7-list>
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
      <a>{{ `ATLANTIS GYM (${version})` }}</a>
    </div>
  </f7-page>
</template>

<script>
import { auth, signInWithEmailAndPassword, provider, signInWithPopup, db } from '../firebase/firebase';
import { f7 } from 'framework7-vue';
import { useUserStore } from '../js/user';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { appConfig } from '../js/config';

export default {  
  data() {
    return {
      email: '',
      password: '',
      version: appConfig.version
    };
  },
  methods: {
    async login() {
      const store = useUserStore();
      try {
        await store.login(this.email, this.password);
        f7.views.main.router.navigate('/');
      } catch (error) {
        console.log(error);
      }
    },
    signup() {
      f7.views.main.router.navigate('/register/');
    },
    async loginWithGoogle() {
      const store = useUserStore();
      store.setUser(null);
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        if (!user?.uid) {
          console.error("Usuario inválido al iniciar sesión con Google.");
          return;
        }

        const userRef = doc(db, 'usuario', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          const displayName = user.displayName || '';
          const [nombre, ...resto] = displayName.split(' ');
          const apellido = resto.join(' ');

          await setDoc(userRef, {
            nombre: nombre || '',
            apellido: apellido || '',
            email: user.email,
            peso: '',
            altura: '',
            objetivo: ''
          });
        }

        const datosFinales = await getDoc(userRef);

        if (datosFinales.exists()) {
          const data = datosFinales.data();

          if (data && user?.uid) {
            store.setUser({
              uid: user.uid,
              email: user.email,
              ...data
            });

            f7.views.main.router.navigate('/');
          }
        } else {
          console.error("No se encontraron datos en Firestore para este usuario.");
        }
      } catch (error) {
        console.error("Error al iniciar sesión con Google:", error);
      }
    }
  }
};
</script>

<style scoped>
.google-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: #fff;
  color: #444;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}
.google-btn:hover {
  background-color: #f7f7f7;
}
.google-icon {
  width: 20px;
  height: 20px;
}
</style>