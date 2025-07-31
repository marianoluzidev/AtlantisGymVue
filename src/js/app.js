// app.js corregido con manejo de botón atrás
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Framework7 from 'framework7/lite-bundle';
import Framework7Vue, { registerComponents, f7, f7ready } from 'framework7-vue/bundle';
import 'framework7/css/bundle';
import '../css/icons.css';
import '../css/app.css';
import App from '../components/app.vue';
import { useUserStore } from './user';
import { App as CapacitorApp } from '@capacitor/app';

Framework7.use(Framework7Vue);

const app = createApp(App);
app.use(createPinia());
registerComponents(app);
app.mount('#app');

f7ready(() => {
  window.f7 = f7;
  const store = useUserStore();
  store.initAuth();

  // Manejo del botón atrás
  CapacitorApp.addListener('backButton', () => {
    const view = f7.views.main;
    const router = view.router;
    const currentRoute = router.currentRoute;

    // Si hay historial, volver atrás
    if (router.history.length > 1) {
      router.back();
      return;
    }

    // Si estás en una tab, no hay historial que volver, evitar salir
    const activeTab = document.querySelector('.tab.tab-active');
    const activeTabId = activeTab?.id;

    // Tab activa es admin/home/etc., evitar salir
    const tabsQueNoSalen = ['tab-home', 'tab-admin', 'tab-notificaciones'];
    if (tabsQueNoSalen.includes(activeTabId)) {
      // Opcional: mostrar mensaje o ignorar
      return;
    }

    // Estás en home sin historial: preguntar si querés salir
    f7.dialog.confirm('¿Querés salir de la app?', 'Salir', () => {
      CapacitorApp.exitApp();
    });
  });
  
});
