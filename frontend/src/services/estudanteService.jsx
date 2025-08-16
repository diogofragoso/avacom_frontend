import axios from 'axios';

const API_URL = 'http://localhost:3000/api/alunos/listaralunos';

const estudanteService = {
  createStudent: async (data) => {
    try {
      const response = await axios.post('http://localhost:3000/api/alunos/alunos', data, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  listarEstudantes: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default estudanteService;
