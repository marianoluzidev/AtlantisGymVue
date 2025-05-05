<template>
  <f7-page class="home" >
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
  
      const fetchRutinas = async () => {
        try {
          const userRutinasIds = userStore.user?.rutinasAsignadas || [];
          console.log('userRutinasIds:', userRutinasIds);
          console.log('userRutinasIds len:', userRutinasIds.length);
          if (userRutinasIds.length === 0) return;
  
          const rutinasQuery = query(
            collection(db, 'rutinas'),
            where('id', 'in', userRutinasIds)
          );
  
          const querySnapshot = await getDocs(rutinasQuery);
          console.log('querySnapshot:', querySnapshot);
          rutinas.value = querySnapshot.docs.map(doc => {
            const data = doc.data();
            console.log('Document ID:', doc.id, 'Document Data:', data.nombre);
            return {
              id: doc.id,
              nombre: data?.nombre,
            };
          });
          console.log('Rutinas:', rutinas.value);
        } catch (error) {
          console.error('Error fetching rutinas:', error);
        }
      };
  
      onMounted(fetchRutinas);
  
      return { rutinas };
    },
  };
  </script>
  