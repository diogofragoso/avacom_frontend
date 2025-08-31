import axios from "axios";

const API_URL = "http://localhost:3000/api/avaliacao";

const getMatriz = async (estudanteId) => {
  const response = await axios.get(`${API_URL}/matriz/${estudanteId}`);
  return response.data;
};

const salvar = async (estudanteId, avaliacoes) => {
  return await axios.post(`${API_URL}/salvar/${estudanteId}`, avaliacoes);
};

export const criarAvaliacao = async (avaliacao) => {
  try {
    const response = await axios.post(API_URL, avaliacao);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar avaliação", error);
    throw error;
  }
};
export default { 
    getMatriz, 
    salvar, 
    criarAvaliacao 
};
