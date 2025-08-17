import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/matricula';
const API_MATRICULAR_ESTUDANTE = `${API_BASE_URL}/matricularestudante`;

// Retorna a URL para listar alunos matriculados de uma turma
const API_LISTAR_MATRICULADOS = (idTurma) => `${API_BASE_URL}/${idTurma}`;

// Lista os alunos matriculados em uma turma
const getAlunosMatriculadosPorTurma = async (idTurma) => {
  try {
    const resposta = await axios.get(API_LISTAR_MATRICULADOS(idTurma));
    return resposta.data;
  } catch (erro) {
    console.error('Erro detalhado ao buscar alunos:', erro);
    throw new Error('Erro ao buscar alunos matriculados.');
  }
};

// Matricular estudante (novo ou existente)
const matricularEstudante = async (dados) => {
  try {
    const resposta = await axios.post(API_MATRICULAR_ESTUDANTE, dados, {
      headers: { 'Content-Type': 'application/json' }
    });
    return resposta.data;
  } catch (erro) {
    if (erro.response) {
      throw new Error(erro.response.data.mensagem || 'Erro ao matricular estudante.');
    } else {
      throw new Error('Erro de conexão com o servidor.');
    }
  }
};

export default {
  getAlunosMatriculadosPorTurma,
  matricularEstudante,
};
