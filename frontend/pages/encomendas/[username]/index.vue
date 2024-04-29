
<template>
  <div class="container">
    <div v-if="userType === 'Operador'||userType === 'Cliente'" class="row">
      <div class="col">
        <h2>Minhas encomendas</h2>
        <table class="table">
          <thead>
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Total</th>
            <th scope="col">Estado</th>
            <th scope="col">Armazem de saida</th>
            <th scope="col">Data de Entrega</th>
            <th scope="col">Informaçao Adicional</th>
            <th scope="col">Ação</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="encomenda in encomendas" :key="encomenda.id">
            <td class="pt-3">{{ encomenda.id }}</td>
            <td class="pt-3">{{ encomenda.total }} €</td>
            <td class="pt-3">
              <button class="btn" :class="estadoClass(encomenda.estado)">
                {{ encomenda.estado }}
              </button>
            </td>
            <td class="pt-3">{{ encomenda.armazem }}</td>
            <td class="pt-3">{{ getData(encomenda.dataEntrega) }}</td>
            <td class="align-content-center">
              <!-- Navigate to the static _id.vue page -->
              <nuxt-link to="/encomendas/$(encomenda.id)" class="btn btn-secondary">
                <i class="bi bi-list-columns-reverse"></i>
              </nuxt-link>
            </td>
            <td>
              <button v-if="encomenda.estado === 'Em curso'" class="btn btn-success" @click="marcarComoEntregue(encomenda)">
                Marcar como Entregue
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div class="container" v-if="authStore.isOperador">
    <div class="row">
      <div class="col">
        <h2>Entregas Realizadas pelo Operador: {{authStore.user.nome}}</h2>
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
            <td class="pt-3">{{ entrega.armazem }}</td>
            <td class="pt-3">{{ getData(entrega.dataEntrega) }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <!-- Seção para o operador manipular encomendas pendentes -->
  <div class="container mt-4" v-if="authStore.isOperador">
    <div class="row">
      <div class="col">
        <h2>Encomendas Pendentes</h2>
        <table class="table">
          <thead>
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Total</th>
            <th scope="col">Armazem de saída</th>
            <th scope="col">Data de Entrega</th>
            <th scope="col">Ações</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="encomenda in encomendasPendentes" :key="encomenda.id">
            <td>{{ encomenda.id }}</td>
            <td>{{ encomenda.total }} €</td>
            <td>{{ encomenda.armazem }}</td>
            <td>{{ getData(encomenda.dataEntrega) }}</td>
            <td>
              <button v-if="encomenda.estado !== 'Em curso'" class="btn btn-primary" @click="showDateModal = true">
                Marcar como Em curso
              </button>
            </td>
            <!-- Modal -->
            <div v-if="showDateModal" class="modal show" style="display: block" role="dialog">
              <div class="modal-dialog" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title">Data Prevista Para Entrega</h5>
                    <button type="button" class="close" @click="showDateModal = false">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                    <p>Por favor, insira a data prevista para entrega:</p>
                    <input type="date" class="form-control" v-model="dataPrevistaEntrega" placeholder="Endereço">
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-success me-3"  @click="marcarComoEmCurso(encomenda)">Salvar endereço</button>
                    <button type="button" class="btn btn-secondary" @click="showDateModal = false">Cancelar</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Modal Backdrop -->
            <div v-if="showDateModal" class="modal-backdrop fade show"></div>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  
</template>
<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '~/store/auth-store.js';

const config = useRuntimeConfig()
const api = config.public.API_URL
const authStore = useAuthStore()

const { user } = storeToRefs(authStore);

const userType = computed(() => user.value?.tipo);
const username = computed(() => user.value?.username);

const showDateModal = ref(false);
const dataPrevistaEntrega = ref('');

const encomendas = ref()
const encomendasPendentes = ref()
const entregas = ref()
const encomendaFormData = ref({
  id: 0,
  operadorUsername: "",
  clienteUsername: "",
  morada: "",
  estado: "",
  dataEntrega: 0,
  armazem: "",
  encomendaProdutoDTOs: [],
  embalagemTransporteId: 0,
  sensoreDTOs: []
})

onMounted(() =>{
  start()
})


// Função para buscar as encomendas do cliente
const fetchEncomendasCliente = async () => {
  try {
    const response = await authStore.fetchWithAuth(`${api}/encomendas/cliente/${authStore.username}`);
    encomendas.value = response.data; // Supondo que a resposta da API tenha um campo data
  } catch (error) {
    console.error('Erro ao buscar encomendas do cliente:', error);
  }
};

async function start() {
  if(authStore.isCliente){
  const {data: dataEncomendaCliente, error: encomendaClienteError} = await useFetch(`${api}/encomendas/cliente/${authStore.user.username}`, {
  method: 'get',
  headers: {
    'Accept': 'application/json',
    'Authorization': 'Bearer ' + authStore.token
  }
  })
  encomendas.value = dataEncomendaCliente.value
} else {
  const {data: dataEncomendaOperador, error: encomendaOperadorError} = await useFetch(`${api}/encomendas/operador/${authStore.user.username}`, {
  method: 'get',
  headers: {
    'Accept': 'application/json',
    'Authorization': 'Bearer ' + authStore.token
  }
  })
  encomendas.value = dataEncomendaOperador.value
}

if(authStore.isOperador){
  const {data: dataEncomendaOperadorEntreges, error: encomendaEncomendaOperadorEntregesError} = await useFetch(`${api}/encomendas/operador/${authStore.user.username}/entregas`, {
  method: 'get',
  headers: {
    'Accept': 'application/json',
    'Authorization': 'Bearer ' + authStore.token
  }
  })
  entregas.value = dataEncomendaOperadorEntreges.value

  const {data: dataEncomendaNaoAtribuidas, error: encomendaEncomendaNaoAtribuidasError} = await useFetch(`${api}/encomendas/naoAtribuidas`, {
  method: 'get',
  headers: {
    'Accept': 'application/json',
    'Authorization': 'Bearer ' + authStore.token
  }
  })
  encomendasPendentes.value = dataEncomendaNaoAtribuidas.value

}
}

// Função para converter da data
const getData = (dateInMilliseconds) => {
  const date = new Date(dateInMilliseconds);
  const day = date.getDate();
  const month = date.getMonth() + 1; // Note: Months are zero-based, so add 1
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// Função para marcar uma encomenda como "Em curso"
async function marcarComoEmCurso(encomenda) {
  if (dataPrevistaEntrega.value.trim() === '') {
    alert('Por favor, insira uma data.');
    return;
  }
  showDateModal.value = false

  encomendaFormData.value.id = encomenda.id
  encomendaFormData.value.operadorUsername = authStore.user.username
  encomendaFormData.value.clienteUsername = encomenda.clienteUsername
  encomendaFormData.value.morada = encomenda.morada
  encomendaFormData.value.estado = 'Em curso'
  encomendaFormData.value.dataEntrega = dataPrevistaEntrega.value
  encomendaFormData.value.armazem = encomenda.armazem
  encomendaFormData.value.encomendaProdutoDTOs = encomenda.encomendaProdutoDTOs
  encomendaFormData.value.embalagemTransporteId = encomenda.embalagemTransporteId
  encomendaFormData.value.sensoreDTOs = encomenda.sensoreDTOs
  await useFetch(`${api}/encomendas/${encomenda.id}`, {
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + authStore.token
    },
    body: encomendaFormData.value
  })
  start()
  dataPrevistaEntrega.value = null
};

// Função para marcar uma encomenda como "Entregue"
async function marcarComoEntregue(encomenda) {
  encomendaFormData.value.id = encomenda.id
  encomendaFormData.value.operadorUsername = encomenda.operadorUsername
  encomendaFormData.value.clienteUsername = encomenda.clienteUsername
  encomendaFormData.value.morada = encomenda.morada
  encomendaFormData.value.estado = "Entregue"
  encomendaFormData.value.dataEntrega = encomenda.dataEntrega
  encomendaFormData.value.armazem = encomenda.armazem
  encomendaFormData.value.encomendaProdutoDTOs = encomenda.encomendaProdutoDTOs
  encomendaFormData.value.embalagemTransporteId = encomenda.embalagemTransporteId
  encomendaFormData.value.sensoreDTOs = encomenda.sensoreDTOs
  await useFetch(`${api}/encomendas/${encomenda.id}`, {
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + authStore.token
    },
    body: encomendaFormData.value
  })
  start()
};


// Function to determine the class based on the order status
const estadoClass = (estado) => {
  switch (estado) {
    case 'Entregue':
      return 'btn-success';
    case 'Cancelado':
      return 'btn-danger';
    default:
      return 'btn-warning';
  }
};


onMounted(fetchEncomendasCliente);
</script>

<style scoped>
/* Styles corresponding to order statuses */
.estado-entregue {
  background-color: green;
}

.estado-cancelado {
  background-color: red;
}

.estado-other {
  background-color: yellow;
}
</style>
