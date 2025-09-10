import axios from "axios";

// URL base da sua API (ajuste se rodar em produção)
const API_URL = "http://localhost:3000/api/avaliacao";

// 🔹 Buscar a matriz completa (curso + UCs + indicadores + avaliativas)
const getMatriz = async (cursoId) => {
  try {
    // Bate na rota dinâmica listaravaliativa/[id]
    const response = await axios.get(`${API_URL}/listaravaliativa/${cursoId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao obter a matriz de avaliação:", error);
    throw error;
  }
};

// 🔹 Salvar avaliações (POST para salvar.js)
const salvar = async (avaliacoes) => {
  try {
    const response = await axios.post(`${API_URL}/salvar`, { avaliacoes });
    return response.data;
  } catch (error) {
    console.error("Erro ao salvar avaliações:", error);
    throw error;
  }
};

export default {
  getMatriz,
  salvar,
};
