<template>
  <div class="container">
    <h2>Simulação de Sensores</h2>
    <table class="table">
      <thead>
      <tr>
        <th>Nome do Sensor</th>
        <th>ID Sensor</th>
        <th>ID Encomenda</th>
        <th>Último Valor</th>
        <th>Ações</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="sensor in sensores" :key="sensor.idSensor">
        <td>{{ sensor.nome }}</td>
        <td>{{ sensor.idSensor }}</td>
        <td>{{ sensor.idEncomenda }}</td>
        <td>{{ sensor.ultimoValor.tipo }} {{ sensor.ultimoValor.valor }} {{ sensor.ultimoValor.unidadeMedida }} - {{ sensor.ultimoValor.timestamp }}</td>
        <td>
          <button class="btn btn-success me-3" @click="abrirModal(sensor)">Adicionar Observação</button>
        </td>
      </tr>
      </tbody>
    </table>

    <!-- Modal para inserção de valores do sensor -->
    <div v-if="modalAberto" class="modal show" style="display: block">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Inserir Valor do Sensor {{ sensorAtual.nome }}</h5>
            <button type="button" class="close" @click="fecharModal">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body row">
            <div class="form-group col mt-4">
              <label for="valorObs">Valor:</label>
              <input type="number" id="valorObs" class="form-control" v-model="valorObs">
            </div>
            <div class="form-group col">
              <label for="unidadeObs">Unidade de Medida:</label>
              <input type="text" id="unidadeObs" class="form-control" v-model="unidadeObs">
            </div>
            <div class="form-group col">
              <label for="tipoObs">Tipo de Observacao:</label>
              <input type="text" id="tipoObs" class="form-control" v-model="tipoObs">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="fecharModal">Cancelar</button>
            <button type="button" class="btn btn-success me-3" @click="submeterValor">Submeter</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="modalAberto" class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';

const sensores = ref([]);


const modalAberto = ref(false);
const sensorAtual = ref({});
const valorObs = ref('');
const unidadeObs = ref('');;
const tipoObs = ref('');

const abrirModal = (sensor) => {
  sensorAtual.value = sensor;
  modalAberto.value = true;
};

const fecharModal = () => {
  modalAberto.value = false;
};

const fetchSensoresAtivos =  async () => {
  const { data, error } = await useFetch('/sensores/ativos');
  if (error.value) {
    console.error('Erro ao buscar sensores ativos:', error.value);
  } else {
    console.log(data.value)
    if(data.value){
      sensores.value = data.value.map(sensor => ({
        nome: sensor.nome,
        idSensor: sensor.id,
        idEncomenda: sensor.encomendaId,
        ultimoValor: sensor.ultimaObservação ? sensor.ultimaObservação.valor : null
      }));
    }
  }
}


const submeterValor = async () => {
  const sensorId = sensorAtual.value.idSensor;
  const observacao = {
    valor: valorObs.value,
    sensorId : sensorId,
    unidadeMedida : unidadeObs.value,
    tipo: tipoObs.value
  };

  const { data, error } = await useFetch(`/observacoes/${sensorId}`, {
    method: 'POST',
    body: observacao,
  });

  if (error.value) {
    console.error('Erro ao submeter observação:', error.value);
  } else {
    console.log('Observação submetida:', data.value);
    // Atualize a UI conforme necessário
  }
  fecharModal();
};

onMounted(fetchSensoresAtivos)
</script>

<style scoped>
/* Adicione estilos conforme necessário para combinar com as outras tabelas */
.table {
  /* Estilos da tabela */
}
.modal {
  /* Estilos do modal */
}
</style>
