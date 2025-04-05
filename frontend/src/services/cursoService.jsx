import axios from 'axios';

const API_INSERIR = 'http://localhost:3000/api/cursos/cursos';
const API_LISTAR = 'http://localhost:3000/api/cursos/listarcursos';
// const API_LISTAR = '/api/cursos/listarcursos';

const cursoService = {
  createCurso: async (data) => {
    try {
      const response = await axios.post(API_INSERIR, data, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCursos: async () => {
    try {
      const response = await axios.get(API_LISTAR);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// getCursos: async () => {
//   try {
//     const response = await axios.get(API_LISTAR);
//     return response.data;
//   } catch (error) {
//     if (error.response) {
//       // O servidor respondeu com um status diferente de 2xx
//       console.error('Erro na resposta:', error.response.data);
//       console.error('Status:', error.response.status);
//     } else if (error.request) {
//       // A requisição foi feita mas não houve resposta
//       console.error('Sem resposta. Request:', error.request);
//     } else {
//       // Outro erro
//       console.error('Erro desconhecido:', error.message);
//     }

//     throw error;
//   }
// }
// };





export default cursoService;
