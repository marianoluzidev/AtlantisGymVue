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
          <h2>{{ cliente.apellido }}, {{ cliente.nombre }}</h2>

          <!-- Primera fila con info -->
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

          <!-- Bloque extra abajo -->
          <div class="info-extra">
            <div class="info-item">
              <strong>Teléfono:</strong> {{ cliente.telefono }}
            </div>
            <div class="info-item">
              <strong>Dirección:</strong> {{ cliente.direccion }}
            </div>
            <div class="info-item">
              <strong>Fecha de Nacimiento:</strong> {{ cliente.fechaNacimiento }}
            </div>
          </div>
        </div>
      </div>

      <f7-card title="Datos de cuota">
        <f7-list dividers-ios strong-ios outline-ios>
          <f7-list-item title="Estado: ">{{ estadoCuota }}</f7-list-item>
          <f7-list-item title="Ultimo pago: ">{{ ultimoPago || 'No disponible' }}</f7-list-item>
          <f7-list-item title="Vencimiento: ">{{ vencimiento || 'No disponible' }}</f7-list-item>
          
          <f7-list-item>
            <button class="btn-pagar" @click="showPopup = true">Registrar pago</button>
          </f7-list-item>

          <f7-list-item :link="`/historialpagos/${id}/true`" title="Historial" after="Administrar">
            <template #media>
              <f7-icon icon="icon-f7" />
            </template>
          </f7-list-item>
          
          <f7-popup :opened="showPopup" @popup:closed="showPopup = false" class="home">
            <div class="popup-content home">
              <h2>Registrar Pago</h2>              
              <f7-card title="Seleccionar fecha de pago">
                <f7-list strong-ios outline-ios>
                  <f7-list-input type="datepicker" placeholder="Fecha de pago" v-model:value="paymentDate" readonly />                  
                <f7-list-input type="number" placeholder="Monto" v-model:value="paymentAmount" clear-button />
                </f7-list>
              </f7-card>
              <div class="button-group">
                <button class="btn-pagar" @click="showPopup = false">Cancelar</button>
                <button class="btn-pagar" @click="registerPayment">Registrar</button>
              </div>
            </div>
          </f7-popup>

        </f7-list>
      </f7-card>

      <f7-card title="Rutinas">
        <f7-list dividers-ios strong-ios outline-ios>
          <f7-list-item
            v-for="(rutina, index) in cliente.rutinas"
            :key="rutina.id"
            :title="rutina.nombre" after="quitar" link="#" @click="quitarRutina(rutina.id)">            
            <template #media>
              <f7-icon icon="minus" />
            </template>
          </f7-list-item>
          <f7-list-item>
            <button class="btn-pagar" @click="abrirPopupAsignarRutina">Asignar rutina</button>
          </f7-list-item>
          <f7-popup :opened="showAssignPopup" @popup:closed="showAssignPopup = false" class="home">
            <div class="popup-content home">
              <h2>Asignar Rutina</h2>
              <f7-card title="Rutinas Disponibles">
                <f7-list strong-ios outline-ios>
                  <f7-list-item
                    v-for="rutina in rutinasDisponibles"
                    :key="rutina.id"
                    :title="rutina.nombre" after="Asignar" link="#" @click="asignarRutina(rutina.id)">
                     <template #media>
                        <f7-icon icon="plus" />
                    </template>
                  </f7-list-item>
                </f7-list>
              </f7-card>
              <div class="button-group">
                <button class="btn-pagar" @click="showAssignPopup = false">Cerrar</button>
              </div>
            </div>
          </f7-popup>
        </f7-list>
      </f7-card>      
    </div>
  </f7-page>
</template>

<script>
import { ref, onMounted } from 'vue';
import { doc, getDoc, collection, addDoc, getDocs, query, where, orderBy, updateDoc, serverTimestamp  } from 'firebase/firestore';
import { db } from '../firebase/firebase'; // Asegúrate de que la ruta sea correcta
import { useUserStore } from '../js/user';
import { useNotificacionesStore } from '../js/useNotificaciones';
import { alert,confirm } from '../composables/useAlert'


