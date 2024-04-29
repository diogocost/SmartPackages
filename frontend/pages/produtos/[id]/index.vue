<template>
  <div class="input-group ms-2 d-flex justify-content-around" >
    <div>
      <h1 class="d-flex justify-content-center">Produto #{{ $route.params.id }}</h1>
      <br>
      <form @submit.prevent="create" class="row">
        <div class="col">
          <div class="row">
            <div class="mb-3 col">
              <label for="inputNome" class="form-label">Nome</label>
              <input type="text" v-model="produto.nome" class="form-control" id="inputNome" :readonly="!authStore.isFornecedor">
            </div>
            <div class="mb-3 col">
              <label for="inputMarca" class="form-label">Marca</label>
              <input type="text" v-model="produto.marca" class="form-control" id="inputMarca" :readonly="!authStore.isFornecedor">
            </div>
          </div>
          <div class="row">
            <div class="mb-3 col">
              <label for="inputPreco" class="form-label">Preço</label>
              <input type="text" v-model="produto.preco" class="form-control" id="inputPreco" :readonly="!authStore.isFornecedor">
            </div>
            <div class="mb-3 col">
              <label for="inputTipo" class="form-label">Tipo</label>
              <input type="text" v-model="produto.tipo" class="form-control" id="inputTipo" :readonly="!authStore.isFornecedor">
            </div>
          </div>
          <div class="row">
            <div class="mb-3 col">
              <label for="inputQuantidade" class="form-label">Quantidade</label>
              <input type="number" v-model="produto.quantidade" class="form-control" id="inputQuantidade" :readonly="!authStore.isFornecedor">
            </div>
            <div class="mb-3 col">
              <label for="inputUnidadeDeMedida" class="form-label">Unidade de medida</label>
              <input type="text" v-model="produto.unidadeMedida" class="form-control" id="inputUnidadeDeMedida" :readonly="!authStore.isFornecedor">
            </div>
          </div>
          <div class="mb-3">
            <label for="inputConteudo" class="form-label">Descricao</label>
            <textarea rows="3" type="text" v-model="produto.descricao" class="form-control" id="inputConteudo" :readonly="!authStore.isFornecedor"></textarea>
          </div>
          <div class="d-flex justify-content-around">
            <button class="btn btn-secondary me-2 col-4" type="reset" @click="router.back()">Back</button>
          </div>
        </div>
        <div class="col" v-if="authStore.isFornecedor">
          <div class="mb-3">
            <label for="inputTipoEmbalagem" class="form-label">Tipo de Embalagem</label>
            <input type="text" v-model="embalagemPrototipo.tipo" class="form-control" id="inputTipoEmbalagem" >
          </div>
          <div class="mb-3">
            <label for="inputFuncaoEmbalagem" class="form-label">Função da Embalagem</label>
            <input type="text" v-model="embalagemPrototipo.funcao" class="form-control" id="inputFuncaoEmbalagem">
          </div>
          <div class="mb-3">
            <label for="inputMaterialEmbalagem" class="form-label">Material da Embalagem</label>
            <input type="text" v-model="embalagemPrototipo.material" class="form-control" id="inputMaterialEmbalagem">
          </div>
          <div class="mb-3">
            <label for="inputPesoEmbalagem" class="form-label">Peso da Embalagem</label>
            <input type="Number" v-model="embalagemPrototipo.peso" class="form-control" id="inputPesoEmbalagem">
          </div>
          <div class="mb-3">
            <label for="inputVolumeEmbalagem" class="form-label">Volume da Embalagem</label>
            <input type="Number" v-model="embalagemPrototipo.volume" class="form-control" id="inputVolumeEmbalagem">
          </div>
          <div class="d-flex justify-content-around" v-if="authStore.isFornecedor">
            <button class="btn btn-primary col-4 mt-5" type="submit" @click="updateProduto(produto.id)">Atualizar</button>
          </div>
        </div>
      </form>
    </div>
    <div class="d-flex justify-content-end w-50" v-if="authStore.isFornecedor">
      <div>
        <div class="d-flex flex-row justify-content-end">
          <h1 class="d-flex justify-content-center">Regras Produto #{{ $route.params.id }}</h1>
          <button @click="addRegra" class="btn btn-success ms-5 mt-2 mb-2">Add Regra</button>
        </div>
        <div v-for="(regra, index) in regras" :key="regra.id" class="d-flex flex-row mt-3 align-content-end">
          <input type="number" v-model="regra.id" class="form-control ms-2 mb-2 w-25 h-100" disabled>
          <input type="number" v-model="regra.valor" class="form-control ms-2 mb-2 w-25  h-100" placeholder="Valor">
          <input type="text" v-model="regra.comparador" class="form-control ms-2 mb-2 w-50  h-100" placeholder="Comparador">
          <textarea type="text" v-model="regra.mensagem" class="form-control ms-2 mb-2 w-50" placeholder="Mensagem" rows="1"></textarea>
          <select v-model="regra.tipoSensor" class="form-control ms-2 mb-2 w-25 h-100">
            <option disabled value="">Tipo de sensor</option>
            <option value="Temperatura">Temperatura</option>
            <option value="Humidade">Humidade</option>
            <option value="Pressao">Pressão</option>
            <option value="GPS">GPS</option>
          </select>
          <button @click="removeRegra(regra.id)" class="btn btn-danger ms-2 mb-2  h-100"><i class="bi bi-x-circle"></i></button>
        </div>
      </div>
    </div>
  </div>
    <div class="col mt-5" v-if="authStore.isFornecedor">
      <h2>Sensores</h2>
      <br>
      <table class="table">
        <thead>
        <tr>
          <th scope="col">Sensor</th>
          <th scope="col">Data</th>
          <th scope="col">Valor</th>
          <th scope="col">Estado</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="obs in observacoes">
          <td class="pt-3">{{ obs.sensor }}</td>
          <td class="pt-3">{{ obs.timestamp }}</td>
          <td class="pt-3">{{ obs.valor }} {{ obs.unidade }}</td>
          <td class="pt-3"><button class="btn" :class="estadoClass(obs.estado)" @click="">{{ obs.estado }}</button></td>
        </tr>
        </tbody>
      </table>
    </div>
  {{ message }}
