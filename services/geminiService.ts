import { GoogleGenAI, Type } from "@google/genai";
import { z } from "zod";
import { MODELS } from "../constants";
import { UserProfile, StrategyType, CarouselSlide, PostFormat, MaterialType, AudacityLevel, VipMessageConfig, VipWeek, MonthlyOrchestration } from "../types";

// --- 🧠 THE BRAIN TRUST: Definição das Personalidades Especializadas ---
export const PERSONAS = {
  // 1. VISÃO GERAL (O MAESTRO)
  COMMAND_CENTER: `
    ATUE COMO: O Gerente Geral de uma Clínica de Nutrição de Alto Padrão.
    FUNÇÃO: Orquestrar as operações diárias e direcionar a nutricionista para a ação correta.
    TOM: Executivo, direto, focado em "Ação Única".
    OBJETIVO: Eliminar a paralisia de decisão. Se a meta está baixa, mande vender. Se a atração está baixa, mande postar.
  `,

  // 2. ESTRATÉGIA (O ARQUITETO)
  BRAND_ARCHITECT: `
    ATUE COMO: Um Arquiteto de Branding e Experiência do Cliente de Luxo.
    FUNÇÃO: Definir Nicho, Marca e Posicionamento Incomum.
    BASE: Metodologia de Diferenciação High-Ticket.
    OBJETIVO: Criar uma marca que não compete por preço, mas por valor. Transformar "serviços" em "experiências".
  `,

  // 3. OPERAÇÃO (O SOCIAL MEDIA)
  SOCIAL_MEDIA_MANAGER: `
    ATUE COMO: Um Social Media Manager Sênior focado em Conversão (não em likes).
    FUNÇÃO: Gerir o Calendário Editorial e o Feed.
    HABILIDADES: Copywriting visual, retenção em carrosséis e ganchos virais.
    OBJETIVO: Garantir que cada post tenha um trabalho: atrair, educar ou vender.
  `,

  // 4. FUNIS (O ESTRATEGISTA DE CRESCIMENTO)
  GROWTH_STRATEGIST: `
    ATUE COMO: Um Estrategista de Crescimento Patrimonial para Nutricionistas.
    FUNÇÃO: Desenhar funis de vendas que escalam o faturamento (Funis de Pesquisa, Aplicação, Presente).
    MENTALIDADE: "Light Business" (Trabalhar menos, ganhar mais através de processos inteligentes).
    OBJETIVO: Criar caminhos automáticos que transformam seguidores em clientes de High Ticket.
  `,

  // 5. PRODUTOS - MATERIAIS (O COPYWRITER CLÍNICO)
  MATERIAL_COPYWRITER: `
    ATUE COMO: Um Copywriter Especialista em Nutrição e Info-produtos.
    FUNÇÃO: Criar E-books e Materiais Ricos.
    HABILIDADE: Traduzir ciência complexa (nutrês) em linguagem simples e persuasiva.
    OBJETIVO: Criar iscas que geram "Pequenas Vitórias" rápidas para o paciente.
  `,

  // 6. PRODUTOS - DESAFIOS (O COACH COMPORTAMENTAL)
  CHALLENGE_COACH: `
    ATUE COMO: Um Coach de Emagrecimento e Especialista em Gamificação.
    FUNÇÃO: Estruturar Desafios de Engajamento.
    TOM: Motivador, energético, empático mas firme.
    ÉTICA: Persuasão ética. Fazer o paciente agir para o bem dele.
    OBJETIVO: Gerar dopamina e comunidade. Vender o próximo passo no final.
  `,

  // 7. CONVERSÃO - VIP (O CLOSER DE RELACIONAMENTO)
  VIP_CLOSER: `
    ATUE COMO: Um Especialista em Vendas por Chat e Relacionamento (CRM).
    FUNÇÃO: Gerir a Lista VIP (WhatsApp/Telegram).
    ESTRATÉGIA: Alternância entre "Nutrir" (Dar valor) e "Colher" (Fazer oferta).
    TOM: Íntimo, "amiga profissional", exclusivo.
    OBJETIVO: Tirar o lead do "morno" e levar para o "quente" (compra).
  `,

  // 8. RESULTADOS (O CFO - DIRETOR FINANCEIRO)
  CFO_STRATEGIST: `
    ATUE COMO: O Diretor Financeiro (CFO) e Estrategista de Negócios da Clínica.
    FUNÇÃO: Analisar métricas (GPS Financeiro) e planear o crescimento.
    HABILIDADES: Contabilidade, Engenharia Reversa de Metas e Análise de Lucratividade.
    OBJETIVO: Traduzir números frios em planos de ação claros. "Para ganhar X, venda Y".
  `,

  // 9. MENTOR IA (O CONSELHO)
  MENTOR_ORCHESTRATOR: `
    ATUE COMO: O Mentor Chefe do Sistema Nutri.AI.
    FUNÇÃO: Ser o apoio emocional e estratégico central.
    CAPACIDADE: Roteamento Inteligente. Se a dúvida for técnica, aja como o especialista. Se for emocional (insegurança), aja como um mentor acolhedor.
    OBJETIVO: Nunca deixar a nutricionista sem resposta.
  `
};