export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const abrirPopupAsignarRutina = () => {      
      cargarRutinasDisponibles();
      showAssignPopup.value = true;
    };
    const showAssignPopup = ref(false);
    const rutinasDisponibles = ref([]);
    const userStore = useUserStore();
    const notiStore = useNotificacionesStore();

    const asignarRutina = async (rutinaId) => {

      const ok = await confirm({
          title: 'Confirmar',
          message: '¿Quiere asignar la rutina?',
          type: 'warning',
          confirmText: 'Sí',
          cancelText: 'Cancelar',
      });
      
      if (ok) {
        try {
          const clienteRef = doc(db, 'usuario', props.id);
          const clienteSnap = await getDoc(clienteRef);
          if (clienteSnap.exists()) {
            const clienteData = clienteSnap.data();
            const rutinasAsignadas = clienteData.rutinasAsignadas || [];
            rutinasAsignadas.push(rutinaId);

            // Actualizar en la base de datos
            await updateDoc(clienteRef, { rutinasAsignadas });
            
            await updateDoc(clienteRef, {
              rutinasAsignadas,
              ultimaAsignacionRutina: serverTimestamp() // 👈 nueva línea
            });

            // Actualizar en el frontend
            const rutinaAsignada = rutinasDisponibles.value.find(rutina => rutina.id === rutinaId);
            cliente.value.rutinas.push({ id: rutinaId, nombre: rutinaAsignada?.nombre || 'Nombre no disponible' });

            // Notificación al cliente
            const admin = userStore.user;
            if (admin && admin.uid) {
              console.log("envio una notificacion");
              const mensaje = `${admin.nombre} ${admin.apellido} le ha asignado una nueva rutina`;
              await notiStore.enviarNotificacion({
                titulo: 'Nueva rutina asignada',
                mensaje,
                paraUid: props.id,
                deUid: admin.uid,
                tipo: 'usuario'
              });
            }

            alert({title: 'Rutinas', message: 'Rutina asignada con éxito.', })
            showAssignPopup.value = false;
          } else {
            alert({message: 'No se encontró el cliente.'});
          }
        } catch (error) {          
          alert({message:'Hubo un error al asignar la rutina.'});
        }
      }
    };
  
    const cargarRutinasDisponibles = async () => {
      try {
        console.log('Cargando rutinas disponibles...');
        const rutinasRef = collection(db, 'rutinas');
        const rutinasSnap = await getDocs(rutinasRef);
        const todasRutinas = rutinasSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));        
        const rutinasAsignadasIds = cliente.value?.rutinas?.map(r => r.id) || [];        
        rutinasDisponibles.value = todasRutinas.filter(
          rutina => !rutinasAsignadasIds.includes(rutina.id)
        );
      } catch (error) {
        console.error('Error al cargar rutinas disponibles:', error);
      }
    };

    const formatDateAR = (value) => {
      if (!value) return ''
      // Firestore Timestamp
      if (value?.toDate) {
        const d = value.toDate()
        return d.toLocaleDateString('es-AR', { timeZone: 'America/Argentina/Cordoba' })
      }
      // String o Date
      const d = new Date(value)
      if (isNaN(d)) return ''
      return d.toLocaleDateString('es-AR', { timeZone: 'America/Argentina/Cordoba' })
    }
  
    onMounted(() => {
      cargarRutinasDisponibles();
    });
    const cliente = ref(null);
    const isLoading = ref(true);
    const showPopup = ref(false);
    const estadoCuota = ref(''); // Estado de la cuota
    const ultimoPago = ref(null);
    const vencimiento = ref(null);
    const paymentDate = ref(null);
    const paymentAmount = ref(null); // Valor predeterminado

    const quitarRutina = async (rutinaId) => {
       const ok = await confirm({
          title: 'Confirmar',
          message: '¿Desea quitar esta rutina?',
          type: 'warning',
          confirmText: 'Sí',
          cancelText: 'Cancelar',
       });
       if (ok) {
         try {
           const clienteRef = doc(db, 'usuario', props.id);
           const clienteSnap = await getDoc(clienteRef);
           if (clienteSnap.exists()) {
            const clienteData = clienteSnap.data();
            
            const rutinasAsignadas = clienteData.rutinasAsignadas || [];
            const nuevasRutinas = rutinasAsignadas.filter(id => id !== rutinaId);

            // Actualizar en la base de datos
            await updateDoc(clienteRef, { rutinasAsignadas: nuevasRutinas });

            // Actualizar en el frontend
            cliente.value.rutinas = cliente.value.rutinas.filter(rutina => rutina.id !== rutinaId);
            alert({message: 'Rutina quitada con éxito.'});
          } else {
            alert({message: 'No se encontró el cliente.'});
          }
        } catch (error) {
          alert({message: 'Hubo un error al quitar la rutina.'});
        }
      }
    };

    const registerPayment = async () => {
      if (!paymentAmount.value) {
        alert({message: 'Por favor, seleccione un monto de pago.'});
        return;
      }
        if (paymentDate.value) {
            const fechaPago = new Date(paymentDate.value[0]);
            const fechaActual = new Date();
            
            // Validar que la fecha no sea mayor al día actual
            if (fechaPago > fechaActual) {
                alert({message: 'No se pueden registrar pagos a futuro'});
                return;
            }

            try {                

                // Sumar 30 días de forma segura
                const fechaVencimiento = new Date(fechaPago);
                fechaVencimiento.setDate(fechaVencimiento.getDate() + 30);

                // Formato yyyy-MM para mesReferencia
                const mesReferencia = fechaPago.toISOString().slice(0, 7);

                const monto = paymentAmount.value;
                const usuarioId = props.id;
                
                await addDoc(collection(db, 'pago'), {
                    fechaPago,
                    fechaVencimiento,
                    mesReferencia,
                    monto,
                    usuarioId,
                });

                const formatFecha = (timestamp) => {
                    const date = new Date(timestamp);
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const year = date.getFullYear();
                    return `${day}/${month}/${year}`;
                };

                alert({message: `Pago registrado con éxito para la fecha: ${formatFecha(fechaPago)}`});
                paymentDate.value = null;
                paymentAmount.value = null;
                document.querySelector('input[placeholder="Fecha de pago"]').value = '';
            } catch (error) {
                console.error('Error al registrar el pago:', error);
                alert({message: 'Hubo un error al registrar el pago. Inténtelo nuevamente.'});
            }
        } else {
            alert({message: 'Por favor, seleccione una fecha antes de registrar el pago.'});
            return;
        }
        showPopup.value = false;
    };

    const formatFecha = (timestamp) => {
      if (!timestamp) return 'Fecha no disponible';
      const date = new Date(timestamp);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };
    
    onMounted(async () => {
        const clienteRef = doc(db, 'usuario', props.id);
        try {
            
            const clienteSnap = await getDoc(clienteRef);
            if (clienteSnap.exists()) {
                cliente.value = clienteSnap.data();                
                if (clienteSnap.exists()) {
                  const data = clienteSnap.data()
                  cliente.value = {
                    ...data,
                    // ⬇️ La fecha ya queda lista en dd/mm/aaaa para toda la vista
                    fechaNacimiento: formatDateAR(data.fechaNacimiento),
                  }
              }
              
                  // Obtener el último pago del cliente
                const pagosQuery = query(
                    collection(db, 'pago'),
                    where('usuarioId', '==', props.id),
                    orderBy('fechaPago', 'desc')
                );
                const pagosSnapshot = await getDocs(pagosQuery);
                const pagosCliente = pagosSnapshot.docs.map(doc => doc.data());
                if (pagosCliente.length > 0) {
                    const formatFecha = (timestamp) => {
                        const date = timestamp.toDate();
                        const day = String(date.getDate()).padStart(2, '0');
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const year = date.getFullYear();
                        return `${day}/${month}/${year}`;
                    };

                    ultimoPago.value = formatFecha(pagosCliente[0].fechaPago);
                    vencimiento.value = formatFecha(pagosCliente[0].fechaVencimiento);
                    const hoy = new Date();
                    const fechaPago = pagosCliente[0].fechaPago.toDate();
                    const fechaVenc = pagosCliente[0].fechaVencimiento.toDate();

                    // Determinar estado de la cuota
                    if (hoy >= fechaPago && hoy <= fechaVenc) {
                        estadoCuota.value = 'Al día';
                    } else {
                        estadoCuota.value = 'Cuota vencida';
                    }
                } else {
                    estadoCuota.value = 'Cuota vencida'; // Por defecto si no hay pagos
                }

                const rutinasPromises = (cliente.value.rutinasAsignadas || [])
            .filter(rutinaId => rutinaId && typeof rutinaId === 'string')
            .map(async (rutinaId) => {
              const rutinaRef = doc(db, 'rutinas', rutinaId);
              const rutinaSnap = await getDoc(rutinaRef);
              if (rutinaSnap.exists()) {
                const rutinaData = rutinaSnap.data();
                return {                  
                  asignarRutina,
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
      paymentAmount,
      estadoCuota,
      ultimoPago,
      vencimiento,
      quitarRutina,
      abrirPopupAsignarRutina,
      showAssignPopup,
      rutinasDisponibles,
      asignarRutina,
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

.button-group {
  display: flex;
  justify-content: center;
  gap: 10px;
}
.info-extra {
  margin-top: 1rem;
}

.info-item {
  margin-bottom: 6px;
  font-size: 14px;
  color: #333;
}

</style>
