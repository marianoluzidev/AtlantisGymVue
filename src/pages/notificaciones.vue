<template>
  <f7-page name="notificaciones">
    <f7-navbar title="Notificaciones" />

    <f7-list v-if="notiStore.notificaciones.length > 0">
      <f7-list-item
        v-for="n in notiStore.notificaciones"
        :key="n.id"
        :title="n.titulo"
        :subtitle="n.mensaje"
        :footer="n.fecha ? new Date(n.fecha.seconds * 1000).toLocaleString() : ''"
        :class="n.leida ? 'noti-leida' : 'noti-no-leida'"
        @click="mostrarDetalle(n)"
      />
    </f7-list>

    <f7-block v-else class="text-align-center">
      <p>No hay notificaciones por ahora.</p>
    </f7-block>

    <!-- PopUp de detalle -->
    <f7-popup v-model:opened="popupAbierto">
      <f7-page>
        <f7-navbar title="Detalle" />
        <f7-block>
          <h3>{{ notificacionSeleccionada?.titulo }}</h3>
          <p>{{ notificacionSeleccionada?.mensaje }}</p>
          <f7-button fill @click="cerrarPopup">Cerrar</f7-button>
        </f7-block>
      </f7-page>
    </f7-popup>
  </f7-page>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useUserStore } from '../js/user';
import { useNotificacionesStore } from '../js/useNotificaciones';
import { doc, updateDoc, getFirestore } from 'firebase/firestore';

const db = getFirestore();
const userStore = useUserStore();
const notiStore = useNotificacionesStore();

const popupAbierto = ref(false);
const notificacionSeleccionada = ref(null);

// Cargar las notificaciones cuando el usuario esté disponible
watch(
  () => userStore.user,
  (user) => {
    if (user && user.uid) {
      if (user.admin) {
        notiStore.cargarNotificacionesAdmin(user.uid);
      } else {
        notiStore.cargarNotificaciones(user.uid);
      }
    }
  },
  { immediate: true }
);

const mostrarDetalle = async (noti) => {
  notificacionSeleccionada.value = noti;
  popupAbierto.value = true;

  if (!noti.leida) {
    try {
      const ref = doc(db, 'notificaciones', noti.id);
      await updateDoc(ref, { leida: true });
      noti.leida = true; // cambio local reactivo
    } catch (err) {
      console.error('Error al marcar como leída:', err);
    }
  }
};

const cerrarPopup = () => {
  popupAbierto.value = false;
};
</script>

<style scoped>
.noti-no-leida {
  background-color: #fff9c4; /* amarillo claro */
}
.noti-leida {
  background-color: #ffffff;
}
</style>
