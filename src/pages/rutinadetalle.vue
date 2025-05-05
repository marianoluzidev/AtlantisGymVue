<template>
    <f7-page class="home" >
      <f7-navbar title="Rutinas Detalle" back-link="Back"></f7-navbar>
      <h1>{{ rutina.nombre }}</h1>
      <h2>Nivel: {{ rutina.nivel }}</h2>
      <div v-for="dia in dias" :key="dia.id">
        <h3>Día: {{ dia.nombre }}</h3>
        <ul>
          <li v-for="ejercicio in dia.ejercicios" :key="ejercicio.id">
            <p>Ejercicio: {{ ejercicio.nombre }}</p>
            <p>Series: {{ ejercicio.series }}</p>
            <p>Repeticiones: {{ ejercicio.repeticiones }}</p>
            <p>Notas: {{ ejercicio.notas }}</p>
            <p>Descanso: {{ ejercicio.descanso }}</p>
          </li>
        </ul>
      </div>
      
    </f7-page>
  
  </template>
    <script>
    
    import { ref, onMounted } from 'vue';
    import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
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
    
        const fetchRutinaData = async () => {
          try {
            // Fetch rutina data
            const rutinaDocRef = doc(db, 'rutinas', props.id);
            const rutinaDoc = await getDoc(rutinaDocRef);
            if (rutinaDoc.exists()) {
              rutina.value = rutinaDoc.data();
            }
            console.log('Rutina:', rutina.value);
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
                        const ejercicioDetailsDoc = await getDoc(                          
                          doc(db, 'ejercicios', ejercicio.ejercicio_id)
                        );
                        console.log('ejercicioDetailsDoc:', ejercicioDetailsDoc.data());
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
          }
        };
    
        onMounted(fetchRutinaData);
    
        return { rutina, dias };
      },
    };
    </script>
    