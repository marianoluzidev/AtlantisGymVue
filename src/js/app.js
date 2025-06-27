// app.js corregido
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Framework7 from 'framework7/lite-bundle';
import Framework7Vue, { registerComponents, f7, f7ready } from 'framework7-vue/bundle';
import 'framework7/css/bundle';
import '../css/icons.css';
import '../css/app.css';
import App from '../components/app.vue';
import { useUserStore } from './user';

Framework7.use(Framework7Vue);

const app = createApp(App);
app.use(createPinia());
registerComponents(app);
app.mount('#app');

f7ready(() => {
  window.f7 = f7;
  const store = useUserStore();
  store.initAuth();
});
