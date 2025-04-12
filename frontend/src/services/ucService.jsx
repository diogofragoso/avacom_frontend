import axios from 'axios';

const API_INSERIR = 'http://localhost:3000/api/ucs/ucs';
const API_LISTAR = 'http://localhost:3000/api/ucs/listarucs';
// const API_LISTAR = '/api/cursos/listarcursos';

const ucService = {
  createUcs: async (data) => {
    try {
      const response = await axios.post(API_INSERIR, data, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUcs: async () => {
    try {
      const response = await axios.get(API_LISTAR);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};



export default ucService;
