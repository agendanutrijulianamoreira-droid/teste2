
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Zap, CheckCircle2, Target, ArrowRight, Crown, Sparkles, DollarSign, 
  Activity, Brain, X, Library, Magnet, FilePlus, MessageSquareQuote, 
  BarChart3, TrendingUp, AlertTriangle, Share2, Rocket, Loader2, Copy, Send,
  Users, MousePointer2, ShieldCheck, Flame, Download
} from 'lucide-react';
import { DailyTask, Post, FunnelMetric, UserProfile, Material, VipWeek, Challenge } from '../types';
import { generateMonthlyStrategyOrchestration, generateChallengeStructure } from '../services/geminiService';
import PlannerGuard from '../components/PlannerGuard';

interface DashboardProps {
  onStartSmartPlanner: () => void;
  onNavigateToCalendar: () => void;
  onOpenCreatePost: () => void;
  onNavigateToFunnels: () => void;
  onNavigateToMaterials: () => void;
  onNavigateToLive: () => void;
  onNavigateToConnections: () => void;
  onOpenPerformanceWizard: () => void;
  setActivePage: (page: string) => void;
  tasks: DailyTask[];
  toggleTask: (id: string) => void;
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>; 
  setMaterials: React.Dispatch<React.SetStateAction<Material[]>>; 
  setVipPlan: React.Dispatch<React.SetStateAction<VipWeek[]>>; 
  challenges: Challenge[];
  setChallenges: React.Dispatch<React.SetStateAction<Challenge[]>>;
  metrics: FunnelMetric[];
  profile: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  onStartSmartPlanner, 
  onNavigateToCalendar, 
  onOpenCreatePost,
  onNavigateToFunnels,
  onNavigateToMaterials,
  onNavigateToLive,
  onOpenPerformanceWizard,
  setActivePage,
  tasks, 
  toggleTask, 
  posts,
  setPosts,
  setMaterials,
  setVipPlan,
  challenges,
  setChallenges,
  metrics,
  profile
}) => {
  const [isGeneratingMonth, setIsGeneratingMonth] = useState(false);
  const [genStep, setGenStep] = useState(0);
  const [isExporting, setIsExporting] = useState(false); // State for PDF export

  const generationChecklist = [
    "Analisando Posicionamento e Inimigo Comum...",
    "Estruturando Funil Híbrido (Desafio -> Mentoria)...",
    "Roteirizando 30 dias de Conteúdo Editorial...",
    "Criando scripts exclusivos para Lista VIP...",
    "Construindo Missões do Desafio de Entrada...",
    "Finalizando orquestração do Command Center..."
  ];

  const totalRevenue = metrics.reduce((acc, m) => acc + (m.revenueGenerated || 0), 0);
  const goalProgress = profile.financialGoal ? Math.min((totalRevenue / profile.financialGoal) * 100, 100) : 0;

  const handleExportStrategy = () => {
    setIsExporting(true);
    const element = document.getElementById('war-room-container');
    if (!element) return;

    const opt = {
      margin: 5,
      filename: `Dossie_Estrategico_${profile.fullName.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };

    // @ts-ignore
    window.html2pdf().from(element).set(opt).save().then(() => {
      setIsExporting(false);
    });
  };

  const handleAutoPilotActivation = async () => {
    if (!profile.productLadder) return;
    setIsGeneratingMonth(true);
    setGenStep(0);

    const stepInterval = setInterval(() => {
      setGenStep(prev => (prev < generationChecklist.length - 1 ? prev + 1 : prev));
    }, 3500);

    try {
      const prod1 = profile.productLadder.tripwire.name;
      const prod2 = profile.productLadder.high_ticket.name;
      
      // 1. Orquestração Base (Posts, VIP, Isca)
      const plan = await generateMonthlyStrategyOrchestration(profile, prod1, prod2);
      
      // 2. Geração do Desafio (Novo passo para garantir full scope)
      const challengeStructure = await generateChallengeStructure(profile, {
          title: prod1,
          duration: 21,
          pillar: profile.uniqueMechanism,
          highTicketOffer: prod2
      });

      if (plan) {
        clearInterval(stepInterval);
        setGenStep(generationChecklist.length - 1);
        
        // --- POVOAMENTO DOS MATERIAIS ---
        if (plan.digital_bait) {
          const newMaterial: Material = {
            id: `bait-${Date.now()}`,
            userId: profile.id,
            title: plan.digital_bait.title,
            type: 'guide',
            mode: 'auto',
            pages: [
              { type: 'cover', title: plan.digital_bait.title, content: 'Sua nova isca digital de autoridade.' },
              { type: 'content', title: 'Visão Geral', content: plan.digital_bait.outline }
            ],
            createdAt: new Date().toISOString()
          };
          setMaterials(prev => [newMaterial, ...prev]);
        }

        // --- POVOAMENTO DOS POSTS ---
        const newFeedPosts: Post[] = [];
        const today = new Date();
        if (plan.feed_posts) {
          plan.feed_posts.forEach((post, index) => {
            newFeedPosts.push({
              id: `auto-post-${index}-${Date.now()}`,
              userId: profile.id,
              scheduledDate: new Date().toISOString(),
              calendarIndex: today.getDate() + index + 3,
              status: 'draft',
              strategyType: 'autoridade_clinica',
              format: 'carousel',
              content: { title: post.title, caption: post.caption, slides: post.slides },
              batchId: `auto-month-${today.getTime()}`,
              batchTitle: 'Piloto Automático'
            });
          });
        }
        setPosts(prev => [...prev, ...newFeedPosts]);

        // --- POVOAMENTO DA LISTA VIP ---
        if (plan.vip_messages) {
          const newVipWeeks: VipWeek[] = plan.vip_messages.map(msg => ({
            week: msg.week,
            type: msg.type as 'CONTENT' | 'OFFER',
            headline: 'Mensagem Orquestrada',
            association: 'Piloto Automático',
            script: msg.text,
            status: 'pending'
          }));
          setVipPlan(newVipWeeks);
        }

        // --- POVOAMENTO DO DESAFIO ---
        if (challengeStructure) {
            const newChallenge: Challenge = {
                id: `auto-challenge-${Date.now()}`,
                userId: profile.id,
                title: prod1,
                duration: 21,
                price: String(profile.productLadder.tripwire.price),
                pillar: profile.uniqueMechanism,
                gamification: true,
                launchStrategy: challengeStructure.launch_strategy.map((ls: any) => ({
                    day: String(ls.day),
                    script: ls.script
                })),
                dailyMissions: challengeStructure.daily_missions.map((dm: any) => ({
                    day: dm.day,
                    theme: dm.theme,
                    morning_script: dm.morning_script,
                    night_script: dm.night_script,
                    gamification_points: dm.gamification_points,
                    mentor_tip: dm.description,
                    image_prompt: dm.image_prompt
                })),
                createdAt: new Date().toISOString()
            };
            setChallenges(prev => [newChallenge, ...prev]);
        }

        setTimeout(() => onNavigateToCalendar(), 1500);
      }
    } catch (e) {
      console.error(e);
      clearInterval(stepInterval);
      alert("Erro na orquestração. Verifique sua conexão e tente novamente.");
    } finally {
      setIsGeneratingMonth(false);
    }
  };

  return (
    <div id="war-room-container" className="space-y-16 animate-in fade-in duration-1000 pb-32">
      
      {/* OVERLAY DE CARREGAMENTO PROGRESSIVO LUXURY */}
      {isGeneratingMonth && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-2xl z-[500] flex flex-col items-center justify-center p-12 text-center">
            <div className="relative mb-16">
               <Loader2 size={100} className="animate-spin text-gray-900" strokeWidth={1} />
               <Sparkles className="absolute inset-0 m-auto text-[#D4AF37]" size={32} />
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-8 font-serif">Orquestrando Império Digital</h2>
            <div className="space-y-4 max-w-md w-full">
               {generationChecklist.map((step, idx) => (
                  <div key={idx} className={`flex items-center gap-4 transition-all duration-700 ${idx <= genStep ? 'opacity-100 translate-x-0' : 'opacity-20 -translate-x-4'}`}>
                     <div className={`w-5 h-5 rounded-full flex items-center justify-center ${idx < genStep ? 'bg-[#065F46] text-white' : idx === genStep ? 'bg-[#D4AF37] animate-pulse' : 'bg-gray-100'}`}>
                        {idx < genStep && <CheckCircle2 size={12} />}
                     </div>
                     <span className={`text-sm font-bold tracking-tight ${idx === genStep ? 'text-gray-900' : 'text-gray-400'}`}>{step}</span>
                  </div>
               ))}
            </div>
        </div>
      )}

      {/* HEADER WAR ROOM */}
      <section className="flex flex-col lg:flex-row gap-10 items-stretch">
        <div className="flex-1 bg-white rounded-[48px] p-12 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-between">
           <div className="absolute top-0 right-0 p-12 opacity-[0.02]"><BarChart3 size={280} /></div>
           <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-start">
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">War Room Dashboard</span>
                 {profile.productLadder && (
                   <button 
                     onClick={handleExportStrategy}
                     disabled={isExporting}
                     className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all"
                   >
                     {isExporting ? <Loader2 className="animate-spin" size={14}/> : <Download size={14} />} {isExporting ? 'Baixando...' : 'Baixar Dossiê PDF'}
                   </button>
                 )}
              </div>
              <h1 className="text-6xl font-black text-gray-900 leading-tight tracking-tighter font-serif">
                {profile.fullName.split(' ')[0]} <br />
                <span className="text-[#D4AF37]">Executive Control</span>
              </h1>
              <p className="text-gray-400 font-medium text-xl max-w-lg leading-relaxed">
                Sua operação está calibrada para atingir <span className="text-gray-900 font-black">R$ {profile.financialGoal?.toLocaleString()}</span> este mês.
              </p>
           </div>
           
           <div className="mt-16 grid grid-cols-3 gap-10 relative z-10">
              <div className="space-y-2">
                 <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Leads em Potencial</p>
                 <p className="text-4xl font-black text-gray-900 tabular-nums">482</p>
              </div>
              <div className="space-y-2">
                 <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Conversão Isca</p>
                 <p className="text-4xl font-black text-gray-900 tabular-nums">12%</p>
              </div>
              <div className="space-y-2">
                 <p className="text-[9px] font-black text-[#D4AF37] uppercase tracking-widest">Cashflow Hoje</p>
                 <p className="text-4xl font-black text-gray-900 tabular-nums">R$ {totalRevenue.toLocaleString()}</p>
              </div>
           </div>
        </div>

        <div className="w-full lg:w-[420px] bg-gray-950 rounded-[48px] p-12 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group">
           <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#D4AF37] rounded-full blur-[120px] opacity-10" />
           <div className="space-y-4">
              <div className="flex justify-between items-center">
                 <h3 className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.4em]">Progresso da Meta</h3>
                 <span className="text-xs font-bold opacity-40">Monthly GPS</span>
              </div>
              <p className="text-7xl font-black tabular-nums tracking-tighter">{goalProgress.toFixed(0)}<span className="text-3xl font-light opacity-30">%</span></p>
           </div>
           <div className="space-y-8">
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-[#D4AF37] shadow-[0_0_20px_#D4AF37] transition-all duration-1000" style={{ width: `${goalProgress}%` }} />
              </div>
              <button onClick={onOpenPerformanceWizard} className="w-full py-5 bg-white text-gray-900 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all hover:bg-[#D4AF37] hover:text-white group flex items-center justify-center gap-3">
                 Registrar Resultados <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
           </div>
        </div>
      </section>

      {/* PLANNER GUARD ESTRATÉGICO */}
      <section>
         <PlannerGuard 
           profile={profile} 
           onNavigate={setActivePage} 
           onUnlockedAction={handleAutoPilotActivation} 
         />
      </section>

      {/* OPERAÇÃO DIÁRIA & IA INSIGHT */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
           <header className="flex justify-between items-center px-4">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2">
                <Flame size={16} className="text-[#D4AF37]" /> Prioridades do Dia
              </h3>
           </header>
           <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                 <div className="space-y-8">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest border-b pb-4">Checklist Operacional</p>
                    <div className="space-y-6">
                       {tasks.map(task => (
                          <div key={task.id} className="flex items-center gap-6 group/task cursor-pointer">
                             <button onClick={() => toggleTask(task.id)} className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-[#065F46] border-[#065F46] text-white' : 'border-gray-100 bg-gray-50 group-hover/task:border-[#D4AF37]'}`}>
                                {task.completed && <CheckCircle2 size={16} />}
                             </button>
                             <span className={`text-sm font-bold tracking-tight transition-all ${task.completed ? 'text-gray-300 line-through' : 'text-gray-700'}`}>{task.label}</span>
                          </div>
                       ))}
                    </div>
                 </div>
                 <div className="bg-gray-50 rounded-[40px] p-10 border border-gray-100 relative overflow-hidden flex flex-col justify-between">
                    <div className="space-y-4 relative z-10">
                       <div className="flex items-center gap-2">
                          <Brain size={20} className="text-[#D4AF37]" />
                          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">IA Strategic Insight</h4>
                       </div>
                       <p className="text-lg font-bold text-gray-800 leading-relaxed font-serif italic">
                          "Dra., os dados mostram que sua audiência reage 40% melhor a conteúdos que atacam o 'Inimigo Comum' nas terças-feiras. Recomendo dobrar a aposta em stories de indignação hoje."
                       </p>
                    </div>
                    <button onClick={onNavigateToLive} className="mt-10 py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 group">
                       Consultar Mentor IA <Zap size={14} className="text-[#D4AF37]" />
                    </button>
                 </div>
              </div>
           </div>
        </div>

        <div className="space-y-10">
           <header className="px-4">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2">
                <Magnet size={16} className="text-emerald-600" /> Distribuição de Isca
              </h3>
           </header>
           <div className="bg-white rounded-[40px] border border-gray-100 p-10 shadow-sm space-y-10 group hover:shadow-2xl transition-all duration-700">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                <Magnet size={40} />
              </div>
              <div className="space-y-2">
                 <h4 className="font-black text-gray-900 text-2xl tracking-tight">Active Bait System</h4>
                 <p className="text-sm text-gray-400 font-medium leading-relaxed">Seu material gratuito está rodando. Pronto para extrair o Kit de Stories validado para hoje?</p>
              </div>
              <button onClick={onNavigateToMaterials} className="w-full py-5 bg-gray-900 text-white rounded-[20px] font-black uppercase tracking-widest text-[10px] hover:bg-emerald-700 transition-colors">
                 Acessar Distribuição
              </button>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
