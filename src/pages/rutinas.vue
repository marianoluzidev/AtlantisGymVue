<template>
  <f7-page class="home" >
    <!-- Cartel de Cargando -->
    <div v-if="isLoading" class="loading-overlay">
      <p>Cargando...</p>
    </div>
    <f7-navbar title="Rutinas" back-link="Back"></f7-navbar>
    <f7-list strong inset>
      <f7-list-item
        v-for="rutina in rutinas"
        :key="rutina.id"
        :title="rutina.nombre || 'Nombre no disponible'"
        :link="'/rutinadetalle/' + rutina.id"
      ></f7-list-item>
    </f7-list>
  </f7-page>

</template>
  <script>
  import { ref, onMounted } from 'vue';
  import { useUserStore } from '../js/user';
  import { collection, getDocs, query, where } from 'firebase/firestore';
  import { db } from '../firebase/firebase';
  
  export default {
    setup() {
      const userStore = useUserStore();
      const rutinas = ref([]);
      const isLoading = ref(true); // Estado de carga
  
      const fetchRutinas = async () => {
        try {
          const userRutinasIds = userStore.user?.rutinasAsignadas || [];

          if (userRutinasIds.length === 0) return;
  
          const rutinasQuery = query(
            collection(db, 'rutinas'),
            where('id', 'in', userRutinasIds)
          );
  
          const querySnapshot = await getDocs(rutinasQuery);

          rutinas.value = querySnapshot.docs.map(doc => {
            const data = doc.data();

            return {
              id: doc.id,
              nombre: data?.nombre,
            };
          });
          
          isLoading.value = false; // Finalizar carga
        } catch (error) {
          console.error('Error fetching rutinas:', error);
        }
      };
  
      onMounted(fetchRutinas);
  
      return { rutinas, isLoading };
    },
  };
  </script>
  