// --- CONFIGURAÇÃO ---
const GENERATION_CONFIG = {
  temperature: 0.7, 
  topP: 0.9,
  topK: 40,
};

// --- HELPER: LIMPADOR DE JSON CIRÚRGICO ---
function cleanJsonString(text: string): string {
  if (!text) return "{}";
  let clean = text.replace(/```json\n/g, "").replace(/```json/g, "").replace(/\n```/g, "").replace(/```/g, "");
  clean = clean.replace(/\/\/.*$/gm, ""); 
  const firstBrace = clean.indexOf('{');
  const firstBracket = clean.indexOf('[');
  let startIndex = -1;
  if (firstBrace !== -1 && firstBracket !== -1) {
    startIndex = Math.min(firstBrace, firstBracket);
  } else if (firstBrace !== -1) {
    startIndex = firstBrace;
  } else if (firstBracket !== -1) {
    startIndex = firstBracket;
  }
  if (startIndex !== -1) {
    const lastBrace = clean.lastIndexOf('}');
    const lastBracket = clean.lastIndexOf(']');
    const endIndex = Math.max(lastBrace, lastBracket);
    if (endIndex > startIndex) {
       clean = clean.substring(startIndex, endIndex + 1);
    }
  }
  return clean.trim();
}

// --- SCHEMAS DE VALIDAÇÃO (ZOD) ---
const SlideSchema = z.object({
  text: z.coerce.string().optional().default("Conteúdo não gerado"),
  imagePrompt: z.coerce.string().optional().default("Imagem minimalista de nutrição"),
  imageUrl: z.string().optional()
});

const PostContentSchema = z.object({
  title: z.coerce.string().default("Sem Título"),
  caption: z.coerce.string().optional().default(""),
  script: z.string().optional(),
  slides: z.array(SlideSchema).optional().default([])
});

const ProductSchema = z.object({
  type: z.string(),
  name: z.string(),
  price: z.union([z.string(), z.number()]).transform((val) => {
    if (typeof val === 'number') return isNaN(val) ? 0 : val;
    if (typeof val === 'string') {
        const lower = val.toLowerCase();
        if (lower.includes('free') || lower.includes('grat') || lower.includes('zero') || lower === 'nan') return 0;
        let clean = val.replace(/[^0-9.,]/g, '').trim();
        if (clean === '') return 0;
        if (clean.includes(',')) clean = clean.replace(/\./g, '').replace(',', '.');
        const num = parseFloat(clean);
        return isNaN(num) ? 0 : num;
    }
    return 0;
  }),
  strategy: z.string().optional()
});

const ProductLadderSchema = z.object({
  concept: z.object({
    mechanism: z.string().optional().default("Mecanismo Único"),
    enemy: z.string().optional().default("Inimigo Comum"),
    promise: z.string().optional().default("Promessa")
  }),
  products: z.array(ProductSchema).default([]),
  financial_plan: z.any().optional()
});

const ChallengeDaySchema = z.object({
  day: z.coerce.number(),
  theme: z.coerce.string().default("Tema do Dia"),
  title: z.coerce.string().default("Missão do Dia"),
  description: z.string().optional(),
  morning_script: z.coerce.string().default(""),
  night_script: z.coerce.string().default(""),
  image_prompt: z.string().optional(),
  gamification_points: z.coerce.number().default(10)
});

const ChallengeStructureSchema = z.object({
  launch_strategy: z.array(z.object({
    day: z.coerce.string(),
    script: z.coerce.string()
  })).default([]),
  daily_missions: z.array(ChallengeDaySchema).default([])
});

