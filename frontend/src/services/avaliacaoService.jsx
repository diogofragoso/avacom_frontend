import axios from "axios";

const API_URL = "http://localhost:3000/api/avaliacao";

// 🔹 Buscar a matriz completa
const getMatriz = async (cursoId) => {
  try {
    const response = await axios.get(`${API_URL}/listaravaliativa/${cursoId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao obter a matriz de avaliação:", error);
    throw error;
  }
};

// 🔹 Salvar atividade para toda a turma
const salvar = async (payload) => {
  try {
    const response = await axios.post(`${API_URL}/salvar`, payload);
    return response.data;
  } catch (error) {
    console.error("Erro ao salvar avaliação:", error);
    throw error;
  }
};

export default {
  getMatriz,
  salvar,
};
