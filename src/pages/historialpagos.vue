<template>
    <f7-page class="home" >
      <!-- Cartel de Cargando -->
      <div v-if="isLoading" class="loading-overlay">
        <p>Cargando...</p>
      </div>
      <f7-navbar title="Historial pagos" back-link="Back"></f7-navbar>

      <f7-list simple-list dividers-ios strong >
          <f7-list v-if="pagos.length > 0" >
              <f7-list-item
                v-for="pago in pagos"
                :key="pago.id"
                :title="`${new Date(pago.fechaPago.seconds * 1000).toLocaleDateString()} - ${new Date(pago.fechaVencimiento.seconds * 1000).toLocaleDateString()}, Monto: $${pago.monto}`">
                <template #media>                  
                  <f7-icon ios="f7:trash" md="material:delete" @click="eliminarPago(pago.id)"  />
                </template>
              </f7-list-item>
          </f7-list>
          <f7-list v-else strong inset>
            <f7-list-item title="No hay pagos registrados." />
          </f7-list>
      </f7-list>
    
      <f7-block-title>Pagos</f7-block-title>
      <f7-list dividers-ios strong-ios outline-ios>
        <f7-list-item link="#" title="Ivan Petrov">
          <template #media>
            <f7-icon ios="f7:trash" md="material:delete"  />
          </template>
        </f7-list-item>       
      </f7-list>

    </f7-page>
  
  </template>

<script>

import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const pagos = ref([]);
    const isLoading = ref(true);

    const fetchPagos = async () => {
      try {
        const usuarioId = props.id;
        const pagosRef = collection(db, 'pago');
        const q = query(pagosRef, where('usuarioId', '==', usuarioId), orderBy('fechaPago', 'desc'));
        const querySnapshot = await getDocs(q);
        pagos.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error('Error al obtener los pagos:', error);
      } finally {
        isLoading.value = false;
      }
    };

    const eliminarPago = async (pagoId) => {
      if (confirm('¿Desea eliminar este pago?')) {
        try {
          await deleteDoc(doc(db, 'pago', pagoId));
          pagos.value = pagos.value.filter(pago => pago.id !== pagoId);
          alert('Pago eliminado con éxito.');
        } catch (error) {
          console.error('Error al eliminar el pago:', error);
          alert('Hubo un error al eliminar el pago.');
        }
      }
    };

    onMounted(fetchPagos);

    return {
      pagos,
      isLoading,
      eliminarPago,
    };
  },

}

</script>