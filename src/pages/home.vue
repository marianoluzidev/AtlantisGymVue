<template>
  <f7-page name="home" class="home" >
    <!-- Cartel de Cargando -->
    <div v-if="isLoading" class="loading-overlay">
      <p>Cargando...</p>
    </div>
    <!-- Top Navbar -->
    <f7-navbar title="ATLANTIS GYM ( test v0.8)"/>
    
    <!-- Motivational Image + Quote -->
    <div class="motivational-banner">
      <img src="../img/mancuernas.png" alt="Dumbbell" />
      <div class="quote">NO PAIN<br>NO GAIN</div>
    </div>

    <!--<f7-block >--->
      <div class="bienvenida-cliente">
        <h2>BIENVENIDO, {{ cliente.nombre }}</h2>
        <div class="info-cliente">
          <div class="info-box">
            <div class="info-label">Peso</div>
            <div class="info-value">{{ cliente.peso }} kg</div>
          </div>
          <div class="info-box">
            <div class="info-label">Altura</div>
            <div class="info-value">{{ cliente.altura }} cm</div>
          </div>
          <div class="info-box">
            <div class="info-label">Objetivo</div>
            <div class="info-value">{{ cliente.objetivo }}</div>
          </div>
        </div>
      </div>  
    <!---</f7-block>    --->

    <!-- Cuota Section -->        
    <div class="estado-cuota">
      <div class="cuota-card">
        <div class="cuota-estado">CUOTA VENCIDA</div>
        <button class="btn-pagar" >PAGAR</button>
      </div>
    </div>    
          
    <f7-list strong inset>
      <f7-list-item link="/rutinas/" title="Rutina actual"></f7-list-item>
      <f7-list-item link="/about/" title="Pagos"></f7-list-item>
      <f7-list-item link="/perfil/" title="Mi Perfil"></f7-list-item>
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
import { computed, ref , onMounted} from 'vue'

export default {
  setup() {
    const userStore = useUserStore();
    const isLoading = computed(() => userStore.isLoading);

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
    };
  },
};
</script>