const VipWeekSchema = z.object({
  week: z.coerce.number().default(1),
  type: z.enum(['CONTENT', 'OFFER'])
    .or(z.string().transform(val => val && val.toUpperCase().includes('OFFER') ? 'OFFER' : 'CONTENT'))
    .default('CONTENT'),
  headline: z.coerce.string().default("Tópico da Semana"),
  association: z.string().optional(),
  script: z.coerce.string().default("Conteúdo pendente"),
  productName: z.string().optional(),
  status: z.enum(['pending', 'sent']).optional().default('pending')
});

const VipStrategyBatchSchema = z.object({
  weeks: z.array(VipWeekSchema)
});

const MonthlyOrchestrationSchema = z.object({
  digital_bait: z.object({
    title: z.coerce.string().default("Isca Digital"),
    outline: z.coerce.string().default("Conteúdo pendente")
  }).optional().default({ title: "Isca Digital", outline: "Conteúdo pendente" }),
  
  feed_posts: z.array(z.object({
    week: z.coerce.number().default(1),
    day: z.union([z.string(), z.number()]).transform(v => String(v)).default("Segunda"),
    title: z.coerce.string().default("Post da Semana"),
    caption: z.coerce.string().default("Legenda pendente"),
    slides: z.array(z.object({ 
      text: z.coerce.string().default(""), 
      imagePrompt: z.coerce.string().default("") 
    })).default([])
  })).default([]),
  
  stories: z.array(z.object({
    day: z.coerce.number().default(1),
    theme: z.coerce.string().default("Rotina"),
    script: z.coerce.string().default("")
  })).optional().default([]),
  
  reels: z.array(z.object({
    week: z.coerce.number().default(1),
    hook: z.coerce.string().default("Gancho"),
    script: z.coerce.string().default("")
  })).optional().default([]),
  
  vip_messages: z.array(z.object({
    week: z.coerce.number().default(1),
    type: z.enum(['CONTENT', 'OFFER'])
        .or(z.string().transform(val => val && val.toUpperCase().includes('OFFER') ? 'OFFER' : 'CONTENT'))
        .default('CONTENT'),
    text: z.coerce.string().default("Mensagem VIP")
  })).optional().default([])
});

const DistributionKitSchema = z.object({
  stories: z.array(z.string()),
  caption: z.string()
});

// --- HELPER: INSTÂNCIA SEGURA DA IA ---
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key não encontrada.");
  return new GoogleGenAI({ apiKey });
};

// --- SYSTEM PROMPT BUILDER PARA POSTS (SOCIAL MEDIA MANAGER) ---
const SOCIAL_MEDIA_CONTEXT = (profile: UserProfile, format: string = 'carousel', topic: string) => `
  ${PERSONAS.SOCIAL_MEDIA_MANAGER}
  
  CONTEXTO DA NUTRICIONISTA:
  - Nome: ${profile.fullName}
  - Especialidade: ${profile.specialty}
  - Mecanismo Único (Método): ${profile.uniqueMechanism}
  - Inimigo Comum (O vilão): ${profile.commonEnemy}
  - Público Alvo (PPI): ${profile.targetAudience}

  FILOSOFIA "LIGHT BUSINESS":
  - Simplicidade e Intenção. Menos volume, mais conversão.
  - "Um conteúdo, um funil, uma oferta".
  - Fale com os 3 níveis de consciência: INCONFORMADOS, FRUSTRADOS, DESENVOLVIDOS.

  VISUAL & FORMATO OBRIGATÓRIOS (${format}):
  ${format === 'modern_tweet' ? 
    'ESTILO TWITTER: Texto ultra-curto (max 280 chars por slide). Sem títulos complexos. Apenas a frase de impacto crua. Ex: "Você não tem falta de tempo. Você tem falta de prioridade."' : 
    format === 'clinical_journal' ? 
    'ESTILO MINIMALISTA: Texto elegante, curto e direto. Use fontes serifadas mentalmente. Poucas palavras por slide. Foco na tipografia.' :
    'ESTILO CARROSSEL PADRÃO: Título forte, corpo explicativo.'
  }

  REGRAS DE ESCRITA & CRIATIVIDADE (PLAYBOOK):
  1. **O OLHAR DO ARTISTA:** Use metáforas e analogias.
  2. **ELEMENTOS NARRATIVOS:** Conflito, plot twist, ironia.
  3. **TOM DE VOZ:** Autoral, firme e empático. Use vícios de linguagem oral.
  
  PROTOCOLO ANTI-ROBÔ (BANIDO):
  - 🚫 NUNCA comece com "Olá pessoal", "No post de hoje".
  - 🚫 NUNCA use linguagem acadêmica fria.
  - 🚫 NUNCA termine com "Gostou? Curte e compartilha". Use CTAs de conversão ("Comente X").

  OBJETIVO:
  - Tema: ${topic}
  - Ataque o Inimigo Comum.
  - Apresente o Mecanismo Único como a ÚNICA solução viável.
`;

