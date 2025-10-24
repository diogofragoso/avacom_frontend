import axios from 'axios';

import IP from './configIp'
const publico = IP().address;

const API_BASE_URL = `http://${publico}:3000/api/ucs`;
const API_INSERIR = `${API_BASE_URL}/ucs`;
const API_LISTAR = `${API_BASE_URL}/listarucs`;
// const API_LISTAR = 'http://localhost:3000/api/ucs/listarucs';
const API_DELETAR_UC = (id) => `${API_BASE_URL}/deletaruc/${id}`;
const API_EDITAR_UC = (id) => `${API_BASE_URL}/editaruc/${id}`;






const ucService = {
  createUcs: async (data) => {
    try {
      const response = await axios.post(API_INSERIR, data, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUcs: async () => {
    try {
      const response = await axios.get(API_LISTAR);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteUc: async (id) => {
    try {
      const response = await axios.delete(API_DELETAR_UC(id), {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data; // Retorna a resposta da API
    } catch (error) {
      throw new Error('Erro ao excluir a UC: ' + error.message);
    }
  },


  updateUc: async (id, data) => {
    try {
      const response = await axios.put(API_EDITAR_UC(id), data, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      throw new Error('Erro ao editar a UC: ' + error.message);
    }
  },


};



export default ucService;
