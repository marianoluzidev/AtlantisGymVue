
<template>
  <f7-page name="perfil" class="home">
    <!-- Top Navbar -->
    <f7-navbar title="Mi Perfil" back-link="Back" />

    <!-- Formulario de actualización -->
    <f7-block>
      <form @submit.prevent="updateUserData">
        <f7-list no-hairlines-md>
          <f7-list-input
            label="Nombre"
            type="text"
            v-model:value="formData.nombre"
            placeholder="Ingresa tu nombre"
            required
          ></f7-list-input>
          <f7-list-input
            label="Apellido"
            type="text"
            v-model:value="formData.apellido"
            placeholder="Ingresa tu apellido"
            required
          ></f7-list-input>
          <f7-list-input
            label="Peso"
            type="number"
            v-model:value="formData.peso"
            placeholder="Ingresa tu peso"
            required
          ></f7-list-input>
          <f7-list-input
            label="Altura"
            type="number"
            v-model:value="formData.altura"
            placeholder="Ingresa tu altura"
            required
          ></f7-list-input>
          <f7-list-input
            label="Objetivo"
            type="text"
            v-model:value="formData.objetivo"
            placeholder="Ingresa tu objetivo"
          ></f7-list-input>
          <f7-list-input
            label="Teléfono"
            type="text"
            v-model:value="formData.telefono"
            placeholder="Ingresa tu teléfono"
          ></f7-list-input>
          <f7-list-input
            label="Dirección"
            type="text"
            v-model:value="formData.direccion"
            placeholder="Ingresa tu dirección"
          ></f7-list-input>
          <f7-list-input
            label="Fecha de Nacimiento"
            type="date"
            v-model:value="formData.fechaNacimiento"
          ></f7-list-input>
        </f7-list>
        <f7-button fill type="submit">Guardar Cambios</f7-button>
      </form>
    </f7-block>
  </f7-page>
</template>

<script>
import { f7 } from 'framework7-vue';
import { useUserStore } from '../js/user'

import { ref } from 'vue';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export default {
  setup() {
    const userStore = useUserStore();
    const formData = ref({
      nombre: '',
      apellido: '',
      peso: null,
      altura: null,
      objetivo: '',
      telefono: '',
      direccion: '',
      fechaNacimiento: ''
    });

    // Cargar datos iniciales del usuario
    const loadUserData = () => {
      console.log('Cargando datos del usuario...');
      console.log('Usuario:', userStore.user);
      console.log('UID:', userStore.user?.uid);
      if (userStore.user) {
        const { nombre, apellido, peso, altura, objetivo, telefono, direccion, fechaNacimiento } = userStore.user;
        formData.value = {
          nombre: nombre || '',
          apellido: apellido || '',
          peso: peso || null,
          altura: altura || null,
          objetivo: objetivo || '',
          telefono: telefono || '',
          direccion: direccion || '',
          fechaNacimiento: fechaNacimiento || ''
        };
      }
    };

    // Cargar datos al montar el componente
    loadUserData();

    const updateUserData = async () => {
      try {
        const userId = userStore.user?.uid;
        if (!userId) throw new Error('Usuario no autenticado');

        const userDocRef = doc(db, 'usuario', userId);
        const updatedData = {
          nombre: formData.value.nombre,
          apellido: formData.value.apellido,
          peso: formData.value.peso,
          altura: formData.value.altura,
          objetivo: formData.value.objetivo,
          telefono: formData.value.telefono,
          direccion: formData.value.direccion,
          fechaNacimiento: formData.value.fechaNacimiento
        };

        await updateDoc(userDocRef, updatedData);
        
        // Actualizar los datos en userStore.user
        userStore.user = {
          ...userStore.user,
          ...updatedData
        };
        
        f7.dialog.alert('Datos actualizados correctamente');
      } catch (error) {
        console.error('Error al actualizar los datos:', error);
        f7.dialog.alert('Hubo un error al actualizar los datos');
      }
    };

    return { formData, updateUserData };
  }

}
</script>
