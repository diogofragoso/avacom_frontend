import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const gerarSugestaoFeedback = async (textoBase, tags = []) => {
  if (!genAI) {
    throw new Error("Chave de API do Gemini não configurada no .env");
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const listaTags = tags.length > 0 ? tags.join(", ") : "Nenhuma competência específica selecionada";

    const prompt = `
      Atue como um pedagogo especialista em feedback educacional.
      Escreva um feedback avaliativo para um estudante.
      Seja sóbrio, sem exageros ou floreios.
      
      DADOS DE ENTRADA:
      1. Conhecimentos, Habilidades,   Atitudes e valores observados (Tags): ${listaTags}.
      2. Rascunho/Observação do professor: "${textoBase}".
      
      INSTRUÇÕES DE ESCRITA:
      - Combine os pontos selecionados e o rascunho em um texto único, fluido e coeso.
      - O tom deve ser formal, construtivo e motivador.
      - Use português do Brasil culto.
      - Máximo de 4 parágrafos curtos.
      - IMPORTANTE: Não use nenhuma formatação Markdown (como negrito, itálico ou listas). Entregue apenas o texto puro corridos.
      
      Responda apenas com o texto do feedback.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let textoFinal = response.text();

    // LIMPEZA EXTRA: Remove asteriscos (**) e hashtags (##) caso o modelo desobedeça
    textoFinal = textoFinal.replace(/\*\*/g, "").replace(/##/g, "").trim();

    return textoFinal;
    
  } catch (error) {
    console.error("Erro ao processar com Gemini:", error);
    throw error;
  }
};