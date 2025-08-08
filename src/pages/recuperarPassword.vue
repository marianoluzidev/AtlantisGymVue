<template>
  <f7-page name="recuperar-password">
    <f7-navbar title="Recuperar Contraseña" back-link="Volver" />
    
    <div class="recuperar-container">
      <f7-block-title>Ingresá tu correo</f7-block-title>
      
      <f7-list inset>
        <f7-list-input
          label="Email"
          type="email"
          v-model:value="email"
          placeholder="ejemplo@email.com"
        />
      </f7-list>

      <f7-block>
        <f7-button fill @click="enviarLink" :disabled="loading">
          {{ loading ? 'Enviando...' : 'Enviar enlace' }}
        </f7-button>
      </f7-block>

      <f7-block v-if="mensaje" class="text-color-green">
        {{ mensaje }}
      </f7-block>
      <f7-block v-if="error" class="text-color-red">
        {{ error }}
      </f7-block>
    </div>
  </f7-page>
</template>

<script setup>
import { ref } from 'vue';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

const email = ref('');
const mensaje = ref('');
const error = ref('');
const loading = ref(false);

const enviarLink = async () => {
  mensaje.value = '';
  error.value = '';
  loading.value = true;

  try {
    const auth = getAuth();
    auth.languageCode = 'es'; // Esto forza español
    console.log('Enviando enlace de recuperación a:', email.value);
    await sendPasswordResetEmail(auth, email.value);
    mensaje.value = 'Revisá tu correo electrónico para restablecer tu contraseña.';
  } catch (err) {
    error.value = 'No se pudo enviar el correo. Verificá el email ingresado.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.recuperar-container {
  padding: 20px;
}
</style>
