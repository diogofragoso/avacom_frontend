import axios from 'axios';

// Define a URL base para a nossa API de usuários
const API_URL = 'http://localhost:3000/api/usuarios';

const usuarioService = {
  /**
   * Cria um novo usuário (aluno ou professor) no banco de dados.
   * @param {object} dadosUsuario - Os dados do usuário a serem enviados.
   * Ex: { nome, email, senha, tipo_usuario, numero_matricula?, departamento? }
   */
  criarUsuario: async (dadosUsuario) => {
    try {
      // Faz a requisição POST para a raiz da API de usuários
      const response = await axios.post(API_URL, dadosUsuario, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data; // Retorna a resposta do backend (ex: { message: '...', userId: ... })
    } catch (error) {
      // Em caso de erro (ex: email duplicado), o axios joga uma exceção.
      // Re-lançamos o erro para que o componente que chamou a função possa tratá-lo.
      throw error.response.data || error.message;
    }
  },

  /**
   * Busca a lista de todos os usuários.
   * (Nota: O backend para esta rota GET ainda precisa ser criado)
   */
  listarUsuarios: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      throw error.response.data || error.message;
    }
  },

  // Adicionar outras funções aqui no futuro, como:
  // buscarUsuarioPorId: async (id) => { ... },
  // atualizarUsuario: async (id, dados) => { ... },
  // deletarUsuario: async (id) => { ... },
};

export default usuarioService;