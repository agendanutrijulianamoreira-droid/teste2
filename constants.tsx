
import React from 'react';
import { Palette, Sparkles, BookOpen, Ban, DollarSign, Camera, Layers, Film, Image as ImageIcon, LayoutTemplate, Scale, Zap, Trophy, Heart, Magnet, Search, History, Clock, MessageSquare, Target, Microscope, Crown, TrendingUp } from 'lucide-react';
import { StrategyType, PostFormat, FunnelBlueprint, Archetype } from './types';

export const MODELS = {
  text: 'gemini-3-flash-preview',
  image: 'gemini-2.5-flash-image',
  live: 'gemini-2.5-flash-native-audio-preview-12-2025'
};

export const STRATEGY_CONFIG: Record<StrategyType, { label: string; icon: React.ReactNode; color: string; day: string }> = {
  // PILAR 1: VENDAS (Conversão Direta / "Levantada de Mão")
  conversao_direta: { label: 'Conversão Direta', icon: <DollarSign className="w-4 h-4" />, color: 'bg-green-50 text-green-700 border-green-200', day: 'Quinta' },
  
  // PILAR 2: AUTORIDADE (Conteúdo Técnico / "Mini Treinamento")
  autoridade_clinica: { label: 'Autoridade Clínica', icon: <BookOpen className="w-4 h-4" />, color: 'bg-blue-50 text-blue-700 border-blue-200', day: 'Terça' },
  mini_treinamento: { label: 'Mini Treinamento', icon: <Microscope className="w-4 h-4" />, color: 'bg-indigo-50 text-indigo-700 border-indigo-200', day: 'Terça' },
  
  // PILAR 3: CONEXÃO (Posicionamento / "Bastidores")
  conexao_valores: { label: 'Conexão e Valores', icon: <Heart className="w-4 h-4" />, color: 'bg-purple-50 text-purple-700 border-purple-200', day: 'Segunda' },
  lifestyle: { label: 'Bastidores/Lifestyle', icon: <Camera className="w-4 h-4" />, color: 'bg-pink-50 text-pink-700 border-pink-200', day: 'Sexta' },
  
  // ESTRATÉGIAS DE APOIO
  mito_verdade: { label: 'Mito vs Verdade', icon: <Scale className="w-4 h-4" />, color: 'bg-orange-50 text-orange-700 border-orange-200', day: 'Quarta' },
  stories_consultivo: { label: 'Stories Consultivo', icon: <MessageSquare className="w-4 h-4" />, color: 'bg-amber-50 text-amber-700 border-amber-200', day: 'Sábado' },
  pesquisa_audiencia: { label: 'Pesquisa', icon: <Search className="w-4 h-4" />, color: 'bg-gray-50 text-gray-700 border-gray-200', day: 'Domingo' },
  recuperacao_vendas: { label: 'Recuperação', icon: <History className="w-4 h-4" />, color: 'bg-red-50 text-red-700 border-red-200', day: 'Domingo' },
};

export const FORMAT_CONFIG: Record<PostFormat, { label: string; icon: React.ReactNode; aspect: string }> = {
  carousel: { label: 'Carrossel', icon: <Layers className="w-4 h-4" />, aspect: '4/5' },
  reels: { label: 'Reels', icon: <Film className="w-4 h-4" />, aspect: '9/16' },
  static: { label: 'Estático', icon: <ImageIcon className="w-4 h-4" />, aspect: '1/1' },
  stories: { label: 'Stories', icon: <LayoutTemplate className="w-4 h-4" />, aspect: '9/16' },
  script_whatsapp: { label: 'Script WhatsApp', icon: <MessageSquare className="w-4 h-4" />, aspect: 'n/a' },
  roteiro_stories: { label: 'Roteiro Stories', icon: <LayoutTemplate className="w-4 h-4" />, aspect: '9/16' },
};

