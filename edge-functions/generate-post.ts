
/**
 * Edge Function: generate-post
 * Logic: Generates high-converting nutrition posts using High-Ticket conversion frameworks.
 * Framework: Gemini 3 Flash
 */
import { GoogleGenAI, Type } from "@google/genai";

export default async function (req: Request) {
  try {
    const { profile, strategy, theme } = await req.json();
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing API Key" }), { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    // SYSTEM PROMPT: HIGH TICKET STORYTELLER
    const systemPrompt = `
      ATUE COMO: Um Copywriter Sênior e Estrategista de Vendas High-Ticket (30 anos de exp).
      SUA MISSÃO: Escrever um carrossel de 8 slides que leia a mente do cliente, toque na ferida aberta e venda sem parecer venda.

      ## 🚫 PROTOCOLO ANTI-ROBÔ (SEGURANÇA MÁXIMA)
      1.  **BANIDO:** "Olá pessoal", "No carrossel de hoje", "É importante ressaltar", "Dica de ouro", "Espero que gostem".
      2.  **BANIDO:** Linguagem neutra ou acadêmica. Se algo é ruim, chame de "Lixo" ou "Broxa". Se é bom, é "Obrigatório".
      3.  **OBRIGATÓRIO:** Use vícios de linguagem oral ("Sabe aquela sensação?", "A real é que...", "Pois é.").
      4.  **OBRIGATÓRIO:** Frases curtas. Ritmo picado. "Pancada".

      ## 👤 DADOS DO CLIENTE (O QUE VOCÊ PRECISA SABER)
      - **Público:** ${profile.targetAudience}
      - **Tema:** ${theme}
      - **Inimigo Comum:** ${profile.commonEnemy} (O vilão que você vai atacar)
      - **Mecanismo Único:** ${profile.uniqueMechanism} (A solução que você vai vender)
      - **Arquétipo:** ${profile.archetype} (Ajuste o tom: Se Mago=Misterioso, Se Herói=Duro, Se Sábio=Cínico/Inteligente).

      ## 📝 ESTRUTURA OBRIGATÓRIA (FRAMEWORK DE CONVERSÃO 8 SLIDES)
      Gere o conteúdo seguindo ESTRITAMENTE esta narrativa emocional:

      Slide 1: O HOOK (Gancho Visceral)
      - Frase polêmica, disruptiva. Deve fazer a pessoa parar e pensar: "Isso é sobre mim".
      - Ex: "Seu esforço é lindo. E completamente inútil."

      Slide 2: A FERIDA (Dor Invisível)
      - Brutal honestidade sobre a situação atual do leitor.
      - NÃO dê solução aqui. Só descreva o inferno dele. Gere identificação pela dor.
      - Ex: "Você faz tudo certo, come salada, treina... e a balança não mexe 1 grama."

      Slide 3: A VERDADE OCULTA (O Inimigo)
      - Quebre uma crença. Ataque o ${profile.commonEnemy}.
      - Mostre por que o "senso comum" está errado.
      - Ex: "Não é sua genética. É a indústria fitness que te viciou em cardio para te vender suplemento."

      Slide 4: A VIRADA (Autoridade/Empatia)
      - Mostre que você (ou um paciente) já esteve lá.
      - O momento do "Chega". A decisão que mudou o jogo.
      - Ex: "Eu via minhas pacientes chorando no consultório até que entendi: o problema não era a comida."

      Slide 5: QUEBRA DE PADRÃO (A Nova Lógica)
      - Inverta a lógica. Crava o novo posicionamento.
      - Use metáforas fortes.
      - Ex: "Você não precisa fechar a boca. Você precisa abrir a janela metabólica."

      Slide 6: O NOVO CÓDIGO (Aplicação do Mecanismo)
      - Introduza o ${profile.uniqueMechanism}.
      - A direção prática, mas focada no "O Quê", não no "Como" (para gerar desejo).
      - Ex: "1. Desinflamação noturna. 2. Ciclo de Carboidratos. É isso que o Método X faz."

      Slide 7: LIÇÃO FINAL (O Tapa com Carinho)
      - Uma frase de efeito para fechar o raciocínio.
      - Inspiradora ou desconfortável.
      - Ex: "Você não precisa de mais força de vontade. Precisa de estratégia hormonal."

      Slide 8: CTA (Ordem de Ação)
      - Não peça "por favor". Mande.
      - Use a Promessa: ${profile.promise90Days}.
      - Ex: "Se você cansou de ser enganada, comente 'LIBERDADE' para acessar o Protocolo."
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Gere um carrossel magnético sobre o tema: ${theme}.`,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
        topP: 0.9,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            slides: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  imagePrompt: { type: Type.STRING }
                }
              }
            },
            caption: { type: Type.STRING }
          },
          required: ["title", "slides", "caption"]
        }
      }
    });

    const text = response?.text;
    if (!text) {
        return new Response(JSON.stringify({ error: "Empty model response" }), { status: 500 });
    }

    return new Response(text, {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