// --- FUNÇÕES DE GERAÇÃO BLINDADAS (COM PERSONAS) ---

export const generateProductLadder = async (profile: UserProfile): Promise<any | null> => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: MODELS.text,
      contents: `Construa o Império Digital para: Problema 90 Dias: ${profile.promise90Days}, Pilares: ${profile.uniqueMechanism}, Meta: R$ ${profile.financialGoal}, Inimigo: ${profile.commonEnemy}, PPI: ${profile.targetAudience}.`,
      config: {
        ...GENERATION_CONFIG,
        // BRAND_ARCHITECT + GROWTH_STRATEGIST
        systemInstruction: `${PERSONAS.BRAND_ARCHITECT}\n\n${PERSONAS.GROWTH_STRATEGIST}\n\nMISSÃO: Criar um Ecossistema Enxuto e Altamente Lucrativo. Retorne JSON estruturado com chaves: concept, products (array de 5 itens obrigatórios com os types EXATOS: 'lead_magnet', 'tripwire', 'high_ticket', 'recurring', 'downsell'), financial_plan.`,
        responseMimeType: "application/json"
      }
    });

    const cleanText = cleanJsonString(response?.text || "");
    let json = JSON.parse(cleanText);
    if (Array.isArray(json)) json = json[0] || {};
    return ProductLadderSchema.parse(json);
  } catch (e) {
    console.error("Erro generateProductLadder:", e);
    return null;
  }
};

export const generatePostContent = async (profile: UserProfile, strategy: StrategyType, weekFocus: string, format: PostFormat = 'carousel', tone: AudacityLevel = 'educativa'): Promise<{ title: string; slides?: CarouselSlide[]; caption?: string; script?: string }> => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: MODELS.text,
      contents: `Gere um conteúdo de Elite usando a estratégia: ${strategy}. Tema: "${weekFocus}". Formato: ${format}.`,
      config: { ...GENERATION_CONFIG, systemInstruction: SOCIAL_MEDIA_CONTEXT(profile, format, weekFocus), responseMimeType: "application/json" }
    });

    const cleanText = cleanJsonString(response?.text || "{}");
    const json = JSON.parse(cleanText);
    const data = PostContentSchema.parse(json);
    
    if ((!data.slides || data.slides.length === 0) && data.script) {
        return {
            title: data.title,
            caption: data.caption,
            slides: [{ text: data.script, imagePrompt: "Imagem ilustrativa" }]
        }
    }
    return data;
  } catch (error) { 
    console.error("Erro generatePostContent:", error);
    return { 
        title: "Conteúdo Gerado (Revisão Necessária)", 
        slides: [{ text: "A IA gerou o conteúdo mas houve um erro na formatação. Por favor, tente regenerar.", imagePrompt: "Erro técnico" }],
        caption: "Erro na geração."
    }; 
  }
};

export const generateMonthlyStrategyOrchestration = async (profile: UserProfile, product1: string, product2: string): Promise<MonthlyOrchestration | null> => {
  if (!profile.commonEnemy || !profile.uniqueMechanism || !profile.productLadder) throw new Error("MISSING_PREREQUISITES");
  
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", 
      contents: `
        FOCO MENSAL: Vender o produto de entrada "${product1}" (Tripwire) e converter para o high-ticket "${product2}" (Mentoria).
        DADOS DA NUTRI:
        - Nome: ${profile.fullName}
        - Mecanismo Único: ${profile.uniqueMechanism}
        - Inimigo Comum: ${profile.commonEnemy}
        - Promessa 90 Dias: ${profile.promise90Days}
      `,
      config: { 
        temperature: 0.8, 
        systemInstruction: `
          ${PERSONAS.COMMAND_CENTER}
          MISSÃO SECUNDÁRIA: Atue também como ${PERSONAS.GROWTH_STRATEGIST}.
          TAREFA: Criar um Planejamento Orquestrado de 30 dias (Cronograma).
          RETORNO OBRIGATÓRIO (JSON) com digital_bait, feed_posts, stories, reels, vip_messages.
        `,
        responseMimeType: "application/json" 
      }
    });
    
    const jsonText = cleanJsonString(response?.text || "{}");
    let json = JSON.parse(jsonText);
    if (Array.isArray(json)) json = json[0] || {};
    
    const result = MonthlyOrchestrationSchema.safeParse(json);
    if (!result.success) {
        if (json.feed_posts && Array.isArray(json.feed_posts)) {
            return {
              digital_bait: json.digital_bait || { title: "Isca Digital", outline: "Conteúdo pendente" },
              feed_posts: json.feed_posts,
              stories: json.stories || [],
              reels: json.reels || [],
              vip_messages: json.vip_messages || []
            } as MonthlyOrchestration;
        }
        return null;
    }
    return result.data as any;
  } catch (e) { 
    console.error("Erro fatal na orquestração mensal:", e);
    return null; 
  }
};

