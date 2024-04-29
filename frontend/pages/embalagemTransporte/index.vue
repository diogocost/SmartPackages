<template>
  <div class="input-group ms-2 d-flex justify-content-around" >
  <div class="row d-flex">
    <div class="col">
      <h1 class="d-flex justify-content-center">Embalagem Transporte</h1>
      <br>
      <form @submit.prevent="create" class="row">
        <div class="col">
          <div class="mb-3">
            <label for="inputTipoEmbalagem" class="form-label">Tipo de Embalagem</label>
            <input type="text" v-model="embalagemTransporte.tipo" class="form-control" id="inputTipoEmbalagem">
          </div>
          <div class="mb-3">
            <label for="inputFuncaoEmbalagem" class="form-label">Função da Embalagem</label>
            <input type="text" v-model="embalagemTransporte.funcao" class="form-control" id="inputFuncaoEmbalagem">
          </div>
          <div class="mb-3">
            <label for="inputMaterialEmbalagem" class="form-label">Material da Embalagem</label>
            <input type="text" v-model="embalagemTransporte.material" class="form-control" id="inputMaterialEmbalagem">
          </div>
          <div class="row">
            <div class="mb-3 col">
              <label for="inputPesoEmbalagem" class="form-label">Peso da Embalagem</label>
              <input type="Number" v-model="embalagemTransporte.peso" class="form-control" id="inputPesoEmbalagem">
            </div>
            <div class="mb-3 col">
              <label for="inputVolumeEmbalagem" class="form-label">Volume da Embalagem</label>
              <input type="Number" v-model="embalagemTransporte.volume" class="form-control" id="inputVolumeEmbalagem">
            </div>
          </div>
        </div>
      </form>
    </div>
    <div class="d-flex justify-content-center w-50 col">
      <div class="w-100">
        <div class="d-flex flex-row justify-content-center">
          <h1 class="d-flex justify-content-center">Sensores</h1>
          <button @click="addSensor" class="btn btn-success ms-5 mt-2 mb-2">Add Sensor</button>
        </div>
        <div v-for="(sensor, index) in embalagemTransporte.sensores" :key="sensor.id" class="d-flex flex-row mt-3 justify-content-center">
          <input type="number" v-model="sensor.id" class="form-control ms-2 mb-2 w-25 h-100" disabled>
          <select v-model="sensor.nome" class="form-control ms-2 mb-2 w-25 h-100">
            <option disabled value="">Tipo de sensor</option>
            <option value="Temperatura">Temperatura</option>
            <option value="Humidade">Humidade</option>
            <option value="Pressao">Pressão</option>
            <option value="GPS">GPS</option>
          </select>
          <button @click="removeSensor(sensor.id)" class="btn btn-danger ms-2 mb-2  h-100">X</button>
        </div>
      </div>
    </div>
      <div class="botao-atualizar d-flex justify-content-center">
        <button class="btn btn-primary mt-5" type="button" @click="updateEmbalagemTransporte">Atualizar Embalagem Transporte</button>
      </div>
    </div>
  </div>
  {{ message }}
</template>
<script setup>
import { useRouter } from 'vue-router'
import {computed, ref, onMounted} from 'vue';
import {useAuthStore} from "../../store/auth-store.js";

const router = useRouter()
const authStore = useAuthStore()
// Refs para os dados
const embalagemTransporte = ref({
  id: 0,
  tipo: '',
  funcao: '',
  material: '',
  peso: 0,
  volume: 0,
  sensores: []
});

const message = ref('')
// URL da API
const config = useRuntimeConfig();
const apiURL = config.public.API_URL;

// Função para buscar dados da embalagem de transporte
async function fetchEmbalagemTransporte() {
  try {
    const data = await authStore.fetchWithAuth(`${apiURL}/embalagemTransporte`);
    if (!data.sensores) {
      data.sensores = [];
    }
    console.log(data)
    embalagemTransporte.value = data;
  } catch (error) {
    console.error(error);
  }
}

async function updateEmbalagemTransporte() {
  try {
    const response = await authStore.fetchWithAuth(`${apiURL}/embalagemTransporte`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(embalagemTransporte.value),
    });
    console.log(response.status)
    await fetchEmbalagemTransporte()

  } catch (error) {
    console.error(error);
  }
}

function addSensor() {
  const newSensor = {
    id: 0 - embalagemTransporte.value.sensores.length - 1,
    nome: ''
  };
  embalagemTransporte.value.sensores.push(newSensor);
  console.log(embalagemTransporte.value)
}

function removeSensor(sensorId) {
  embalagemTransporte.value.sensores = embalagemTransporte.value.sensores.filter(r => r.id !== sensorId);
}

onMounted(fetchEmbalagemTransporte);

</script>