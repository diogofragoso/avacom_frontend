import axios from 'axios';
import IP from './configIp';

const publico = IP().address;

// --- ROTAS UC ---
const API_BASE_URL = `${publico}/api/ucs`;
const API_INSERIR = `${API_BASE_URL}/ucs`;
const API_LISTAR = `${API_BASE_URL}/listarucs`;
const API_DELETAR_UC = (id) => `${API_BASE_URL}/deletaruc/${id}`;
const API_EDITAR_UC = (id) => `${API_BASE_URL}/editaruc/${id}`;

// --- ROTAS CHAV (Conhecimentos, Habilidades, Atitudes e Valores) ---
// Note que usamos 'publico' direto, pois a rota é /api/chav e não /api/ucs/chav
const API_SALVAR_CHAV = `${publico}/api/chav`;
const API_LISTAR_CHAV = (idUc) => `${publico}/api/chav/${idUc}`;

const ucService = {
  // --- Métodos Originais de UC ---
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
      return response.data; 
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

  // --- Novos Métodos para Gerenciar CHAV (Competências) ---

  // Busca a lista de competências de uma UC
  getChavs: async (idUc) => {
    try {
      const response = await axios.get(API_LISTAR_CHAV(idUc));
      // Retorna os dados (espera-se um array de objetos do banco)
      return response.data; 
    } catch (error) {
      console.error("Erro ao buscar CHAVs:", error);
      // Retorna array vazio em caso de erro para não quebrar a tela
      return []; 
    }
  },

  // Salva (substitui) a lista de competências
  saveChavs: async (idUc, listaChavs) => {
    try {
      // O backend espera receber: { "id_uc": 1, "competencias": ["...", "..."] }
      const payload = {
        id_uc: idUc,
        competencias: listaChavs 
      };
      
      const response = await axios.post(API_SALVAR_CHAV, payload, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      throw new Error('Erro ao salvar CHAV: ' + error.message);
    }
  }
};

export default ucService;