<template>
  <f7-app v-bind="f7params">

  <!-- Left panel with cover effect-->
  <f7-panel left cover dark>
    <f7-view>
      <f7-page>
        <f7-navbar title="Left Panel"></f7-navbar>
        <f7-block>Left panel content goes here</f7-block>
      </f7-page>
    </f7-view>
  </f7-panel>


  <!-- Right panel with reveal effect-->
  <f7-panel right reveal dark>
    <f7-view>
      <f7-page>
        <f7-navbar title="Right Panel"></f7-navbar>
        <f7-block>Right panel content goes here</f7-block>
      </f7-page>
    </f7-view>
  </f7-panel>


  <!-- Views/Tabs container -->
  <f7-views tabs class="safe-areas">
    <!-- Tabbar for switching views-tabs -->
  <f7-toolbar tabbar icons bottom v-if="userStore.user">
      <f7-link
        tab-link="#view-home"
        tab-link-active
        icon-ios="f7:house_fill"
        icon-md="material:home"
        text="Home"
        @click="navigateToHome">
      </f7-link>
      <f7-link tab-link="#view-catalog" icon-ios="f7:square_list_fill" icon-md="material:view_list" text="Catalog"></f7-link>
      <f7-link tab-link="#view-admin" icon-ios="f7:square_list_fill" icon-md="material:admin_panel_settings" text="Admin"></f7-link>
      <f7-link tab-link="#view-settings" icon-ios="f7:gear" icon-md="material:settings" text="Settings"></f7-link>
  </f7-toolbar>

    <!-- Your main view/tab, should have "view-main" class. It also has "tab-active" class -->
    <f7-view id="view-home" main tab tab-active url="/"></f7-view>

    <!-- Catalog View -->
    <f7-view id="view-catalog" name="catalog" tab url="/catalog/"></f7-view>

    <!-- Settings View -->
    <f7-view id="view-settings" name="settings" tab url="/settings/"></f7-view>

    <f7-view id="view-admin" name="admin" tab url="/admin/"></f7-view>

  </f7-views>


    <!-- Popup -->
    <f7-popup id="my-popup">
      <f7-view>
        <f7-page>
          <f7-navbar title="Popup">
            <f7-nav-right>
              <f7-link popup-close>Close</f7-link>
            </f7-nav-right>
          </f7-navbar>
          <f7-block>
            <p>Popup content goes here.</p>
          </f7-block>
        </f7-page>
      </f7-view>
    </f7-popup>

    <f7-login-screen id="my-login-screen">
      <f7-view>
        <f7-page login-screen>
          <f7-login-screen-title>Login</f7-login-screen-title>
          <f7-list form>
            <f7-list-input
              type="text"
              name="username"
              placeholder="Your username"
              v-model:value="username"
            ></f7-list-input>
            <f7-list-input
              type="password"
              name="password"
              placeholder="Your password"
              v-model:value="password"
            ></f7-list-input>
          </f7-list>
          <f7-list>
            <f7-list-button title="Sign In" @click="alertLoginData"></f7-list-button>
            <f7-block-footer>
              Some text about login information.<br>Click "Sign In" to close Login Screen
            </f7-block-footer>
          </f7-list>
        </f7-page>
      </f7-view>
    </f7-login-screen>
  </f7-app>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { f7, f7ready } from 'framework7-vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import store from '../js/store'
import routes from '../js/routes'
import { useUserStore } from '../js/user'

const auth = getAuth()
const userStore = useUserStore()

const f7params = {
  name: 'AtlantisGym',
  theme: 'md',
  store,
  routes,
  serviceWorker: process.env.NODE_ENV === 'production' ? {
    path: '/service-worker.js',
  } : {},
}

onMounted(() => {
  f7ready(() => {
    onAuthStateChanged(auth, (currentUser) => {
      userStore.setUser(currentUser)

      if (!currentUser) {
        f7.views.main.router.navigate('/login/')
      }
    })
  })
})
const navigateToHome = () => {
  f7.views.main.router.navigate('/');
};

</script>

