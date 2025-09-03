<template>
  <f7-page name="pago-pendiente">
    <f7-navbar title="Pago pendiente" />
    <div class="p-4">
      <h2>Tu pago está pendiente ⏳</h2>
      <p>Estado: <b>{{ status }}</b></p>
      <p>Payment ID: <b>{{ payment_id }}</b></p>

      <f7-button class="mt-4" fill @click="$f7router.navigate('/home/')">Volver al inicio</f7-button>
    </div>
  </f7-page>
</template>

<script>
export default {
  data() {
    const q = this.$route.query || {};
    return {
      status: q.status || 'pending',
      payment_id: q.payment_id || ''
    };
  }
}
</script>
