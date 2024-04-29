<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <h2>Entregas Realizadas pelo Operador: username</h2>
        <table class="table">
          <thead>
          <tr>
            <th scope="col">Id da Entrega</th>
            <th scope="col">Total</th>
            <th scope="col">Estado</th>
            <th scope="col">Armazem de saida</th>
            <th scope="col">Data de Entrega</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="entrega in entregas" :key="entrega.id">
            <td class="pt-3">{{ entrega.id }}</td>
            <td class="pt-3">{{ entrega.total }} €</td>
            <td class="pt-3">{{ entrega.estado }}</td>
            <td class="pt-3">{{ entrega.armazem_saida }}</td>
            <td class="pt-3">{{ entrega.data_de_entrega }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Static data for the operator's completed deliveries
const entregas = ref([
  {
    id: 1,
    total: '150.00',
    estado: 'Entregue',
    armazem_saida: 'Armazém Central',
    data_de_entrega: '2023-01-15'
  },
  {
    id: 2,
    total: '200.00',
    estado: 'Entregue',
    armazem_saida: 'Armazém Secundário',
    data_de_entrega: '2023-01-18'
  },
  {
    id: 3,
    total: '420.00',
    estado: 'Entregue',
    armazem_saida: 'Armazém Secundário',
    data_de_entrega: '2023-01-17'
  },
  // ... more static deliveries
]);

</script>

<style scoped>
/* Add any styles you need for this page */
</style>
