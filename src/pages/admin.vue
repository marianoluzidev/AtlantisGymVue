<template>
    <f7-page class="home" >
      <!-- Cartel de Cargando -->
      <div v-if="isLoading" class="loading-overlay">
        <p>Cargando...</p>
      </div>
      <f7-navbar title="Admin"></f7-navbar>
      <f7-list strong inset>
        <f7-list-item
          title ="Clientes"
          link="/clientes/"
        >
        <template #media>
          <f7-icon md="material:group" ios="f7:group" />
        </template>
      </f7-list-item>
      </f7-list>
    </f7-page>
  
  </template>

<script>
import { ref, onMounted } from 'vue'
import { f7, f7ready } from 'framework7-vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import store from '../js/store'
import routes from '../js/routes'
import { useUserStore } from '../js/user'

export default{

}

</script>