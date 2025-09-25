// Caminho: src/services/avaliacaoService.js
import axios from "axios";

const API_URL = "http://localhost:3000/api/avaliacao";

// 🔹 Buscar a matriz completa de UCs, Indicadores e Atividades Avaliativas
const getMatriz = async (cursoId) => {
  try {
    const response = await axios.get(`${API_URL}/listaravaliativa/${cursoId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao obter a matriz de avaliação:", error);
    throw error;
  }
};

// 🔹 Salvar uma nova avaliação (pode ser usado para atividades de toda a turma)
const salvar = async (payload) => {
  try {
    const response = await axios.post(`${API_URL}/salvar`, payload);
    return response.data;
  } catch (error) {
    console.error("Erro ao salvar avaliação:", error);
    throw error;
  }
};

// 🔹 Atualizar uma avaliação existente (menção, data, observação)
const atualizar = async (id, payload) => {
  try {
    const response = await axios.put(`${API_URL}/atualizar/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar avaliação:", error);
    throw error;
  }
};

// 🔹 Buscar avaliações já salvas para um indicador específico
const getSelecionadas = async (indicadorId) => {
    try {
        const response = await axios.get(`${API_URL}/listarselecionada/${indicadorId}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao obter avaliações selecionadas para o indicador ${indicadorId}:`, error);
        // Retornar um objeto padrão em caso de erro 404 para não quebrar o Promise.all
        if (error.response && error.response.status === 404) {
            return { id_indicador: indicadorId, total: 0, avaliativas: [] };
        }
        throw error;
    }
};

export default {
  getMatriz,
  salvar,
  atualizar,
  getSelecionadas,
};