<template>
  <f7-page class="home">
    <!-- Cartel de Cargando -->
    <div v-if="isLoading" class="loading-overlay">
      <p>Cargando...</p>
    </div>

    <f7-navbar title="Rutinas" back-link="Back" />

    <f7-list strong inset v-if="rutinas.length > 0">
      <f7-list-item
        v-for="rutina in rutinas"
        :key="rutina.id"
        :title="rutina.nombre || 'Nombre no disponible'"
        :link="'/rutinasimpledetalle/' + rutina.id"
      />
    </f7-list>

    <f7-list strong inset v-else>
      <f7-list-item>
        <div class="no-rutinas">
          <p>No hay rutinas asignadas</p>
        </div>
      </f7-list-item>
    </f7-list>

    <!-- Botón para pedir nueva rutina -->
    <f7-block>
      <f7-button fill @click="pedirNuevaRutina" :disabled="!puedePedirRutina">
        Pedir nueva rutina
      </f7-button>
      <p v-if="!puedePedirRutina" class="text-color-gray text-align-center mt-2">
        Solo podés solicitar una rutina cada 30 días.
      </p>
    </f7-block>
  </f7-page>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useUserStore } from '../js/user';
import { useNotificacionesStore } from '../js/useNotificaciones';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { f7 } from 'framework7-vue';

export default {
  setup() {
    const userStore = useUserStore();
    const notiStore = useNotificacionesStore();

    const rutinas = ref([]);
    const isLoading = ref(true);

    const puedePedirRutina = ref(true);

    const verificarSiPuedePedir = async () => {
      const userRef = doc(db, 'usuario', userStore.user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        if (data.ultimaAsignacionRutina) {
          const fechaUltima = data.ultimaAsignacionRutina.toDate();
          const ahora = new Date();
          const dias = (ahora - fechaUltima) / (1000 * 60 * 60 * 24);          
          puedePedirRutina.value = dias >= 30;          
        }
      }
    };

    const fetchUserRutinas = async () => {
      try {
        if (!userStore.user?.uid) {
          console.error('El ID del usuario no está definido.');
          return;
        }
        verificarSiPuedePedir();
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
      await fetchUserRutinas();
      try {
        const userRutinasIds = userStore.user?.rutinasAsignadas || [];
        if (userRutinasIds.length === 0) {
          isLoading.value = false;
          return;
        }

        const rutinasQuery = query(
          collection(db, 'rutinas'),
          where('id', 'in', userRutinasIds)
        );

        const querySnapshot = await getDocs(rutinasQuery);
        rutinas.value = querySnapshot.docs.map(doc => ({
          id: doc.id,
          nombre: doc.data()?.nombre,
        }));

        isLoading.value = false;
      } catch (error) {
        console.error('Error fetching rutinas:', error);
      }
    };
    
    const obtenerAdmins = async () => {
      const q = query(
        collection(db, 'usuario'),
        where('admin', '==', true)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.id);
    };
    
    const pedirNuevaRutina = async () => {
    const user = userStore.user;
    if (!user || !user.uid) {
      f7.dialog.alert('Error: usuario no autenticado.');
      return;
    }

    const mensaje = `${user.nombre} ${user.apellido} ha solicitado una nueva rutina`;

    try {
      const admins = await obtenerAdmins();

      await Promise.all(admins.map(async (adminUid) => {
        await notiStore.enviarNotificacion({
          titulo: 'Nueva solicitud de rutina',
          mensaje,
          paraUid: adminUid,
          deUid: user.uid,
          tipo: 'admin'
        });
      }));

      f7.dialog.alert('La solicitud fue enviada a los administradores.');
    } catch (error) {
      console.error('Error al enviar notificaciones:', error);
      f7.dialog.alert('Hubo un error al enviar la solicitud.');
    }
  };


    onMounted(() => {
      if (userStore.user?.uid) {
        fetchRutinas();
      }
    });

    return {
      rutinas,
      isLoading,
      pedirNuevaRutina,
      puedePedirRutina
    };
  }
};
</script>
