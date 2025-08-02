import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/turmas';

const API_INSERIR_TURMA = `${API_BASE_URL}/inserirturma`;
const API_LISTAR_TURMAS = `${API_BASE_URL}/listarturmas`;
const API_DELETAR_TURMA = (id) => `${API_BASE_URL}/deletarturma/${id}`;
const API_EDITAR_TURMA = (id) => `${API_BASE_URL}/editarturma/${id}`;

export const getTurmas = async () => {
  try {
    const response = await axios.get(API_LISTAR_TURMAS);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar turmas:', error.response?.data || error.message);
    throw error;
  }
};

export const inserirTurma = async (novaTurma) => {
  try {
    const response = await axios.post(API_INSERIR_TURMA, novaTurma, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao inserir turma:', error.response?.data || error.message);
    throw error;
  }
};

export const editarTurma = async (id, turmaAtualizada) => {
  try {
    const response = await axios.put(API_EDITAR_TURMA(id), turmaAtualizada);
    return response.data;
  } catch (error) {
    console.error('Erro ao editar turma:', error.response?.data || error.message);
    throw error;
  }
};

export const deletarTurma = async (id) => {
  try {
    const response = await axios.delete(API_DELETAR_TURMA(id));
    return response.data;
  } catch (error) {
    console.error('Erro ao deletar turma:', error.response?.data || error.message);
    throw error;
  }
};
