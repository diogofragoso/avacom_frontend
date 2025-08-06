import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/matriculas';

const API_LISTAR_MATRICULADOS = (idTurma) => `${API_BASE_URL}/${idTurma}`;

const matricularAluno = async (dados) => {
  try {
    const resposta = await axios.post(`${API_BASE_URL}/criar`, dados);
    return resposta.data;
  } catch (erro) {
    if (erro.response) {
      throw new Error(erro.response.data.mensagem || 'Erro ao matricular aluno.');
    } else {
      throw new Error('Erro de conexão com o servidor.');
    }
  }
};

const getAlunosMatriculados = async (idTurma) => {
  try {
    const resposta = await axios.get(API_LISTAR_MATRICULADOS(idTurma));
    return resposta.data;
  } catch (erro) {
    throw new Error('Erro ao buscar alunos matriculados.');
  }
};






export default {
  matricularAluno,
  getAlunosMatriculados
};
