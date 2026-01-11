
/**
 * Edge Function: generate-strategy
 * Framework: Gemini 3 Flash
 * Handles strategic business advice for nutritionists.
 */
import { GoogleGenAI } from "@google/genai";

export default async function (req: Request) {
  try {
    const { profile, type, inputs } = await req.json();
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing API Key" }), { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompts: Record<string, string> = {
      funnel_compass: `Analise o cenário de ${profile.fullName} e recomende o melhor funil estratégico. Oferta: ${inputs.offer}, Objetivo: ${inputs.objective}, Momento: ${inputs.moment}, Consciência: ${inputs.consciousness}, Cenário: ${inputs.scenario}.`,
      ad_generator: `Crie roteiros de anúncios para o método ${profile.uniqueMechanism} de ${profile.fullName}. Oferta: ${inputs.adOffer}.`,
      attraction_ideas: `Ideias de topo de funil para atrair ${profile.targetAudience} interessados em ${inputs.mainTopics}.`,
      content_modeling: `Roteiro para quebrar a crença: "${inputs.beliefToBreak}" usando o mecanismo ${profile.uniqueMechanism}.`
    };

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Gere a resposta estratégica para o tipo ${type} baseado no prompt: ${prompts[type]}`,
      config: {
        systemInstruction: "Você é uma estrategista de marketing High-Ticket sênior para nutricionistas. Use tom autoritário e clínico. Retorne Markdown."
      }
    });

    const text = response?.text;
    if (!text) {
        return new Response(JSON.stringify({ error: "Empty model response" }), { status: 500 });
    }

    return new Response(JSON.stringify({ response: text }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
