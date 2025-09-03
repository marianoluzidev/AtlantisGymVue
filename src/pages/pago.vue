<template>
  <f7-page name="pago">
    <f7-navbar title="Pago con MercadoPago" />
    <div class="p-4">
      <f7-button fill large :disabled="loading" @click="crearCheckout">
        {{ loading ? "Creando..." : "Pagar Cuota mensual" }}
      </f7-button>

      <!-- Aquí se renderiza el botón de MercadoPago -->
      <div id="wallet_container" class="mt-4"></div>
    </div>
  </f7-page>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      API_BASE: "https://us-central1-atlantisgymvue.cloudfunctions.net/mercadoPagoApi",
      PUBLIC_KEY: "APP_USR-9df92d2e-bb77-489c-beed-dc55e3216758" // ⚠️ tu PUBLIC_KEY de prueba
    };
  },
  methods: {
    async crearCheckout() {
      try {
        this.loading = true;

        // 1. Pedir preferencia al backend
        const resp = await fetch(`${this.API_BASE}/create-preference`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: "Membresía Atlantis Gym",
            unit_price: 100,
            quantity: 1
          })
        });
        const { id } = await resp.json();
        if (!id) throw new Error("No se recibió preferencia");

        // 2. Inicializar MP
        const mp = new window.MercadoPago(this.PUBLIC_KEY, { locale: "es-AR" });

        // limpiar render anterior
        const container = document.querySelector("#wallet_container");
        container.innerHTML = "";

        // 3. Renderizar botón Checkout
        mp.checkout({
          preference: { id },
          render: {
            container: "#wallet_container",
            label: "Pagar con Mercado Pago"
          }
        });
      } catch (err) {
        console.error("Error creando checkout:", err);
        this.$f7.dialog.alert("Error al iniciar el pago, probá de nuevo.");
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
