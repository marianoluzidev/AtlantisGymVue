<template>
  <f7-app v-bind="f7params">

    <!-- Left Panel -->
    <f7-panel left cover dark>
      <f7-view>
        <f7-page>
          <f7-navbar title="Left Panel" />
          <f7-block>Contenido panel izquierdo</f7-block>
        </f7-page>
      </f7-view>
    </f7-panel>

    <!-- Right Panel -->
    <f7-panel right reveal dark>
      <f7-view>
        <f7-page>
          <f7-navbar title="Right Panel" />
          <f7-block>Contenido panel derecho</f7-block>
        </f7-page>
      </f7-view>
    </f7-panel>

    <!-- Views y tabbar -->
    <f7-views tabs class="safe-areas">

      <!-- Tabbar solo si el usuario está logueado y no está en /login -->
      <f7-toolbar v-if="userStore.user && !isLoginRoute" tabbar icons bottom>
          <f7-link tab-link="#view-home" tab-link-active icon-ios="f7:house_fill" icon-md="material:home" text="Home" @click="navigateToHome" />
          <f7-link tab-link="#view-timer" icon-ios="f7:square_list_fill" icon-md="material:admin_panel_settings" text="Timer" />
          <f7-link tab-link="#view-notificaciones" icon-ios="f7:bell_fill" icon-md="material:notifications" text="Notificaciones">
            <span class="badge color-red" v-if="notificationCount > 0">{{ notificationCount }}</span>
          </f7-link>
          <f7-link tab-link="#view-admin" icon-ios="f7:square_list_fill" icon-md="material:admin_panel_settings" text="Admin" />
          <f7-link tab-link="#view-settings" icon-ios="f7:gear" icon-md="material:settings" text="Settings" />
      </f7-toolbar>

      <!-- Tabs / Views -->
      <f7-view id="view-home" main tab tab-active url="/" />
      <f7-view id="view-catalog" name="catalog" tab url="/catalog/" />
      <f7-view id="view-settings" name="settings" tab url="/settings/" />
      <f7-view id="view-notificaciones" name="notificaciones" tab url="/notificaciones/" />
      <f7-view id="view-admin" name="admin" tab url="/admin/" />
      <f7-view id="view-timer" name="timer" tab url="/timer/" />
    </f7-views>

    <!-- Popup -->
    <f7-popup id="my-popup">
      <f7-view>
        <f7-page>
          <f7-navbar title="Popup">
            <f7-nav-right>
              <f7-link popup-close>Cerrar</f7-link>
            </f7-nav-right>
          </f7-navbar>
          <f7-block>
            <p>Contenido del popup.</p>
          </f7-block>
        </f7-page>
      </f7-view>
    </f7-popup>

  </f7-app>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { f7, f7ready } from 'framework7-vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useRoute } from 'vue-router'
import store from '../js/store'
import routes from '../js/routes'
import { useUserStore } from '../js/user'
import { useNotificacionesStore } from '../js/useNotificaciones';

const auth = getAuth()
const userStore = useUserStore()
const route = useRoute()
const notiStore = useNotificacionesStore();

const f7params = {
  name: 'AtlantisGym',
  theme: 'md',
  store,
  routes,
  serviceWorker: import.meta.env.MODE === 'production' ? {
      path: '/service-worker.js',
  } : {},
}

// ✅ Comprobación protegida del path
const isLoginRoute = computed(() => route?.path === '/login')

onMounted(() => {
  f7ready(() => {
    onAuthStateChanged(auth, (currentUser) => {
        try {
            userStore.setUser(currentUser)
            if (!currentUser) {
                const mainView = f7.views.get('#view-home')
                if (mainView?.router) {
                    mainView.router.navigate('/login/', { reloadCurrent: true })
                }
                userStore.clearUser(); // Asegurar que el estado del usuario se reinicie
            }
        } catch (error) {
            console.error('Error en la autenticación:', error)
        }
    })
  })
})

const navigateToHome = () => {
    const mainView = f7.views.get('#view-home')
    if (mainView?.router) {
        mainView.router.navigate('/')
    } else {
        console.warn('No se pudo navegar a Home: Router no disponible')
    }
}
</script>
