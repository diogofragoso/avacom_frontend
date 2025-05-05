import axios from 'axios';
const API_BASE_URL = 'http://localhost:3000/api/atividadeavaliativa';
const API_INSERIR = `${API_BASE_URL}/inseriravaliativa`;
const API_LISTAR = `${API_BASE_URL}`;
const API_DELETAR = (id) => `${API_BASE_URL}/deletaravaliativa/${id}`;
const API_EDITAR = (id) => `${API_BASE_URL}/editaravaliativa/${id}`;

const avaliativaService = {
  createAvaliativa: async (data) => {
    try {
      const response = await axios.post(API_INSERIR, data, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        // O erro foi respondido pelo servidor
        throw new Error(`Erro ao criar atividade avaliativa: ${error.response.status} - ${error.response.data.message}`);
      } else {
        // O erro ocorreu antes de chegar ao servidor
        throw new Error('Erro ao criar atividade avaliativa: ' + error.message);
      }
    }
  },
  

  getAvaliativasPorIndicador: async (id_indicador) => {
    try {
        const response = await axios.get(`${API_LISTAR}/${id_indicador}`);       
        return response.data;
    } catch (error) {
        throw new Error('Erro ao buscar atividades avaliativas: ' + error.message);
    }
},
  deleteAvaliativa: async (id) => {
    try {
      const response = await axios.delete(API_DELETAR(id), {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      throw new Error('Erro ao excluir atividade avaliativa: ' + error.message);
    }
  },

  updateAvaliativa: async (id, data) => {
    try {
      const response = await axios.put(API_EDITAR(id), data, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      throw new Error('Erro ao editar atividade avaliativa: ' + error.message);
    }
  },
};

export default avaliativaService;
