<template>
    <f7-page class="home">
      <!-- Cartel de Cargando -->
      <div v-if="isLoading" class="loading-overlay">
        <p>Cargando...</p>
      </div>
      <f7-navbar title="Clientes" back-link="Back"></f7-navbar>
      <f7-list class="contacts-list strong-ios">
        <template v-for="(grupo, letra) in clientesAgrupados" :key="letra">
          <f7-list-group>
            <f7-list-item group-title>{{ letra }}</f7-list-item>
            <f7-list-item 
              v-for="cliente in grupo" 
              :key="cliente.id" 
              :link="'/clientedetalle/' + cliente.id">
              {{ cliente.apellido }}, {{ cliente.nombre }}
            </f7-list-item>
          </f7-list-group>
        </template>
      </f7-list>      
    </f7-page>
</template>

<script>
import { ref, onMounted } from 'vue';
import { doc, getDoc, collection, getDocs, where,orderBy,query } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export default {
  setup() {
    const clientes = ref([]);
    const clientesAgrupados = ref({});
    const isLoading = ref(true);

    const agruparPorLetra = (clientes) => {
      return clientes.reduce((grupos, cliente) => {
        const letra = cliente.apellido.charAt(0).toUpperCase();
        if (!grupos[letra]) {
          grupos[letra] = [];
        }
        grupos[letra].push(cliente);
        return grupos;
      }, {});
    };

    onMounted(async () => {      
      const usuariosRef = collection(db, 'usuario');
      const q = query(usuariosRef, orderBy('apellido'), orderBy('nombre'));

      try {
        const querySnapshot = await getDocs(q);
        const listaClientes = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        clientes.value = listaClientes;
        console.log('Lista de clientes:', listaClientes); // Verifica la lista de clientes
        clientesAgrupados.value = agruparPorLetra(listaClientes);
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
      } finally {
        isLoading.value = false;
      }
    });

    return {
      clientesAgrupados,
      isLoading,
    };
  },
};
</script>