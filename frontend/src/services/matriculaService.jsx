import axios from 'axios';

import IP from './configIp'
const publico = IP().address;

const API_BASE_URL = `${publico}/api/matricula`;
const API_MATRICULAR_ESTUDANTE = `${API_BASE_URL}/matricularestudante`;

// Retorna a URL para listar alunos matriculados de uma turma
const API_LISTAR_MATRICULADOS = (idTurma) => `${API_BASE_URL}/${idTurma}`;

// Rota para excluir matrícula
const API_EXCLUIR_MATRICULA = (idMatricula) => `${API_BASE_URL}/excluirmatricula/${idMatricula}`;

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

// Remover matrícula pelo ID da matrícula
const removerMatricula = async (idMatricula) => {
  try {
    const resposta = await axios.delete(API_EXCLUIR_MATRICULA(idMatricula));
    return resposta.data;
  } catch (erro) {
    console.error('Erro detalhado ao remover matrícula:', erro);
    throw new Error('Erro ao remover matrícula do estudante.');
  }
};

export default {
  getAlunosMatriculadosPorTurma,
  matricularEstudante,
  removerMatricula,
};
