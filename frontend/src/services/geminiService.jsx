import axios from "axios";
import IP from "./configIp";

// Pega o endereço da sua API (localhost ou produção automaticamente)
const publico = IP().address;

export const gerarSugestaoFeedback = async (textoBase, tags = []) => {
  try {
    // Chama o SEU back-end, não o Google diretamente
    const response = await axios.post(`${publico}/api/ia/feedback`, {
      texto: textoBase,
      tags: tags
    });

    return response.data.resultado;
  } catch (error) {
    console.error("Erro ao solicitar IA ao servidor:", error);
    throw error;
  }
};