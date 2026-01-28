export type Archetype = 
  | 'Mago' | 'Herói' | 'Amante' | 'Sábio' | 'Cuidador' | 'Governante' 
  | 'Criador' | 'Inocente' | 'Explorador' | 'Rebelde' | 'Comum' | 'Bobo da Corte';

export type StrategyType = 
  | 'conversao_direta' // Antiga "Levantada de Mão" (Vendas)
  | 'conexao_valores' // Antiga "Posicionamento Incomum" (Conexão)
  | 'autoridade_clinica' // Antiga "Conteúdo Técnico" (Autoridade)
  | 'mito_verdade' // Quebra de Objeção
  | 'mini_treinamento' // Formato específico de educação rápida
  | 'stories_consultivo' // Diagnóstico para venda
  | 'lifestyle' 
  | 'pesquisa_audiencia' 
  | 'recuperacao_vendas';

export type DocType = 'Social' | 'Apresentação' | 'Documento' | 'Página da Web';
export type PostFormat = 'carousel' | 'reels' | 'static' | 'stories' | 'script_whatsapp' | 'roteiro_stories';
export type MaterialType = 'checklist' | 'guide' | 'recipe';
export type LayoutVariant = 'classic' | 'bold' | 'editorial';
export type PostTemplate = 'clinical_journal' | 'modern_tweet' | 'dark_aesthetic';
export type CreationMode = 'manual' | 'copilot' | 'auto';
export type AudacityLevel = 'educativa' | 'inspiradora' | 'provocativa' | 'acolhedora' | 'cientifica' | 'pragmatica' | 'exclusiva';
export type FunnelCategory = 'start' | 'sell' | 'scale' | 'caixa';

export interface FunnelMetric {
  id: string;
  batchId?: string;
  date: string;
  label: string; 
  salesCount: number;
  revenueGenerated: number;
  strategyUsed?: string;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  amount: number;
  date: string;
  clientName?: string;
}

export interface ProductDetail {
  id: string;
  name: string;
  promise: string;
  price: number;
  type: 'lead_magnet' | 'tripwire' | 'high_ticket' | 'downsell' | 'recurring';
  orderBumpIdea?: string;
  isActive: boolean;
}

export interface ProductLadder {
  lead_magnet: ProductDetail;
  tripwire: ProductDetail;
  high_ticket: ProductDetail;
  downsell: ProductDetail;
  recurring: ProductDetail;
}

export interface FinancialGoal {
  monthly: number;
  quarterly: number;
  annual: number;
}

export interface WeeklyReport {
  id: string;
  weekNumber: number;
  startDate: string;
  summary: string;
  automation: string;
  expectation: string;
  focusProduct: string;
}

export interface ChallengeLaunchScript {
  day: string;
  script: string;
}

export interface ChallengeDay {
  day: number;
  theme: string;
  morning_script: string;
  night_script: string;
  gamification_points: number;
  mentor_tip?: string;
  image_prompt?: string;
  card_image_url?: string;
}

export interface Challenge {
  id: string;
  userId: string;
  title: string;
  duration: number;
  price: string;
  pillar: string;
  gamification: boolean;
  reward?: string;
  launchStrategy: ChallengeLaunchScript[];
  dailyMissions: ChallengeDay[];
  createdAt: string;
}

export type VipCycle = 'content' | 'offer';

export interface VipMessageConfig {
  cycle: VipCycle;
  headline: string;
  topic: string;
  association: string;
}

export interface VipWeek {
  week: number;
  type: 'CONTENT' | 'OFFER';
  headline: string;
  association: string;
  script: string;
  productName?: string;
  status: 'pending' | 'sent';
}

export interface MonthlyOrchestration {
  digital_bait: {
    title: string;
    outline: string;
  };
  feed_posts: Array<{
    week: number;
    day: string;
    title: string;
    caption: string;
    slides: Array<{ text: string; imagePrompt: string }>;
  }>;
  stories: Array<{
    day: number;
    theme: string;
    script: string;
  }>;
  reels: Array<{
    week: number;
    hook: string;
    script: string;
  }>;
  vip_messages: Array<{
    week: number;
    type: 'CONTENT' | 'OFFER';
    text: string;
  }>;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface UserProfile {
  id: string;
  fullName: string;
  specialty: string;
  instagramHandle: string;
  targetAudience: string;
  promise90Days: string;
  uniqueMechanism: string;
  commonEnemy: string;
  archetype: Archetype;
  productLadder?: ProductLadder;
  personalPhotos?: string[];
  services?: Service[];
  financialGoal?: number;
  ayrshareProfileKey?: string;
  isInstagramConnected?: boolean;
  instagramError?: string;
  monthlyImageCredits: number;
}

export interface BrandSettings {
  logoUrl?: string;
  fontTitle: string;
  fontBody: string;
  colorPrimary: string;
  colorContrast: string;
  colorDetail: string;
  colorBackground: string;
  colorText: string;
}

export interface CarouselSlide {
  text: string;
  imagePrompt?: string;
  imageUrl?: string;
  isVideo?: boolean;
}

export interface Post {
  id: string;
  userId: string;
  scheduledDate: string;
  calendarIndex?: number;
  status: 'planned' | 'draft' | 'ready' | 'published';
  strategyType: StrategyType;
  format: PostFormat;
  layoutVariant?: LayoutVariant;
  templateVariant?: PostTemplate;
  toneIntensity?: AudacityLevel;
  batchId?: string;
  batchTitle?: string;
  content: {
    title: string;
    slides?: CarouselSlide[];
    caption?: string;
    script?: string;
  };
}

export interface DailyTask {
  id: string;
  label: string;
  completed: boolean;
  category: 'content' | 'engagement' | 'sales';
}

export interface SavedFunnel {
  id: string;
  userId: string;
  title: string;
  contentMarkdown: string;
  createdAt: string;
}

export interface Material {
  id: string;
  userId: string;
  title: string;
  type: MaterialType;
  mode: CreationMode;
  pages: any[];
  createdAt: string;
}

export interface FunnelBlueprint {
  id: string;
  category: FunnelCategory;
  title: string;
  promise: string;
  description: string;
  icon: string;
  color: string;
  pattern: StrategyType[];
  isLeadMagnet?: boolean;
  hasWhatsapp?: boolean;
  outputFormat?: PostFormat;
}

export interface SavedStrategy {
  id: string;
  type: string;
  title: string;
  content: string;
  createdAt: string;
}