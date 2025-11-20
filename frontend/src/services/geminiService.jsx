import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Agora aceitamos 'tags' além do 'textoBase'
export const gerarSugestaoFeedback = async (textoBase, tags = []) => {
  if (!genAI) {
    throw new Error("Chave de API do Gemini não configurada no .env");
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const listaTags = tags.length > 0 ? tags.join(", ") : "Nenhuma competência específica selecionada";

    const prompt = `
      Atue como um pedagogo especialista. Escreva um feedback avaliativo para um estudante.
      
      1. Considere as seguintes Competências, Habilidades e Atitudes observadas no aluno: ${listaTags}.
      2. Considere também este rascunho ou observação do professor: "${textoBase}".
      
      Instruções:
      - Combine os pontos selecionados e o rascunho em um texto único, fluido e coeso.
      - O tom deve ser formal, construtivo e motivador.
      - Use português do Brasil culto.
      - Máximo de 4 parágrafos curtos.
      
      Responda apenas com o texto do feedback.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
    
  } catch (error) {
    console.error("Erro ao processar com Gemini:", error);
    throw error;
  }
};