</template>
<script setup>
import { useRouter ,useRoute} from 'vue-router'
import {computed, onMounted, ref} from 'vue';
import {useAuthStore} from "../../../store/auth-store.js";

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const produto = ref([])
const regras = ref([]);
const id = ref(0);
const embalagemPrototipo = ref([])
const observacoes = ref([]);

const message = ref('')
const config = useRuntimeConfig();
const apiURL = config.public.API_URL;

function addRegra() {
  const newRegra = {
    id: 0 - regras.value.length - 1,
    valor: 0,
    comparador: '',
    mensagem: '',
    tipoSensor: ''
  };
  regras.value.push(newRegra);
}

function removeRegra(regraId) {
  regras.value = regras.value.filter(r => r.id !== regraId);
}

function estadoClass(estado) {
  switch (estado){
    case "OK":
        return "btn-success disabled"
    default:
        return "btn-danger disabled"
  }
}

async function fetchProduto() {
  try {
    const data = await authStore.fetchWithAuth(`${apiURL}/produtos/${route.params.id}`);
    console.log(data)
    produto.value = data;
    regras.value = data.regras;
    const dataEP = await authStore.fetchWithAuth(`${apiURL}/embalagensProduto/${produto.value.embalagemProdutoId}`);
    embalagemPrototipo.value = dataEP;
  } catch (error) {
    console.error(error);
  }
}
async function updateProduto(id) {
  try {
    console.log(JSON.stringify({
      produto: produto.value,
      embalagemProduto: embalagemPrototipo.value,
      regras: regras.value
    }))
    const response = await authStore.fetchWithAuth(`${apiURL}/produtos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        produto: produto.value,
        embalagemProduto: embalagemPrototipo.value,
        regras: regras.value
      })
    });

    fetchProduto()
  } catch (error) {
    console.error(error);
  }
}

onMounted(fetchProduto)

</script>