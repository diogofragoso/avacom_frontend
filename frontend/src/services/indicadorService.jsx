import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/ucs';
const API_INSERIR = `${API_BASE_URL}/inseririndicador`;
const API_LISTAR = `${API_BASE_URL}/listarindicador`;
const API_DELETAR_INDICADOR = (id) => `${API_BASE_URL}/deletarindicador/${id}`;
const API_EDITAR_INDICADOR = (id) => `${API_BASE_URL}/editarindicador/${id}`;



const indicadorService = {
  createIndicador: async (data) => {
    try {
      const response = await axios.post(API_INSERIR, data, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getIndicadores: async () => {
    try {
      const response = await axios.get(API_LISTAR);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteIndicador: async (id) => {
    try {
      const response = await axios.delete(API_DELETAR_INDICADOR(id), {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data; // Retorna a resposta da API
    } catch (error) {
      throw new Error('Erro ao excluir a UC: ' + error.message);
    }
  },


  updateIndicador: async (id, data) => {
    try {
      const response = await axios.put(API_EDITAR_INDICADOR(id), data, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      throw new Error('Erro ao editar o Indicador: ' + error.message);
    }
  },


};



export default indicadorService;