export const generateDistributionKit = async (profile: UserProfile, materialTitle: string): Promise<{ stories: string[], caption: string }> => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: MODELS.text,
      contents: `Gere um Kit de Distribuição (Stories + Feed) para a isca digital: ${materialTitle}.`,
      config: {
        systemInstruction: `${PERSONAS.SOCIAL_MEDIA_MANAGER}. Use a estratégia de "Conversão Direta". JSON: { stories: [3 scripts], caption: "legenda" }.`,
        responseMimeType: "application/json"
      }
    });
    const json = JSON.parse(cleanJsonString(response?.text || ""));
    return DistributionKitSchema.parse(json);
  } catch (e) {
    console.error(e);
    return { stories: ["Erro ao gerar stories."], caption: "Erro ao gerar legenda." };
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: MODELS.image,
      contents: [{ parts: [{ text: `High-end editorial photography, cinematic lighting, minimalist aesthetic, natural textures, photorealistic: ${prompt}` }] }],
    });
    const parts = response?.candidates?.[0]?.content?.parts;
    const part = parts?.find(p => p.inlineData);
    if (part?.inlineData?.data) return `data:image/png;base64,${part.inlineData.data}`;
  } catch (err) {
    console.error("Erro generateImage:", err);
  }
  return "";
};

export const refineMaterialText = async (profile: UserProfile, content: string, action: 'improve' | 'expand' | 'summarize'): Promise<string> => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: MODELS.text,
      contents: `Ação: ${action}. Conteúdo: ${content}`,
      config: { ...GENERATION_CONFIG, systemInstruction: `${PERSONAS.MATERIAL_COPYWRITER}\n\nREFINAMENTO DE TEXTO.` }
    });
    return response?.text || content;
  } catch (error) { return content; }
};

export type NutriBrainType = 
  | 'funnel_compass' 
  | 'ad_generator' 
  | 'attraction_ideas' 
  | 'content_modeling' 
  | 'objection_killer' 
  | 'promise_refinery' 
  | 'monthly_audit';

export const generateStrategyResponse = async (profile: UserProfile, type: NutriBrainType, inputs: any): Promise<string> => {
  try {
    const ai = getAIClient();
    let activePersona = PERSONAS.MENTOR_ORCHESTRATOR;
    switch(type) {
        case 'funnel_compass':
        case 'ad_generator': activePersona = PERSONAS.GROWTH_STRATEGIST; break;
        case 'objection_killer': activePersona = PERSONAS.VIP_CLOSER; break;
        case 'monthly_audit': activePersona = PERSONAS.CFO_STRATEGIST; break;
        case 'promise_refinery': activePersona = PERSONAS.BRAND_ARCHITECT; break;
        case 'attraction_ideas':
        case 'content_modeling': activePersona = PERSONAS.SOCIAL_MEDIA_MANAGER; break;
    }

    const response = await ai.models.generateContent({
      model: MODELS.text,
      contents: `Tipo: ${type}. Dados: ${JSON.stringify(inputs)}`,
      config: {
        systemInstruction: `${activePersona}\n\nVocê está analisando a nutricionista ${profile.fullName}. Seja específico e direto.`,
      }
    });
    return response?.text || "";
  } catch (error) { return "Erro ao gerar estratégia."; }
};

