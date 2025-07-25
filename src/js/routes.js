
import HomePage from '../pages/home.vue';
import AboutPage from '../pages/about.vue';
import FormPage from '../pages/form.vue';
import CatalogPage from '../pages/catalog.vue';
import ProductPage from '../pages/product.vue';
import SettingsPage from '../pages/settings.vue';
import LoginPage from '../pages/login.vue'
import RegisterPage from '../pages/register.vue'
import PerfilePage from '../pages/perfil.vue';
import RutinasPage from '../pages/rutinas.vue';
import RutinaDetallePage from '../pages/rutinadetalle.vue';
import RutinasAdminPage from '../pages/rutinasadmin.vue';
import RutinaSimpleDetallePage from '../pages/rutinasimpledetalle.vue';
import AdminPage from '../pages/admin.vue';
import TimerPage from '../pages/timer.vue';
import NotificacionesPage from '../pages/notificaciones.vue';

//admin
import ClientesPage from '../pages/clientes.vue';
import ClienteDetallePage from '../pages/clientedetalle.vue';

import DynamicRoutePage from '../pages/dynamic-route.vue';
import RequestAndLoad from '../pages/request-and-load.vue';
import NotFoundPage from '../pages/404.vue';
import historialpagosPage from '../pages/historialpagos.vue';

var routes = [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/about/',
    component: AboutPage,
  },
  {
    path: '/form/',
    component: FormPage,
  },
  {
    path: '/perfil/',
    component: PerfilePage,
  },
  {
    path: '/rutinas/',
    component: RutinasPage,
  },
    {
    path: '/timer/',
    component: TimerPage,
  },
  {
    path: '/notificaciones/',
    component: NotificacionesPage,
  },
  {
    path: '/admin/',
    component: AdminPage,
  },
  {
    path: '/clientes/',
    component: ClientesPage,
  },
  {
    path: '/clientedetalle/:id',
    component: ClienteDetallePage,
  },
  {
    path: '/historialpagos/:id/:actions',
    component: historialpagosPage,
  },
  {
    path: '/rutinadetalle/:id',
    component: RutinaDetallePage,
  },
  {
    path: '/rutinasadmin/',
    component: RutinasAdminPage,
  },
  {
    path: '/rutinasimpledetalle/:id',
    component: RutinaSimpleDetallePage,
  },
  {
    path: '/catalog/',
    component: CatalogPage,
  },
  {
    path: '/product/:id/',
    component: ProductPage,
  },
  {
    path: '/settings/',
    component: SettingsPage,
  },
  {
    path: '/login/',
    component: LoginPage,
  },
  {
    path: '/register/',
    component: RegisterPage,
  },
  {
    path: '/dynamic-route/blog/:blogId/post/:postId/',
    component: DynamicRoutePage,
  },
  {
    path: '/request-and-load/user/:userId/',
    async: function ({ router, to, resolve }) {
      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      var userId = to.params.userId;

      // Simulate Ajax Request
      setTimeout(function () {
        // We got user data from request
        var user = {
          firstName: 'Vladimir',
          lastName: 'Kharlampidi',
          about: 'Hello, i am creator of Framework7! Hope you like it!',
          links: [
            {
              title: 'Framework7 Website',
              url: 'http://framework7.io',
            },
            {
              title: 'Framework7 Forum',
              url: 'http://forum.framework7.io',
            },
          ]
        };
        // Hide Preloader
        app.preloader.hide();

        // Resolve route to load page
        resolve(
          {
            component: RequestAndLoad,
          },
          {
            props: {
              user: user,
            }
          }
        );
      }, 1000);
    },
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
  
];

export default routes;
