<!-- src/pages/Login.vue -->
<template>
    <f7-page class="home" >
      <f7-navbar title="Login"></f7-navbar>
      <f7-list strong-ios dividers-ios outline-ios>
        
            <f7-list-input
            v-model:value="email"
            label="Email"
            type="email"
            placeholder="Correo electrónico"
            ></f7-list-input>
            <f7-list-input
            v-model:value="password"
            label="Contraseña"
            type="password"
            placeholder="Contraseña"
            ></f7-list-input>
            
            <f7-button @click="login" large>Iniciar sesión</f7-button>            
            <f7-button @click="signup" large>Crear cuenta</f7-button>                
        
        
        </f7-list>
    </f7-page>
  </template>
  
  <script>
  import { auth, signInWithEmailAndPassword } from '../firebase/firebase';  // Importar funciones necesarias de Firebase
  import { f7 } from 'framework7-vue';
  import { useUserStore } from '../js/user'

  const store = useUserStore()


  export default {
    data() {
      return {
        email: '',
        password: '',
      };
    },
    methods: {
      async login() {
        try {
          console.log('email:', this.email);
          // Intentar iniciar sesión con Firebase Authentication
          //await signInWithEmailAndPassword(auth, this.email, this.password);
          await store.login(this.email, this.password);
          // Redirigir a la página principal después de un login exitoso          
          f7.views.main.router.navigate('/');
          
        } catch (error) {
          // Si ocurre un error, mostrarlo en un diálogo
          console.log(error);
          
        }
      },
      signup() {
        f7.views.main.router.navigate('/register/');
      }
    }
  };
  </script>
  