export const generateChallengeStructure = async (profile: UserProfile, config: any): Promise<any> => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Desafio: ${config.title}. Pilar: ${config.pillar}. Duração: ${config.duration} dias.`,
      config: { 
        systemInstruction: `${PERSONAS.CHALLENGE_COACH}\n\nCrie a estrutura de um Desafio de Entrada (Tripwire). Foco em 'Pequenas Vitórias'. Retorne JSON com launch_strategy e daily_missions.`,
        responseMimeType: "application/json" 
      }
    });
    const json = JSON.parse(cleanJsonString(response?.text || ""));
    return ChallengeStructureSchema.parse(json);
  } catch (e) {
    console.error(e);
    return { launch_strategy: [], daily_missions: [] };
  }
};

export const generateVipMessage = async (profile: UserProfile, config: VipMessageConfig): Promise<string> => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: MODELS.text,
      contents: `Mensagem VIP WhatsApp. Ciclo: ${config.cycle}. Headline: ${config.headline}. Tema: ${config.topic}. Associação: ${config.association}.`,
      config: {
          systemInstruction: `${PERSONAS.VIP_CLOSER}\n\nEscreva uma mensagem de texto para Lista VIP (WhatsApp). Tom íntimo, exclusivo, direto.`
      }
    });
    return response?.text || "";
  } catch (e) { return "Erro ao gerar mensagem."; }
};

export const generateVipStrategyBatch = async (profile: UserProfile): Promise<VipWeek[]> => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Gere um calendário de 8 Semanas para Lista VIP de WhatsApp. Alterne entre Conteúdo (Nutrição) e Oferta (Venda).`,
      config: { 
          systemInstruction: `${PERSONAS.VIP_CLOSER}\n\nRetorne JSON.`,
          responseMimeType: "application/json" 
      }
    });
    const json = JSON.parse(cleanJsonString(response?.text || ""));
    const data = VipStrategyBatchSchema.parse(json);
    return data.weeks as VipWeek[];
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const generateMaterialContent = async (profile: UserProfile, type: MaterialType, title: string, promise: string, highTicketOffer?: string, acuteSymptom?: string): Promise<any[]> => {
  try {
    const ai = getAIClient();
    const systemPrompt = `
      ${PERSONAS.MATERIAL_COPYWRITER}
      MISSÃO: Criar uma "Amostra Grátis de Autoridade" (Isca Digital) que resolva um SINTOMA AGUDO para vender a solução da CAUSA RAIZ (Produto High Ticket).
      CONTEXTO: ${profile.fullName}, ${profile.specialty}, Inimigo: ${profile.commonEnemy}, Mecanismo: ${profile.uniqueMechanism}, Sintoma: ${acuteSymptom}, High Ticket: ${highTicketOffer}.
      REGRA DE OURO: Não resolva o problema todo. Resolva o SINTOMA AGUDO.
      ANATOMIA: Capa, Boas Vindas, Conteúdo Prático, O Gap, Oferta Irresistível.
      FORMATO: Array JSON de páginas.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", 
      contents: `Gere o conteúdo estruturado para a isca digital: "${title}". Promessa: "${promise}". Foco no sintoma: "${acuteSymptom}".`,
      config: { 
        temperature: 0.7,
        systemInstruction: systemPrompt,
        responseMimeType: "application/json"
      }
    });
    
    const json = JSON.parse(cleanJsonString(response?.text || ""));
    if (Array.isArray(json)) {
       return json;
    } else if (json.pages && Array.isArray(json.pages)) {
       return json.pages;
    } else {
       return [json]; 
    }
  } catch (e) {
    console.error("Erro generateMaterialContent:", e);
    return [{ type: 'cover', title: title, content: promise }];
  }
};

export const generatePostsFromBlueprint = async (
  profile: UserProfile, 
  title: string, 
  pattern: StrategyType[], 
  answers: Record<string, string>,
  audacity: AudacityLevel,
  format: PostFormat
): Promise<{ posts: any[] }> => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: MODELS.text,
      contents: `Gere um funil de posts baseado no blueprint "${title}".
      Respostas do Usuário: ${JSON.stringify(answers)}.
      Padrão de Estratégia: ${pattern.join(', ')}.
      Formato: ${format}.
      Tom: ${audacity}.`,
      config: { 
        ...GENERATION_CONFIG, 
        systemInstruction: `${PERSONAS.GROWTH_STRATEGIST}\n\n${SOCIAL_MEDIA_CONTEXT(profile, format, title)}`, 
        responseMimeType: "application/json"
      }
    });
    
    const json = JSON.parse(cleanJsonString(response?.text || ""));
    const MassPostsSchema = z.object({ posts: z.array(z.any()) });
    return MassPostsSchema.parse(json);
  } catch (e) {
    console.error(e);
    return { posts: [] };
  }
};