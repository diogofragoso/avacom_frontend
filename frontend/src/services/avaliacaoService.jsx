// Caminho: src/services/avaliacaoService.js
import axios from "axios";
import IP from './configIp';

const publico = IP().address;
const API_URL = `http://${publico}:3000/api/avaliacao`;

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
    if (error.response && error.response.status === 404) {
      return { id_indicador: indicadorId, total: 0, avaliativas: [] };
    }
    throw error;
  }
};

// ------------------- NOVAS FUNÇÕES -------------------

/**
 * 🔹 Busca as avaliações finais (menção e feedback) de um aluno em uma turma.
 * @param {number} idAluno - O ID do aluno.
 * @param {number} idTurma - O ID da turma.
 * @returns {Promise<Array>} Uma lista de avaliações finais salvas.
 */
const getAvaliacoesFinais = async (idAluno, idTurma) => {
  try {
    // A API que criamos espera os IDs como query params
    const response = await axios.get(`${API_URL}/avaliacaofinal`, {
      params: {
        id_aluno: idAluno,
        id_turma: idTurma
      }
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar avaliações finais:", error);
    throw error;
  }
};

/**
 * 🔹 Salva ou atualiza a avaliação final (menção ou feedback) para uma UC.
 * A API no backend fará a lógica de INSERT ou UPDATE.
 * @param {object} data - O payload com os dados. Ex: { id_aluno_fk, id_turma_fk, id_uc_fk, mencao_final, feedback_final }
 * @returns {Promise<object>} A resposta da API.
 */
const salvarAvaliacaoFinal = async (data) => {
  try {
    // O axios envia o objeto 'data' diretamente no corpo da requisição POST
    const response = await axios.post(`${API_URL}/avaliacaofinal`, data);
    return response.data;
  } catch (error) {
    console.error("Erro ao salvar avaliação final:", error);
    throw error;
  }
};


// Exporta todas as funções do serviço
export default {
  getMatriz,
  salvar,
  atualizar,
  getSelecionadas,
  getAvaliacoesFinais, // <-- Nova função adicionada
  salvarAvaliacaoFinal, // <-- Nova função adicionada
};