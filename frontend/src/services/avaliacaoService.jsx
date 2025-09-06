import axios from "axios";

// URL base da sua API
const API_URL = "http://localhost:3000/api";

const getMatriz = async (cursoId) => {
  try {
    const response = await axios.get(`${API_URL}/avaliacao/${cursoId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao obter a matriz de avaliação:", error);
    throw error;
  }
};

const salvar = async (avaliacoes) => {
  try {
    // A chamada POST para a nova rota 'salvar.js'
    const response = await axios.post(`${API_URL}/avaliacao/salvar`, { avaliacoes });
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