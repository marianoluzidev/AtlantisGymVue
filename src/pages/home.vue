<template>
  <f7-page name="home" class="home" >
    <!-- Cartel de Cargando -->
    <div v-if="isLoading" class="loading-overlay">
      <p>Cargando...</p>
    </div>
    <!-- Top Navbar -->
    <f7-navbar class="app-font" title="ATLANTIS GYM ( test v0.13)"/>
    
    <!-- Motivational Image + Quote -->
    <div class="motivational-banner">
      <img src="../img/mancuernas.png" alt="Dumbbell" />
      <div class="quote">NO PAIN<br>NO GAIN</div>
    </div>

    <!--<f7-block >--->
      <div class="bienvenida-cliente">
        <h2>HOLA {{ cliente.nombre }}</h2>
        <div class="info-cliente ">
          <div class="info-box">
            <div class="info-label">Peso</div>
            <div class="info-value texto-gris">{{ cliente.peso }} kg</div>
          </div>
          <div class="info-box">
            <div class="info-label">Altura</div>
            <div class="info-value texto-gris">{{ cliente.altura }} cm</div>
          </div>
          <div class="info-box">
            <div class="info-label">Objetivo</div>
            <div class="info-value texto-gris">{{ cliente.objetivo }}</div>
          </div>
        </div>
      </div>  
    <!---</f7-block>    --->

    <!-- Cuota Section -->        
    <div class="estado-cuota">
        <div class="cuota-card">
            <div class="cuota-estado" style="text-align: center;">CUOTA</div>
            <ul class="cuota-info" style="list-style: none; padding-bottom: 15px; margin-left: 10px; text-align: start; padding-left: 0; line-height: 2;">
                <li><strong>Último pago:</strong> ---</li>
                <li><strong>Vencimiento:</strong> ---</li>
                <li><strong>Estado:</strong> ---</li>
            </ul>
            <button v-if="estado !== 'Al día'" class="btn-pagar" @click="window.location.href='https://mpago.la/1fd9U59'">PAGAR</button>
        </div>
    </div>
              
    <f7-list strong inset >
      <f7-list-item link="/rutinas/" title="Rutinas">
        <template #media><f7-icon md="material:fitness_center" ios="f7:fitness_center" /></template>
      </f7-list-item>
      <f7-list-item :link="`/historialpagos/${userId}/false`" title="Pagos">
        <template #media><f7-icon md="material:attach_money" ios="f7:attach_money" /></template>
      </f7-list-item>
      <f7-list-item link="/perfil/" title="Mi Perfil">
        <template #media><f7-icon md="material:person" ios="f7:person" /></template>
      </f7-list-item>
    </f7-list>
    
    <div class="estado-cuota">
      <f7-button class="btn-pagar" fill @click="logout">Logout</f7-button>
    </div>

  </f7-page>
</template>

<script>
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase/'; // tu archivo donde configurás Firebase
import { f7 } from 'framework7-vue';
import { useUserStore } from '../js/user'
import { computed, watch, onMounted, ref } from 'vue'
import { getFirestore, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

export default {
  setup() {
    const userStore = useUserStore();    
    const isLoading = ref(true); 
    const estado = ref('Al día'); // Estado de la cuota
    const cliente = computed(() => ({
      nombre: userStore.user?.nombre || 'Invitado',
      peso: userStore.user?.peso || '--',
      altura: userStore.user?.altura || '--',
      objetivo: userStore.user?.objetivo || '--',
      cuota: 'Cuota vencida',
    }));

    onMounted(async () => {
      await userStore.fetchUserData?.();      
    });

    const userId = computed(() => userStore.user?.uid || null);

    watch(userId, (newUid) => {
      if (newUid) {        
        
        const db = getFirestore();
        
        watch(userId, async (newUid) => {
          if (newUid) {            
        
            try {
              // Consulta a Firestore
              const pagosRef = collection(db, 'pago');
              const q = query(
                pagosRef,
                where('usuarioId', '==', newUid),
                orderBy('fechaPago', 'desc'),
                limit(1)
              );
              const querySnapshot = await getDocs(q);
        
              if (!querySnapshot.empty) {
                const ultimoPago = querySnapshot.docs[0].data();
                const fechaPago = new Date(ultimoPago.fechaPago.seconds * 1000);
                const fechaVencimiento = new Date(ultimoPago.fechaVencimiento.seconds * 1000);
                const hoy = new Date();
                        
                estado.value = hoy >= fechaPago && hoy <= fechaVencimiento ? 'Al día' : 'Pago vencido';
        
                // Actualizar la sección Cuota
                const cuotaInfo = document.querySelector('.cuota-info');
                if (cuotaInfo) {
                  cuotaInfo.innerHTML = `
                    <li><strong>Último pago:</strong> ${fechaPago.toLocaleDateString()}</li>
                    <li><strong>Vencimiento:</strong> ${fechaVencimiento.toLocaleDateString()}</li>
                    <li><strong>Estado:</strong> <span style="color: ${estado.value === 'Pago vencido' ? 'red' : 'inherit'};">${estado.value}</span></li>
                  `;
                }
              } else {
                console.log('No se encontraron pagos para este usuario.');
              }
            } catch (error) {
              console.error('Error al obtener el último pago:', error);
            }
            isLoading.value = false; // Finalizar carga
          }
        }, { immediate: true });
      }
    }, { immediate: true });

    const logout = async () => {
      try {
        await signOut(auth);        

        // Redireccionar al login
        f7.views.main.router.navigate('/login/');
        //isLoading.value = false;
        
      } catch (error) {
        console.error('Error al hacer logout:', error);
      }
    };

    return {
      isLoading,
      cliente,
      logout,
      estado,
      userId
    };
  },
};
</script>


