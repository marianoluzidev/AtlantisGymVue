<template>
  <f7-page name="notificaciones">
    <f7-navbar title="Notificaciones" />

    <f7-list v-if="notiStore.notificaciones.length > 0">
      <f7-list-item
        v-for="n in notiStore.notificaciones"
        :key="n.id"
        :title="n.mensaje"
        :subtitle="n.mensaje"
        :footer="n.fecha ? new Date(n.fecha.seconds * 1000).toLocaleString() : ''"
      />
    </f7-list>

    <f7-block v-else class="text-align-center">
      <p>No hay notificaciones por ahora.</p>
    </f7-block>
  </f7-page>
</template>

<script setup>
import { watch } from 'vue';
import { useUserStore } from '../js/user';
import { useNotificacionesStore } from '../js/useNotificaciones';

const userStore = useUserStore();
const notiStore = useNotificacionesStore();

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
</script>
