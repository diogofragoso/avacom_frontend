import axios from 'axios';
import IP from './configIp'; //

const USUARIO_KEY = '@AvaCom:usuario';
const TOKEN_KEY = '@AvaCom:token';

const publico = IP().address; // condiguração de IP publico local de forma automatizada

// URL para a API de usuários (cadastro, etc.)
const USUARIOS_API_URL = `${publico}/api/usuarios`;
// URL para a API de login
const LOGIN_API_URL = `${publico}/api/login`;

const usuarioService = {
    /**
     * Salva o token e o usuário no Local Storage
     */
    salvarSessao: (usuario, token) => {
        localStorage.setItem(USUARIO_KEY, JSON.stringify(usuario));
        localStorage.setItem(TOKEN_KEY, token);
    },

    /**
     * Retorna o token, se existir
     */
    getToken: () => {
        return localStorage.getItem(TOKEN_KEY);
    },

    /**
     * Retorna o usuário logado, se existir
     */
    getUsuario: () => {
        const usuarioJson = localStorage.getItem(USUARIO_KEY);
        return usuarioJson ? JSON.parse(usuarioJson) : null;
    },

    /**
     * Verifica se o usuário está autenticado
     */
    isAuthenticated: () => {
        // Correção: Agora referencia o 'getToken' dentro deste mesmo objeto
        return !!usuarioService.getToken(); 
    },

    /**
     * Limpa o Local Storage
     */
    logout: () => {
        localStorage.removeItem(USUARIO_KEY);
        localStorage.removeItem(TOKEN_KEY);
        // O redirecionamento será feito no Header/MenuLateral
    },

    /**
     * Cria um novo usuário (aluno ou professor) no banco de dados.
     */
    criarUsuario: async (dadosUsuario) => {
        try {
            const response = await axios.post(USUARIOS_API_URL, dadosUsuario, {
                headers: { 'Content-Type': 'application/json' },
            });
            return response.data;
        } catch (error) {
            throw error.response.data || error.message;
        }
    },

    /**
     * Autentica um usuário e recebe o token via cookie.
     * @param {object} credenciais - Objeto com email e senha do usuário.
     * Ex: { email, senha }
     */
    login: async (credenciais) => {
        try {
            const response = await axios.post(LOGIN_API_URL, credenciais, {
                headers: { 'Content-Type': 'application/json' },
            });
            return response.data; // Retorna { message: 'Login bem-sucedido!' }
        } catch (error) {
            throw error.response.data || error.message;
        }
    },

    /**
     * Busca a lista de todos os usuários.
     */
    listarUsuarios: async () => {
        try {
            const response = await axios.get(USUARIOS_API_URL);
            return response.data;
        } catch (error) {
            throw error.response.data || error.message;
        }
    },
};

export default usuarioService;