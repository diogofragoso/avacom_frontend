import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/matriculas';

const matricularAluno = async (dados) => {
  try {
    const resposta = await axios.post(`${API_BASE_URL}/criar`, dados);
    return resposta.data;
  } catch (erro) {
    if (erro.response) {
      // Erro vindo do backend (ex: aluno já matriculado)
      throw new Error(erro.response.data.mensagem || 'Erro ao matricular aluno.');
    } else {
      // Erro de rede ou outros
      throw new Error('Erro de conexão com o servidor.');
    }
  }
};

export default {
  matricularAluno
};
