import axios from 'axios';

import IP from './configIp'
const publico = IP().address;

const API_BASE_URL = `http://${publico}:3000/api/atividadeavaliativa`;
const API_INSERIR = `${API_BASE_URL}/inseriravaliativa`;
const API_LISTAR = `${API_BASE_URL}`;
const API_DELETAR = (id) => `${API_BASE_URL}/deletaravaliativa/${id}`;
const API_EDITAR = (id) => `${API_BASE_URL}/editaravaliativa/${id}`;
const API_GPT = 'http://localhost:3000/api/chatgpt';

const avaliativaService = {
  createAvaliativa: async (data) => {
    try {
      const response = await axios.post(API_INSERIR, data, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(`Erro ao criar atividade avaliativa: ${error.response.status} - ${error.response.data.message}`);
      } else {
        throw new Error('Erro ao criar atividade avaliativa: ' + error.message);
      }
    }
  },

  getAvaliativasPorIndicador: async (id_indicador) => {
    try {
      const response = await axios.get(`${API_LISTAR}/${id_indicador}`);
      // Retorna array vazio se não houver dados
      return response.data || []; 
    } catch (error) {
      // Se for um 404 (não encontrado), trata como lista vazia
      if (error.response?.status === 404) {
        return [];
      }
      // Outros erros continuam sendo lançados
      throw new Error('Erro ao buscar atividades avaliativas: ' + error.message);
    }
  },

  deleteAvaliativa: async (id) => {
    console.log(id);
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

gerarTextoIA: async (prompt) => {
  try {
    const res = await fetch(API_GPT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro na IA');
    return data.answer;
  } catch (error) {
    throw error;
  }
}
};


export default avaliativaService;
