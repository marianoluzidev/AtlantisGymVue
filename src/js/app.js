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

const tabHistory = [];

f7ready(() => {
  window.f7 = f7;
  const store = useUserStore();
  store.initAuth();

    // Auto-update + recarga al activar nueva versión
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').then((reg) => {
        if (reg.waiting) reg.waiting.postMessage({ type: 'SKIP_WAITING' });

        navigator.serviceWorker.addEventListener('controllerchange', () => {
          window.location.reload();
        });

        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') reg.update();
        });
      });
    });
  }

  let currentTab = 'view-home'; // tab inicial por defecto

  f7.on('tabShow', (tabEl) => {
    const newTabId = tabEl.id;
    console.log('Tab cambiado a:', newTabId);
    if (newTabId !== currentTab) {
      tabHistory.push(currentTab);
      currentTab = newTabId;
    }
  });

  CapacitorApp.addListener('backButton', () => {
    const view = f7.views.main;
    const router = view.router;

    // Si hay historial de navegación normal (no tabs)
    if (router.history.length > 1) {
      router.back();
      return;
    }

    // Si hay historial de tabs, volver al anterior
    if (tabHistory.length > 0) {
      const prevTab = tabHistory.pop();
      currentTab = prevTab;
      const link = document.querySelector(`.tab-link[tab-link="#${prevTab}"]`);
      if (link) link.click();
      return;
    }

    // Si estás en el tab inicial, preguntar si querés salir
    f7.dialog.confirm('¿Querés salir de la app?', 'Salir', () => {
      CapacitorApp.exitApp();
    });
  });
});
