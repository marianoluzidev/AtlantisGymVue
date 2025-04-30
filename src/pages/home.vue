<template>
  <f7-page name="home">
    <!-- Top Navbar -->
    <f7-navbar>
      <f7-nav-title class="text-yellow-400">Atlantis Gym</f7-nav-title>
    </f7-navbar>


    <!-- Page content-->
    <f7-block>      
      
      <div class="text-5xl font-bold text-yellow-400">
        Bienvenido, Mariano
      </div>
    </f7-block>

    <f7-block-title>Navigation</f7-block-title>
    <f7-list class="fondo-amarillo"  inset dividersIos>
      <f7-list-item link="/about/" title="About"></f7-list-item>
      <f7-list-item link="/form/" title="Form"></f7-list-item>
    </f7-list>

    <f7-block-title>Modals</f7-block-title>
    <f7-block class="grid grid-cols-2 grid-gap">
      <f7-button fill class="btn-negro-sobre-amarillo" popup-open="#my-popup">Popup</f7-button>
      <f7-button fill class="btn-negro-sobre-amarillo" login-screen-open="#my-login-screen">Login Screen</f7-button>
    </f7-block>

    <f7-block-title>Panels</f7-block-title>
    <f7-block class="grid grid-cols-2 grid-gap">
      <f7-button fill class="btn-negro-sobre-amarillo" panel-open="left">Left Panel</f7-button>
      <f7-button fill class="btn-negro-sobre-amarillo" panel-open="right">Right Panel</f7-button>
    </f7-block>

    <f7-list strong inset dividersIos>
      <f7-list-item
        title="Dynamic (Component) Route"
        link="/dynamic-route/blog/45/post/125/?foo=bar#about"
      ></f7-list-item>
      <f7-list-item
        title="Default Route (404)"
        link="/load-something-that-doesnt-exist/"
      ></f7-list-item>
      <f7-list-item
        title="Request Data & Load"
        link="/request-and-load/user/123456/"
      ></f7-list-item>
    </f7-list>
  </f7-page>
</template>

<script>
import { db } from '../js/firebase';
import { getFirestore,collection, getDocs } from "firebase/firestore";


export default {
  async mounted() {
    
    const clientesCol = collection(db, "usuario");
    const clientesSnapshot = await getDocs(clientesCol);
    const clientesList = clientesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log(clientesList);
  }
}
</script>
