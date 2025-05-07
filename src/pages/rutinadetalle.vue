<template>
  <f7-page class="routine-detail-page home">
    <f7-navbar title="Rutinas Detalle" back-link="Back" class="navbar-custom"></f7-navbar>

    <!-- Cartel de Cargando -->
    <div v-if="isLoading" class="loading-overlay">
      <p>Cargando...</p>
    </div>

    <div class="routine-header">
      <h1>{{ rutina.nombre }}</h1>
      <h2>Nivel: {{ rutina.nivel }}</h2>
    </div>

    <div v-for="dia in dias" :key="dia.id" class="day-card">
      <h3 class="day-title">🗓 Día: {{ dia.nombre }}</h3>
      <table class="exercise-table">
        <thead>
          <tr>
            <th>Ejercicio</th>
            <th>Series</th>
            <th>Reps</th>
            <th>Descanso</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ejercicio in dia.ejercicios" :key="ejercicio.id">
            <td>{{ ejercicio.nombre }}</td>
            <td>{{ ejercicio.series }}</td>
            <td>{{ ejercicio.repeticiones }}</td>
            <td>{{ ejercicio.descanso }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </f7-page>
</template>
    <script>
    
    import { ref, onMounted } from 'vue';
    
    import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
    import { db } from '../firebase/firebase';
    
    export default {
      props: {
        id: {
          type: String,
          required: true,
        },
      },
      setup(props) {
        const rutina = ref({});
        const dias = ref([]);
    
        const isLoading = ref(true); // Estado de carga
        
        const fetchRutinaData = async () => {
          try {
            // Fetch rutina data
            const rutinaDocRef = doc(db, 'rutinas', props.id);
            const rutinaDoc = await getDoc(rutinaDocRef);
            if (rutinaDoc.exists()) {
              rutina.value = rutinaDoc.data();
            }            
            // Fetch dias and ejercicios from rutina document
            if (rutinaDoc.exists()) {
              const rutinaData = rutinaDoc.data();
              rutina.value = {
                nombre: rutinaData.nombre,
                nivel: rutinaData.nivel,
              };
    
              const diasData = await Promise.all(
                rutinaData.dias.map(async dia => {
                  const ejerciciosData = await Promise.all(
                    dia.ejercicios.map(async ejercicio => {                      
                      if (ejercicio.ejercicio_id) {
                        const ejerciciosCollection = collection(db, 'ejercicios');
                        const ejercicioQuery = query(ejerciciosCollection, where('ejercicio_id', '==', ejercicio.ejercicio_id));
                        const querySnapshot = await getDocs(ejercicioQuery);
                        let ejercicioDetails = null;
                        querySnapshot.forEach(doc => {
                          ejercicioDetails = doc.data();
                        });
                        if (ejercicioDetails) {                          
                          return {
                            ...ejercicio,
                            nombre: ejercicioDetails.nombre,
                          };
                        } else {
                          console.warn(`Ejercicio con ejercicio_id ${ejercicio.ejercicio_id} no encontrado.`);
                          return {
                            ...ejercicio,
                            nombre: 'Nombre no disponible',
                          };
                        }                        
                        return {
                          ...ejercicio,
                          nombre: ejercicioDetailsDoc.exists()
                            ? ejercicioDetailsDoc.data().nombre
                            : 'Nombre no disponible',
                        };
                      } else {
                        return {
                          ...ejercicio,
                          nombre: 'ID de ejercicio no disponible',
                        };
                      }
                      return {
                        ...ejercicio,
                        nombre: ejercicioDetailsDoc.exists()
                          ? ejercicioDetailsDoc.data().nombre
                          : 'Nombre no disponible',
                      };
                    })
                  );
              
                  return {
                    nombre: dia.nombre,
                    ejercicios: ejerciciosData,
                  };
                })
              );
              
              dias.value = diasData;
            }
          } catch (error) {
            console.error('Error fetching rutina data:', error);
          } finally {
            isLoading.value = false; // Finalizar carga
          }
        };
    
        onMounted(fetchRutinaData);
    
        return { rutina, dias, isLoading };
      },
    };
    </script>

    
