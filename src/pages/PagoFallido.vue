<template>
  <f7-page name="pago-fallido">
    <f7-navbar title="Pago fallido" />
    <div class="p-4">
      <h2>Tu pago no pudo completarse 😕</h2>
      <p>Estado: <b>{{ status }}</b></p>
      <p>Payment ID: <b>{{ payment_id }}</b></p>

      <f7-button class="mt-4" fill @click="$f7router.navigate('/pago/')">Reintentar pago</f7-button>
      <f7-button class="mt-2" outline @click="$f7router.back()">Volver</f7-button>
    </div>
  </f7-page>
</template>

<script>
export default {
  data() {
    const q = this.$route.query || {};
    return {
      status: q.status || 'rejected',
      payment_id: q.payment_id || ''
    };
  }
}
</script>
