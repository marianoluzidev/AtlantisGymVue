<template>
  <f7-page class="home">
    <!-- Cartel de Cargando -->
    <div v-if="isLoading" class="loading-overlay">
      <p>Cargando...</p>
    </div>
    <f7-navbar title="Rutina Detalle" back-link="Back"></f7-navbar>
    <f7-block v-if="rutina">      
      <div class="routine-header">
        <h1>{{ rutina.nombre }}</h1>
        <h2>Nivel: {{ rutina.nivel }}</h2>
      </div>

      <f7-block>        
        <div v-html="rutina.htmlContent"></div>
      </f7-block>
    </f7-block>
    <f7-block v-else>
      <p>No se encontró la rutina.</p>
    </f7-block>
  </f7-page>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isLoading: true,
      rutina: null,
    };
  },
  async mounted() {
    const db = getFirestore();
    const rutinaId = this.id;

    try {
      const docRef = doc(db, 'rutinas', rutinaId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        this.rutina = docSnap.data();
      } else {
        console.error('No se encontró la rutina.');
      }
    } catch (error) {
      console.error('Error al obtener la rutina:', error);
    } finally {
      this.isLoading = false;
    }
  },
};
</script>
