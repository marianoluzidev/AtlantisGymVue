<template>
  <f7-page class="client-detail home">
    <!-- Cartel de Cargando -->
    <div v-if="isLoading" class="loading-overlay">
      <p>Cargando...</p>
    </div>
    <f7-navbar title="Detalle del Cliente" back-link="Back"></f7-navbar>
    <div v-if="cliente" class="bienvenida-cliente">
      <div class="card">
        <div class="card-content card-content-padding">
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
      </div>

      <f7-card title="Datos de cuota">
        <f7-list simple-list dividers-ios>
          <f7-list-item title="Estado: ">al dia</f7-list-item>
          <f7-list-item title="Ultimo pago: ">15/03/2025</f7-list-item>
          <f7-list-item title="Vencimiento: ">15/04/2025</f7-list-item>
          <f7-list-item>
            <button class="btn-pagar" @click="showPopup = true">Registrar pago</button>
          </f7-list-item>

          <f7-popup :opened="showPopup" @popup:closed="showPopup = false" class="home">
            <div class="popup-content home">
              <h2>Registrar Pago</h2>              
              <f7-card title="Seleccionar fecha de pago">
                <f7-list strong-ios outline-ios>
                  <f7-list-input type="datepicker" placeholder="Fecha de pago" v-model:value="paymentDate" readonly />                  
                </f7-list>              
              </f7-card>
              <button class="btn-pagar" @click="registerPayment">Registrar</button>                            
            </div>
          </f7-popup>

        </f7-list>
      </f7-card>

      <f7-card title="Rutinas asignadas">
        <f7-list simple-list dividers-ios>
          <f7-list-item v-for="(rutina, index) in cliente.rutinas" :key="index" :title="rutina.nombre"></f7-list-item>
          <f7-list-item ><button class="btn-pagar" >Asignar rutina</button></f7-list-item>
        </f7-list>
      </f7-card>
      
    </div>
  </f7-page>
</template>

<script>
import { ref, onMounted } from 'vue';
import { doc, getDoc } from 'firebase/firestore';
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
    const showPopup = ref(false);
    const paymentDate = ref(null);

    const registerPayment = () => {
      if (paymentDate.value) {
        console.log('Fecha de pago registrada:', paymentDate.value);
        alert(`Pago registrado con fecha: ${paymentDate.value}`);
      } else {
        console.error('No se seleccionó una fecha de pago');
        alert('Por favor, seleccione una fecha antes de registrar el pago.');
      }
      showPopup.value = false;
    };

    onMounted(async () => {
      const clienteRef = doc(db, 'usuario', props.id);
      try {
        console.log('ID del cliente:', props.id); // Verifica el ID del cliente
        const clienteSnap = await getDoc(clienteRef);
        if (clienteSnap.exists()) {
          cliente.value = clienteSnap.data();
          console.log('Cliente encontrado:', cliente.value.rutinasAsignadas);
          const rutinasPromises = (cliente.value.rutinasAsignadas || [])
            .filter(rutinaId => rutinaId && typeof rutinaId === 'string')
            .map(async (rutinaId) => {
              const rutinaRef = doc(db, 'rutinas', rutinaId);
              const rutinaSnap = await getDoc(rutinaRef);
              if (rutinaSnap.exists()) {
                const rutinaData = rutinaSnap.data();
                return {
                  id: rutinaId,
                  ...rutinaData
                };
              } else {
                return { id: rutinaId, nombre: 'Nombre no disponible' };
              }
            });
          cliente.value.rutinas = await Promise.all(rutinasPromises);
          console.log('Rutinas asignadas:', cliente.value.rutinas);
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
      showPopup,
      paymentDate,
      registerPayment,
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
.popup-content {
  padding: 20px;
  text-align: center;
}
</style>