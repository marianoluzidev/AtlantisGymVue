// Import Vue
import { createApp } from 'vue';

import { createPinia } from 'pinia'

// Import Framework7
import Framework7 from 'framework7/lite-bundle';

// Import Framework7-Vue Plugin
import Framework7Vue, { registerComponents } from 'framework7-vue/bundle';

// Import Framework7 Styles
import 'framework7/css/bundle';

import { f7 } from 'framework7-vue';

// Import Icons and App Custom Styles
import '../css/icons.css';
import '../css/app.css';

// Import App Component
import App from '../components/app.vue';

// Init Framework7-Vue Plugin
Framework7.use(Framework7Vue);

// Init App
const app = createApp(App);

// Register Framework7 Vue components
registerComponents(app);

import { useUserStore } from './user';

app.use(createPinia());

// Inicializar el estado del usuario
const userStore = useUserStore();
userStore.initAuth();

// Manejar el evento del botón físico de retroceso
document.addEventListener('deviceready', () => {
  document.addEventListener('backbutton', (event) => {
    event.preventDefault();
    const mainView = f7.views.main;

    if (mainView.router && mainView.router.history.length > 1) {
      mainView.router.back();
    } else {
      f7.dialog.confirm('¿Deseas salir de la aplicación?', () => {
        if (typeof navigator !== 'undefined' && navigator.app) {
          navigator.app.exitApp();
        } else if (typeof navigator !== 'undefined' && navigator.device) {
          navigator.device.exitApp();
        } else {
          console.warn('No se pudo cerrar la aplicación: API no disponible.');
        }
      });
    }
  }, false);
});

// Mount the app
app.mount('#app');
import { App as CapacitorApp } from '@capacitor/app';


CapacitorApp.addListener('backButton', () => {
  if (router.currentRoute.value.path === '/') {
    // estás en la pantalla principal
    console.log('Botón atrás en home, prevenís la salida');
  } else {
    router.back(); // vuelve una ruta atrás
  }
});