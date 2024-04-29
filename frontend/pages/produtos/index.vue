<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <div class="row">
          <h2 class="col align-self-start">Produtos</h2>
          <button class="btn btn-success col-2 align-self-end" @click="navigateToCreatePage">
            Criar Produto
            <i class="bi bi-plus-circle"></i>
          </button>
        </div>
        <table class="table">
          <thead>
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Nome</th>
            <th scope="col">Marca</th>
            <th scope="col">Preço</th>
            <th scope="col">Consumo</th>
            <th scope="col">Mais Opções</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="produto in products" :key="produto.id">
            <td class="pt-3">{{ produto.id }}</td>
            <td class="pt-3">{{ produto.nome }}</td>
            <td class="pt-3">{{ produto.marca }}</td>
            <td class="pt-3">{{ produto.preco }} €</td>
            <td class="pt-3">{{ produto.quantidade }} {{ produto.unidadeMedida }}</td>
            <td>
              <button class="btn btn-secondary me-2" @click="verDetalhes(produto.id)">+info</button>
              <button class="btn btn-danger" @click="removerProduto(produto.id)">Delete</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import { useRouter } from 'vue-router';
import {useAuthStore} from "../../store/auth-store.js";

const products = ref([]);

const router = useRouter();
const authStore = useAuthStore();
const config = useRuntimeConfig();
const apiURL = config.public.API_URL;

const navigateToCreatePage = () => {
  router.push('/produtos/create');
};

const verDetalhes = (id) => {
  router.push(`/produtos/${id}`)
};

const removerProduto = async (id) => {
  try {
    const data = await authStore.fetchWithAuth(`${apiURL}/produtos/${id}`,{method: 'DELETE'});
    await fetchProdutos();
  } catch (error) {
    console.error(error);
  }
};


// Função para buscar dados da embalagem de transporte
async function fetchProdutos() {
  try {
    const data = await authStore.fetchWithAuth(`${apiURL}/produtos`);
    console.log(data);
    products.value = data;
  } catch (error) {
    console.error(error);
  }
}

onMounted(fetchProdutos)
</script>
