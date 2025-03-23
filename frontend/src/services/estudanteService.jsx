import axios from 'axios';

const API_URL = 'http://localhost:3000/api/alunos/alunos'; // URL do endpoint

const estudanteService = {
  createStudent: async (data) => {
    try {
      const response = await axios.post(API_URL, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default estudanteService;