export const ELITE_GALLERY = [
  { url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop' },
  { url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop' },
  { url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=800&auto=format&fit=crop' },
  { url: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?q=80&w=800&auto=format&fit=crop' },
  { url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=800&auto=format&fit=crop' },
  { url: 'https://images.unsplash.com/photo-1543332164-6e82f3556082?q=80&w=800&auto=format&fit=crop' },
];

export interface EnhancedFunnelBlueprint extends FunnelBlueprint {
  questions: { id: string; label: string; placeholder: string }[];
}

export const FUNNEL_BLUEPRINTS: EnhancedFunnelBlueprint[] = [
  // FASE 1: ATRAÇÃO E VALIDAÇÃO
  {
    id: 'f1',
    category: 'start',
    title: 'Pesquisa de Audiência',
    promise: 'Descubra a dor exata para vender.',
    description: 'Roteiro de Stories com enquetes táticas para validar sua próxima oferta.',
    icon: 'Search',
    color: 'from-amber-400 to-amber-600',
    pattern: ['pesquisa_audiencia'],
    outputFormat: 'roteiro_stories',
    questions: [
      { id: 'q1', label: 'Qual o tema principal da pesquisa?', placeholder: 'Ex: Dores no Emagrecimento' },
      { id: 'q2', label: 'Qual dúvida você quer sanar?', placeholder: 'Ex: Se preferem mentorias em grupo ou individual' }
    ]
  },
  {
    id: 'f2',
    category: 'start',
    title: 'Isca Digital (Lead Magnet)',
    promise: 'Construa sua lista de potenciais clientes.',
    description: 'Post focado em troca: conteúdo rico por contato no Direct.',
    icon: 'Magnet',
    color: 'from-blue-400 to-blue-600',
    pattern: ['conexao_valores', 'conversao_direta'],
    questions: [
      { id: 'q1', label: 'Qual o nome do seu material gratuito?', placeholder: 'Ex: Guia da Desinflamação' },
      { id: 'q2', label: 'Qual o benefício imediato dele?', placeholder: 'Ex: Desinchar em 7 dias' }
    ]
  },

  // FASE 2: CONVERSÃO DIÁRIA (FUNIS PRINCIPAIS DO MÉTODO)
  {
    id: 'f3',
    category: 'sell',
    title: 'Chamada Direta (The Money Post)',
    promise: 'Filtre os Inconformados e venda agora.',
    description: 'Post curto, visceral e agressivo focado no nível máximo de consciência. Identifica o problema e oferece a solução imediata.',
    icon: 'Target',
    color: 'from-green-600 to-emerald-800',
    pattern: ['conversao_direta'],
    questions: [
      { id: 'q1', label: 'Qual a dor latente que vamos atacar?', placeholder: 'Ex: O efeito sanfona que nunca acaba' },
      { id: 'q2', label: 'Qual a palavra-chave de ação?', placeholder: 'Ex: Comente "METABOLISMO"' }
    ]
  },
  {
    id: 'f4',
    category: 'sell',
    title: 'Stories Consultivo',
    promise: 'Venda através de diagnóstico.',
    description: 'Sequência de Stories com Caixinha de Perguntas. Não é para bater papo, é para diagnosticar e vender no Direct.',
    icon: 'MessageSquare',
    color: 'from-purple-400 to-purple-600',
    pattern: ['stories_consultivo'],
    outputFormat: 'roteiro_stories',
    questions: [
      { id: 'q1', label: 'Qual o tema da caixinha?', placeholder: 'Ex: Compulsão por Doces' },
      { id: 'q2', label: 'Qual o objetivo final?', placeholder: 'Ex: Vender Protocolo X no Direct' }
    ]
  },
  {
    id: 'f6',
    category: 'sell',
    title: 'Mini Treinamento',
    promise: 'Autoridade Imediata.',
    description: 'Carrossel educativo profundo (Autoridade Clínica) que ensina o "O Quê" e vende o "Como".',
    icon: 'Microscope',
    color: 'from-indigo-400 to-indigo-600',
    pattern: ['autoridade_clinica', 'autoridade_clinica', 'conversao_direta'],
    questions: [
      { id: 'q1', label: 'Qual o conceito técnico vamos ensinar?', placeholder: 'Ex: O ciclo do cortisol no sono' },
      { id: 'q2', label: 'Qual a pequena vitória o cliente terá?', placeholder: 'Ex: Entender por que acorda cansada' }
    ]
  },
  {
    id: 'f_myth',
    category: 'sell',
    title: 'Mito vs Verdade',
    promise: 'Posicione seu Mecanismo Único.',
    description: 'Quebre uma crença do mercado tradicional e apresente seu método como a nova solução.',
    icon: 'Scale',
    color: 'from-orange-400 to-red-500',
    pattern: ['mito_verdade', 'conversao_direta'],
    questions: [
      { id: 'q1', label: 'Qual mito vamos destruir?', placeholder: 'Ex: Que precisa comer de 3 em 3 horas' },
      { id: 'q2', label: 'Qual a sua verdade (Mecanismo)?', placeholder: 'Ex: Jejum Estratégico (Ciclo Vital)' }
    ]
  },

  // FASE 3: CAIXA RÁPIDO E ESCALA
  {
    id: 'f7',
    category: 'caixa',
    title: 'Ativação de Base (Recuperação)',
    promise: 'Faturamento imediato com ex-clientes.',
    description: 'Scripts de WhatsApp para reativar pessoas que já conhecem seu trabalho.',
    icon: 'DollarSign',
    color: 'from-emerald-400 to-emerald-600',
    outputFormat: 'script_whatsapp',
    pattern: ['recuperacao_vendas'],
    questions: [
      { id: 'q1', label: 'Qual a oferta especial para hoje?', placeholder: 'Ex: Agenda extra para Retorno' },
      { id: 'q2', label: 'Qual o bônus de urgência?', placeholder: 'Ex: Guia de Receitas Grátis' }
    ]
  },
  {
    id: 'f9',
    category: 'scale',
    title: 'Reunião Temática',
    promise: 'Venda em massa em grupo.',
    description: 'Funil de convite para evento ao vivo (Zoom/Live). Ótimo para vender High-Ticket.',
    icon: 'TrendingUp',
    color: 'from-blue-600 to-indigo-800',
    pattern: ['conexao_valores', 'conversao_direta'],
    questions: [
      { id: 'q1', label: 'Qual o tema da reunião?', placeholder: 'Ex: O Mapa da Barriga Zerada' },
      { id: 'q2', label: 'Data e Hora?', placeholder: 'Ex: Quinta às 20h' }
    ]
  }
];

export const FONT_PAIRS = [
  { id: 'p1', title: 'Montserrat', body: 'Inter', label: 'Moderna & Limpa' },
  { id: 'p2', title: 'Playfair Display', body: 'Lora', label: 'Elegância Clássica' },
  { id: 'p3', title: 'Cinzel', body: 'Montserrat', label: 'Luxo & Autoridade' },
  { id: 'p4', title: 'Fraunces', body: 'Inter', label: 'Editorial Premium' },
];

export const COLOR_PRESETS = [
  { name: 'Seda & Café', dominant: '#FDFBF7', contrast: '#2C2520', detail: '#8B5E3C' },
  { name: 'Ouro Negro', dominant: '#121212', contrast: '#FFFFFF', detail: '#D4AF37' },
  { name: 'Natureza Profunda', dominant: '#F2F6F4', contrast: '#1A2B24', detail: '#2D4B3E' },
  { name: 'Pérola Rosé', dominant: '#FBF8F8', contrast: '#4A3E3E', detail: '#E0B1AB' },
];

export const ARCHETYPES_CONFIG: Record<Archetype, { keywords: string; goal: string; dna: any }> = {
  'Mago': { 
    keywords: 'Transformação, Alquimia', 
    goal: 'Transformar dor em vida',
    dna: { borderRadius: '40px 10px', shadow: '0 20px 50px rgba(139, 92, 246, 0.2)', effect: 'glow', recommendedFonts: ['Fraunces', 'Cinzel'] }
  },
  'Herói': { 
    keywords: 'Força, Disciplina', 
    goal: 'Vencer a obesidade',
    dna: { borderRadius: '4px', shadow: '8px 8px 0px rgba(0,0,0,0.1)', effect: 'rigid', recommendedFonts: ['Montserrat'] }
  },
  'Amante': { 
    keywords: 'Estética, Conexão', 
    goal: 'Amar o próprio corpo',
    dna: { borderRadius: '60px', shadow: '0 10px 30px rgba(224, 177, 171, 0.3)', effect: 'soft', recommendedFonts: ['Lora'] }
  },
  'Sábio': { 
    keywords: 'Clínico, Ciência', 
    goal: 'Educação Fisiológica',
    dna: { borderRadius: '0px', shadow: 'none', effect: 'clean', recommendedFonts: ['Lora'] }
  },
  'Cuidador': { 
    keywords: 'Apoio, Empatia', 
    goal: 'Cuidar da saúde',
    dna: { borderRadius: '32px', shadow: '0 4px 20px rgba(0,0,0,0.05)', effect: 'soft', recommendedFonts: ['Inter'] }
  },
  'Governante': { 
    keywords: 'Elite, Padrão', 
    goal: 'Alta performance',
    dna: { borderRadius: '12px', shadow: '0 10px 15px rgba(0,0,0,0.1)', effect: 'rigid', recommendedFonts: ['Cinzel'] }
  },
  'Criador': { keywords: '', goal: '', dna: { borderRadius: '32px', shadow: 'none', effect: 'clean', recommendedFonts: ['Inter'] } },
  'Inocente': { keywords: '', goal: '', dna: { borderRadius: '32px', shadow: 'none', effect: 'clean', recommendedFonts: ['Inter'] } },
  'Explorador': { keywords: '', goal: '', dna: { borderRadius: '32px', shadow: 'none', effect: 'clean', recommendedFonts: ['Inter'] } },
  'Rebelde': { keywords: '', goal: '', dna: { borderRadius: '32px', shadow: 'none', effect: 'clean', recommendedFonts: ['Inter'] } },
  'Comum': { keywords: '', goal: '', dna: { borderRadius: '32px', shadow: 'none', effect: 'clean', recommendedFonts: ['Inter'] } },
  'Bobo da Corte': { keywords: '', goal: '', dna: { borderRadius: '32px', shadow: 'none', effect: 'clean', recommendedFonts: ['Inter'] } }
};
