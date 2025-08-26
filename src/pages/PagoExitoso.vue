<template>
  <f7-page name="pago-exitoso">
    <f7-navbar title="Pago exitoso" />
    <div class="p-4">
      <h2>¡Gracias por tu pago! 🎉</h2>
      <p>Estado: <b>{{ status }}</b></p>
      <p>Payment ID: <b>{{ payment_id }}</b></p>
      <p>Preference ID: <b>{{ preference_id }}</b></p>

      <f7-button class="mt-4" fill @click="$f7router.navigate('/home/')">Volver al inicio</f7-button>
    </div>
  </f7-page>
</template>

<script>
export default {
  data() {
    const q = this.$route.query || {};
    return {
      status: q.status || 'approved',
      payment_id: q.payment_id || '',
      preference_id: q.preference_id || ''
    };
  },
  mounted() {
// Validar el pago con el backend y actualizar Firestore
const API_BASE = "https://us-central1-TU_PROYECTO.cloudfunctions.net/mercadoPagoApi";
fetch(`${API_BASE}/confirm-payment?payment_id=${this.payment_id}`)
  .then(response => response.json())
  .then(async data => {
    if (data.success) {
      console.log("Pago validado exitosamente:", data);

      // Calcular fechas
      const fechaPago = new Date();
      const fechaVencimiento = new Date();
      fechaVencimiento.setDate(fechaPago.getDate() + 30);

      // Obtener usuario logueado
      const usuarioId = this.$f7.store.state.user?.uid;

      if (!usuarioId) {
        console.error("Usuario no logueado");
        return;
      }

      // Actualizar Firestore
      const db = this.$f7.store.state.db; // Asegúrate de que Firestore esté en el store
      const pagosRef = db.collection("pago");

      try {
        await pagosRef.add({
          fechaPago,
          fechaVencimiento,
          mesReferencia: `${fechaPago.getFullYear()}-${String(fechaPago.getMonth() + 1).padStart(2, "0")}`,
          monto: "28000",
          usuarioId
        });
        console.log("Pago registrado en Firestore");
      } catch (error) {
        console.error("Error al registrar el pago en Firestore:", error);
      }
    } else {
      console.error("Error al validar el pago:", data.message);
    }
  })
  .catch(error => {
    console.error("Error en la validación del pago:", error);
  });
  }
}
</script>
