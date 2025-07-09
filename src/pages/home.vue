<template>
  <f7-page name="home" class="home">
    <div v-if="isLoading" class="loading-overlay"><p>Cargando...</p></div>
    <f7-navbar class="app-font" :title="`ATLANTIS GYM ${version}`" />
    
    <div class="motivational-banner">
      <img src="../img/mancuernas.png" alt="Dumbbell" />
      <div class="quote">NO PAIN<br>NO GAIN</div>
    </div>

    <div class="bienvenida-cliente">
      <h2>HOLA {{ cliente.nombre }}</h2>
      <div class="info-cliente">
        <div class="info-box"><div class="info-label">Peso</div><div class="info-value texto-gris">{{ cliente.peso }} kg</div></div>
        <div class="info-box"><div class="info-label">Altura</div><div class="info-value texto-gris">{{ cliente.altura }} cm</div></div>
        <div class="info-box"><div class="info-label">Objetivo</div><div class="info-value texto-gris">{{ cliente.objetivo }}</div></div>
      </div>
    </div>

    <div v-if="userId" class="estado-cuota">
      <div class="cuota-card">
        <div class="cuota-estado" style="text-align: center;">CUOTA</div>

        <ul v-if="ultimoPago" class="cuota-info" style="list-style: none; padding-bottom: 15px; margin-left: 10px; text-align: start; padding-left: 0; line-height: 2;">
          <li><strong>Último pago:</strong> {{ new Date(ultimoPago.fechaPago.seconds * 1000).toLocaleDateString() }}</li>
          <li><strong>Vencimiento:</strong> {{ new Date(ultimoPago.fechaVencimiento.seconds * 1000).toLocaleDateString() }}</li>
          <li><strong>Estado:</strong> 
            <span :style="{ color: estado === 'Pago vencido' ? 'red' : 'inherit' }">{{ estado }}</span>
          </li>
        </ul>

        <p v-else style="text-align: center; color: red;">Sin pagos registrados</p>

        <button v-if="estado !== 'Al día'" class="btn-pagar" @click="window.location.href='https://mpago.la/1fd9U59'">PAGAR</button>
      </div>
    </div>

    <f7-list strong inset>
      <f7-list-item link="/rutinas/" title="Rutinas"><template #media><f7-icon md="material:fitness_center" ios="f7:fitness_center" /></template></f7-list-item>
      <f7-list-item :link="`/historialpagos/${userId}/false`" title="Pagos"><template #media><f7-icon md="material:attach_money" ios="f7:attach_money" /></template></f7-list-item>
      <f7-list-item link="/perfil/" title="Mi Perfil"><template #media><f7-icon md="material:person" ios="f7:person" /></template></f7-list-item>
    </f7-list>

    <div class="estado-cuota">
      <f7-button class="btn-pagar" fill @click="logout">Logout</f7-button>
    </div>
  </f7-page>
</template>

<script>
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { f7 } from 'framework7-vue';
import { useUserStore } from '../js/user';
import { computed, watch, ref, onMounted } from 'vue';
import { getFirestore, collection, query, where, orderBy, limit, getDocs, doc, getDoc } from 'firebase/firestore';
import { appConfig } from '../js/config';

export default {
  setup() {
    const userStore = useUserStore();
    const isLoading = ref(true);
    const estado = ref('Al día');
    const db = getFirestore();
    const version = appConfig.version;
    const cargandoDatos = ref(false);
    const ultimoPago = ref(null);

    const cliente = computed(() => ({
      nombre: userStore.user?.nombre || '',
      peso: userStore.user?.peso || '--',
      altura: userStore.user?.altura || '--',
      objetivo: userStore.user?.objetivo || '--'
    }));

    const userId = computed(() => userStore.user?.uid || null);

    watch(
      () => userStore.user,
      async (newUser) => {
        if (newUser?.uid && !cargandoDatos.value) {
          cargandoDatos.value = true;
          try {
            const userRef = doc(db, 'usuario', newUser.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
              const data = userSnap.data();
              userStore.setUser({ uid: newUser.uid, email: newUser.email, ...data });
            }
          } catch (error) {
            console.error('Error al traer datos de usuario:', error);
          } finally {
            isLoading.value = false;
            cargandoDatos.value = false;
          }
        } else if (!newUser?.uid) {
          // limpieza por seguridad
          ultimoPago.value = null;
          estado.value = 'Al día';
          f7.views.main.router.navigate('/login/');
        }
      },
      { immediate: true }
    );

    watch(userId, async (newUid) => {
      if (newUid) {
        try {
          const pagosRef = collection(db, 'pago');
          const q = query(pagosRef, where('usuarioId', '==', newUid), orderBy('fechaPago', 'desc'), limit(1));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            ultimoPago.value = querySnapshot.docs[0].data();
            const fechaPago = new Date(ultimoPago.value.fechaPago?.seconds * 1000);
            const fechaVencimiento = new Date(ultimoPago.value.fechaVencimiento?.seconds * 1000);
            const hoy = new Date();

            estado.value = hoy >= fechaPago && hoy <= fechaVencimiento ? 'Al día' : 'Pago vencido';
          } else {
            ultimoPago.value = null;
            estado.value = 'Pago vencido';
          }
        } catch (error) {
          console.error('Error al obtener el último pago:', error);
        }
      } else {
        // limpieza si se pierde userId
        ultimoPago.value = null;
        estado.value = 'Pago vencido';
      }
    }, { immediate: true });

    const logout = async () => {
      try {
        await signOut(auth)

        userStore.setUser(null) // esto actualiza la reactividad correctamente

        ultimoPago.value = null
        estado.value = 'Al día'
        isLoading.value = false
        cargandoDatos.value = false

        const mainView = f7.views.get('#view-home')
        mainView?.router?.navigate('/login/', { reloadCurrent: true })

      } catch (error) {
        console.error('Error al hacer logout:', error)
      }
    }

    return {
      isLoading,
      cliente,
      logout,
      estado,
      userId,
      version,
      appConfig,
      ultimoPago
    };
  }
};
</script>
