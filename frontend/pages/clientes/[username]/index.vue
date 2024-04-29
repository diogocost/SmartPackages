<template>
  <div class="container">

    <div class="row">
      <div class="col">
        <h2>Produtos</h2>
        <table class="table">
          <thead>
            <tr>
              <th scope="col" >Nome</th>
              <th scope="col" >Marca</th>
              <th scope="col" >Preço</th>
              <th scope="col" >Quantidade</th>

              <th scope="col" >Adicionar</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="produto in products">
              <td class="pt-3">{{ produto.nome }}</td>
              <td class="pt-3">{{ produto.marca }}</td>
              <td class="pt-3">{{ produto.preco }} €</td>
              <td class="pt-3">{{ produto.quantidade }} {{ produto.medida }}</td>

              <td><button class="btn btn-success" @click="addProdutoToCarrinho(produto)" :disabled="isProductInCart(produto)"><i class="bi bi-plus-circle"></i></button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="col">
        <h2>Produtos no carrinho</h2>
        <table class="table">
          <thead>
          <tr>
            <th scope="col" >Nome</th>
            <th scope="col" >Marca</th>
            <th scope="col">Preço</th>
            <th scope="col" >Quantidade</th>

            <th scope="col">Unidades</th>
            <th scope="col">Remover</th>
          </tr>
          </thead>
          <tbody>
            <tr v-for="produto in productsCarrinho" :key="produto.id">
              <td class="pt-3">{{ produto.nome }}</td>
              <td class="pt-3">{{ produto.marca }}</td>
              <td class="pt-3">{{ produto.preco }} €</td>
              <td class="pt-3">{{ produto.quantidade }} {{ produto.medida }}</td>

              <td>
                <input class="form-check-input w-50" style="height: 2rem" type="number" v-model="produto.unidades" min="1">
              </td>
              <td><button class="btn btn-danger" @click="removeProdutoFromCarrinho(produto.id)"><i class="bi bi-x-circle"></i></button></td>
            </tr>
          </tbody>
        </table>
        <!-- Finalize order button with click event to show address modal -->
        <div class="align-self-end">
          <button class="btn btn-success me-3" @click="showAddressModal = true">Finalizar encomenda</button>
          <button class="btn btn-danger" @click="clearCarrinho">Limpar carrinho</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <div v-if="showAddressModal" class="modal show" style="display: block" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Endereço de Entrega</h5>
          <button type="button" class="close" @click="showAddressModal = false">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p>Por favor, insira o seu endereço de entrega:</p>
          <input type="text" class="form-control" v-model="enderecoEntrega" placeholder="Endereço">
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-success me-3" @click="finalizarEncomenda">Salvar endereço</button>
          <button type="button" class="btn btn-secondary" @click="showAddressModal = false">Cancelar</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Backdrop -->
  <div v-if="showAddressModal" class="modal-backdrop fade show"></div>

</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '~/store/auth-store.js';

const authStore = useAuthStore();
const config = useRuntimeConfig();
const api = config.public.API_URL;
//const {data: products, error, refresh} = await useFetch(`${api}/products`)
// Reactive data for the modal and address
// Reactive state for modal visibility and address
const showAddressModal = ref(false);
const enderecoEntrega = ref('');

const encomendas = ref([]);





// Function to clear the cart
const clearCarrinho = () => {
  productsCarrinho.value = [];
  enderecoEntrega.value = ''; // Also clear the address field
};

const products = ref([]);
const productsCarrinho = ref([]);

function addProdutoToCarrinho(produto) {
  const existingProduct = productsCarrinho.value.find(p => p.id === produto.id);
  if (!existingProduct) {
    produto.unidades = 1; // inicializa a propriedade unidades
    productsCarrinho.value.push({...produto});
    console.log(productsCarrinho.value); // Adicione este log para verificar a estrutura
  }
}


function removeProdutoFromCarrinho(productId) {
  productsCarrinho.value = productsCarrinho.value.filter(p => p.id !== productId);
}


function isProductInCart(produto) {
  return productsCarrinho.value.some(p => p.id === produto.id);
}

const fetchProducts = async () => {
  try {
    const response = await authStore.fetchWithAuth(`${api}/produtos`);
    products.value = response; // Atualize os produtos com a resposta da API
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
  }
};

const finalizarEncomenda = async () => {
  // Validate the delivery address
  if (enderecoEntrega.value.trim() === '') {
    alert('Por favor, insira um endereço válido.');
    return;
  }


  // Construct the order payload
  const encomendaPayload = {
    clienteUsername: authStore.username,
    morada: enderecoEntrega.value,
    estado: 'Pendente', // Assuming 'Pendente' is a valid estado for a new encomenda
    armazem: 'Leiria', // Replace with actual armazem or retrieve from user selection if applicable
    // Since there's no direct data about EmbalagemTransporte these are placeholders
    embalagemTransporteId: 1, // Placeholder for embalagemTransporteId
    encomendaProdutoDTOs: productsCarrinho.value.map(p => ({
      produtoId: p.id,
      quantidade: p.unidades
    })),

  };

  try {
    // Make the POST request to create the new encomenda
    const response = await authStore.fetchWithAuth(`${api}/encomendas`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`, // Include the token here
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(encomendaPayload)
    });

    // Handle the response from the POST request
    console.log('Encomenda created:', response);
    alert('Encomenda criada com sucesso!');

    // Reset the cart and close the modal
    productsCarrinho.value = [];
    enderecoEntrega.value = '';
    showAddressModal.value = false;
    clearCarrinho();
  } catch (error) {
    console.error('Error creating encomenda:', error);
    alert('Ocorreu um erro ao criar a encomenda. Por favor, tente novamente.');
  }
};


onMounted(fetchProducts);
</script>

<style>
/* Additional styles for modal */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1040;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  opacity: 0.5;
}
</style>