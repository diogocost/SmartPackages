<template>
  <div class="input-group ms-2 d-flex justify-content-around" >
    <div>
      <h1 class="d-flex justify-content-center">Novo Produto</h1>
      <br>
      <form @submit.prevent="create" class="row">
        <div class="col">
          <div class="row">
            <div class="mb-3 col">
              <label for="inputNome" class="form-label">Nome</label>
              <input type="text" v-model="produto.nome" class="form-control" id="inputNome">
            </div>
            <div class="mb-3 col">
              <label for="inputMarca" class="form-label">Marca</label>
              <input type="text" v-model="produto.marca" class="form-control" id="inputMarca">
            </div>
          </div>
          <div class="row">
            <div class="mb-3 col">
              <label for="inputPreco" class="form-label">Preço</label>
              <input type="text" v-model="produto.preco" class="form-control" id="inputPreco">
            </div>
            <div class="mb-3 col">
              <label for="inputTipo" class="form-label">Tipo</label>
              <input type="text" v-model="produto.tipo" class="form-control" id="inputTipo">
            </div>
          </div>
          <div class="row">
            <div class="mb-3 col">
              <label for="inputQuantidade" class="form-label">Quantidade</label>
              <input type="number" v-model="produto.quantidade" class="form-control" id="inputQuantidade">
            </div>
            <div class="mb-3 col">
              <label for="inputUnidadeDeMedida" class="form-label">Unidade de medida</label>
              <input type="text" v-model="produto.unidadeMedida" class="form-control" id="inputUnidadeDeMedida">
            </div>
          </div>
          <div class="mb-3">
            <label for="inputConteudo" class="form-label">Descricao</label>
            <textarea rows="3" type="text" v-model="produto.descricao" class="form-control" id="inputConteudo"></textarea>
          </div>
          <div class="d-flex justify-content-around">
            <button class="btn btn-secondary me-2 col-4" type="reset">Back</button>
          </div>
        </div>
        <div class="col">
            <div class="mb-3">
              <label for="inputTipoEmbalagem" class="form-label">Tipo de Embalagem</label>
              <input type="text" v-model="embalagemPrototipo.tipo" class="form-control" id="inputTipoEmbalagem">
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
          <div class="d-flex justify-content-around">
            <button class="btn btn-primary col-4 mt-5" type="submit">Criar</button>
          </div>
        </div>
      </form>
    </div>
    <div class="d-flex justify-content-end w-50">
      <div>
        <div class="d-flex flex-row justify-content-end">
          <h1 class="d-flex justify-content-center">Regras Novo Produto</h1>
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
  {{ message }}
</template>
<script setup>
import { useRouter } from 'vue-router'
import {computed, ref} from 'vue';
import {useAuthStore} from "../../store/auth-store.js";

const router = useRouter()
const authStore = useAuthStore()

const produto = ref({
  id: 0,
  nome: '',
  marca: '',
  preco: '',
  tipo: '',
  quantidade: "",
  unidadeMedida:"",
  descricao: "",
  regras: []
})
const embalagemPrototipo = ref({
  tipo: '',
  funcao: '',
  material: '',
  peso: 0,
  volume: 0
})
const regras = ref([]);
const id = ref(0);
const message = ref('')
const config = useRuntimeConfig()
const api = config.public.API_URL

function addRegra() {
  const newRegra = {
    id: id.value,
    valor: 0,
    comparador: '',
    mensagem: '',
    tipoSensor: ''
  };
  id.value += 1;
  regras.value.push(newRegra);
}

function removeRegra(regraId) {
  regras.value = regras.value.filter(r => r.id !== regraId);
}

async function create() {
  try {
    console.log(JSON.stringify({
      produto: produto.value,
      embalagemProduto: embalagemPrototipo.value,
      regras: regras.value
    }))
    const response = await authStore.fetchWithAuth(`${api}/produtos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        produto: produto.value,
        embalagemProduto: embalagemPrototipo.value,
        regras: regras.value
      })
    });

    router.back();
  } catch (e) {
    message.value = "Erro ao criar o produto: " + e.message;
  }
}


</script>