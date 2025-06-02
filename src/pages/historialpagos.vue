<template>
    <f7-page class="home" >
      <!-- Cartel de Cargando -->
      <div v-if="isLoading" class="loading-overlay">
        <p>Cargando...</p>
      </div>
      <f7-navbar title="Historial pagos" back-link="Back"></f7-navbar>

      <div class="card data-table" style="overflow-x: auto;">

      <div class="data-table" style="width: 100%; table-layout: auto;">
        <table v-if="pagos.length > 0" style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th class="label-cell" style="width: 30%;padding-left: 15px;white-space: nowrap;">Fecha</th>
              <th class="label-cell" style="width: 30%;white-space: nowrap;">Ven.</th>
              <th class="numeric-cell" style="width: 25%;white-space: nowrap;">Monto</th>
              <th class="label-cell" style="white-space: nowrap;"></th>


            </tr>
          </thead>
          <tbody>
            <tr v-for="pago in pagos" :key="pago.id">
              <td class="label-cell" style="width: 30%;padding-left: 15px;white-space: nowrap;">{{ formatFecha(pago.fechaPago.seconds * 1000) }}</td>
              <td class="label-cell" style="width: 30%;white-space: nowrap;">{{ formatFecha(pago.fechaVencimiento.seconds * 1000) }}</td>
              <td class="numeric-cell" style="width: 25%;white-space: nowrap;">${{ pago.monto }}</td>
              <td class="label-cell" style="white-space: nowrap;">
                
                <button v-if="actions == 'true'" @click="eliminarPago(pago.id)" class="delete-button" style="border: none; background: none; padding: 0;">
                  <f7-icon ios="f7:trash" md="material:delete" />
                </button>
                
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else>No hay pagos registrados.</p>
      </div>      
    </div>

         
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
    actions: {
      type: Boolean,
      default: false,
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

    const formatFecha = (timestamp) => {
      const date = new Date(timestamp);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
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
      formatFecha,
    };
  },

}

</script>