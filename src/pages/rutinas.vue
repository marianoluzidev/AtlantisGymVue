<template>
  <f7-page class="home" >
    <!-- Cartel de Cargando -->
    <div v-if="isLoading" class="loading-overlay">
      <p>Cargando...</p>
    </div>
    <f7-navbar title="Rutinas" back-link="Back"></f7-navbar>
    <f7-list strong inset v-if="rutinas.length > 0">
      <f7-list-item
        v-for="rutina in rutinas"
        :key="rutina.id"
        :title="rutina.nombre || 'Nombre no disponible'"
        :link="'/rutinadetalle/' + rutina.id"
      ></f7-list-item>
    </f7-list>    
    <f7-list strong inset  v-else >
      <f7-list-item>
          <div class="no-rutinas">
            <p>No hay rutinas asignadas</p>
          </div>
      </f7-list-item>
    </f7-list>

    
  </f7-page>

</template>
  <script>
  import { ref, onMounted, watch } from 'vue';
  import { useUserStore } from '../js/user';
  import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
  import { db } from '../firebase/firebase';
  
  export default {
    setup() {
      const userStore = useUserStore();
      const rutinas = ref([]);
      const isLoading = ref(true); // Estado de carga
  
      const fetchUserRutinas = async () => {
        try {
          if (!userStore.user?.uid) {
            console.error('El ID del usuario no está definido.');
            return;
          }
          const userRef = doc(db, 'usuario', userStore.user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            userStore.user = {
              ...userStore.user,
              rutinasAsignadas: userSnap.data()?.rutinasAsignadas || [],
            };
          }
        } catch (error) {
          console.error('Error al refrescar rutinas asignadas del usuario:', error);
        }
      };
      
      const fetchRutinas = async () => {
        await fetchUserRutinas(); // Refrescar la información de rutinas asignadas
        try {
          const userRutinasIds = userStore.user?.rutinasAsignadas || [];
          
          if (userRutinasIds.length === 0) {
            isLoading.value = false; // Finalizar carga si no hay rutinas
            return
          };
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
  
      onMounted(() => {        
        if (userStore.user?.uid) {
          fetchRutinas();
        }
      });
  
      return { rutinas, isLoading };
    },
  };
  </script>
  