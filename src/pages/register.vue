<template>
    <f7-page name="register">
        <f7-list strong-ios dividers-ios outline-ios>

            <f7-list-input v-model:value="nombre" placeholder="Nombre" />
            <f7-list-input v-model:value="apellido" placeholder="Apellido" />
            <f7-list-input v-model:value="email" placeholder="Email" />
            <f7-list-input v-model:value="password" type="password" placeholder="Password" />
            <f7-button @click="register">Registrarse</f7-button>

            
        </f7-list>
    </f7-page>
  </template>
  

<script setup>
import { ref } from 'vue'
import { useUserStore } from '../js/user'
import { f7 } from 'framework7-vue';

const nombre = ref('')
const apellido = ref('')
const email = ref('')
const password = ref('')
const userStore = useUserStore()

const register = async () => {
  try {
    console.log("Datos:", email.value, password.value, nombre.value, apellido.value);
    await userStore.registerUser(email.value, password.value, nombre.value, apellido.value)
    console.log('Usuario registrado y Firestore creado')
    f7.views.main.router.navigate('/');
  } catch (err) {
    console.error('Error al registrar:', err.message)
  }
}
</script>

