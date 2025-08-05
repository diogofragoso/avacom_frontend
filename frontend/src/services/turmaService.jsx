// services/turmaService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/turmas';

const API_INSERIR_TURMA = `${API_BASE_URL}/inserirturma`;
const API_LISTAR_TURMAS = `${API_BASE_URL}/listarturmas`;
const API_DELETAR_TURMA = (id) => `${API_BASE_URL}/deletarturma/${id}`;
const API_EDITAR_TURMA = (id) => `${API_BASE_URL}/editarturma/${id}`;

export const getTurmas = async () => {
  const response = await axios.get(API_LISTAR_TURMAS);
  return response.data;
};

export const inserirTurma = async (novaTurma) => {
  const response = await axios.post(API_INSERIR_TURMA, novaTurma);
  return response.data;
};

export const editarTurma = async (id, turmaAtualizada) => {
  const response = await axios.put(API_EDITAR_TURMA(id), turmaAtualizada);
  return response.data;
};

export const deletarTurma = async (id) => {
  const response = await axios.delete(API_DELETAR_TURMA(id));
  return response.data;
};
