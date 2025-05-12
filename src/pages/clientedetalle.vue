<template>
  <f7-page class="client-detail home">
    <!-- Cartel de Cargando -->
    <div v-if="isLoading" class="loading-overlay">
      <p>Cargando...</p>
    </div>
    <f7-navbar title="Detalle del Cliente" back-link="Back"></f7-navbar>
    <div v-if="cliente" class="bienvenida-cliente">
      <h2>{{cliente.apellido}}, {{ cliente.nombre }}</h2>
      <div class="info-cliente">
        <div class="info-box">
          <div class="info-label">Peso</div>
          <div class="info-value">{{ cliente.peso }} kg</div>
        </div>
        <div class="info-box">
          <div class="info-label">Altura</div>
          <div class="info-value">{{ cliente.altura }} cm</div>
        </div>
        <div class="info-box">
          <div class="info-label">Objetivo</div>
          <div class="info-value">{{ cliente.objetivo }}</div>
        </div>
      </div>
    </div>
  </f7-page>
</template>

<script>
import { ref, onMounted } from 'vue';


import { doc, collection, getDoc, query } from 'firebase/firestore';
import { db } from '../firebase/firebase'; // Asegúrate de que la ruta sea correcta

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const cliente = ref(null);
    const isLoading = ref(true);

    onMounted(async () => {
      
      const clienteRef = doc(db, 'usuario', props.id);

      try {
        console.log('ID del cliente:', props.id); // Verifica el ID del cliente
        const clienteSnap = await getDoc(clienteRef);
        if (clienteSnap.exists()) {
          cliente.value = clienteSnap.data();
        } else {
          console.error('No se encontró el cliente');
        }
      } catch (error) {
        console.error('Error al obtener el cliente:', error);
      } finally {
        isLoading.value = false;
      }
    });

    return {
      cliente,
      isLoading,
    };
  },
};
</script>

<style>
.bienvenida-cliente {
  text-align: center;
  margin-top: 20px;
}
.info-cliente {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}
.info-box {
  text-align: center;
}
.info-label {
  font-weight: bold;
}
.info-value {
  font-size: 1.2em;
}
</style>