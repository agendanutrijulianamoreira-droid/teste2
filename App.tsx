
import React, { useState, useEffect } from 'react';
import { UserProfile, BrandSettings, Post, Material, SavedStrategy, SavedFunnel, DailyTask, FunnelMetric, WeeklyReport, VipWeek, Sale, Challenge } from './types';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Funnels from './pages/Funnels';
import BrandHub from './pages/BrandHub';
import BusinessLab from './pages/BusinessLab';
import Calendar from './pages/Calendar';
import LiveSupport from './pages/LiveSupport';
import FinancialGPS from './pages/FinancialGPS';
import MaterialsLibrary from './pages/MaterialsLibrary';
import Connections from './pages/Connections';
import ChallengeCreator from './pages/ChallengeCreator';
import VipListManager from './pages/VipListManager'; 
import { generatePostContent, generateStrategyResponse } from './services/geminiService';
import { Key, X, ArrowRight, CheckCircle2, AlertTriangle, ShieldAlert, Sparkles, Flame, Target, MessageSquare, DollarSign, Plus, Loader2, Wallet, Crown, Zap, LifeBuoy, Copy, ShieldCheck } from 'lucide-react';

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio?: AIStudio;
  }
}

const App: React.FC = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [initialShowSmartPlanner, setInitialShowSmartPlanner] = useState(false);
  const [initialShowCreate, setInitialShowCreate] = useState(false);
  
  // ESTADOS GLOBAIS DE ATIVOS (A FÁBRICA)
  const [posts, setPosts] = useState<Post[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [vipPlan, setVipPlan] = useState<VipWeek[]>([]); 
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  
  const [savedFunnels, setSavedFunnels] = useState<SavedFunnel[]>([]);
  const [weeklyReports, setWeeklyReports] = useState<WeeklyReport[]>([]);
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [sales, setSales] = useState<Sale[]>([]);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [objectionInput, setObjectionInput] = useState('');
  const [sosResponse, setSosResponse] = useState('');
  const [isGeneratingSOS, setIsGeneratingSOS] = useState(false);
  const [metrics, setMetrics] = useState<FunnelMetric[]>([]);
  const [showPerformanceWizard, setShowPerformanceWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardData, setWizardData] = useState<Partial<FunnelMetric>>({ salesCount: 0, revenueGenerated: 0 });
  
  const [tasks, setTasks] = useState<DailyTask[]>([
    { id: 't1', label: 'Postar o Story de Autoridade', completed: false, category: 'content' },
    { id: 't2', label: 'Responder as Dúvidas da Lista VIP', completed: false, category: 'engagement' },
    { id: 't3', label: 'Enviar Proposta Mentoria (3 leads)', completed: false, category: 'sales' },
  ]);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const [profile, setProfile] = useState<UserProfile>({
    id: 'u1', 
    fullName: 'Dra. Nutricionista', 
    specialty: 'Nutrição Clínica Estratégica', 
    instagramHandle: 'seu_instagram',
    targetAudience: 'Pessoas buscando saúde real', 
    promise90Days: '', 
    uniqueMechanism: '',
    commonEnemy: '',
    archetype: 'Sábio', 
    personalPhotos: [], 
    financialGoal: 15000,
    isInstagramConnected: false,
    monthlyImageCredits: 50,
    productLadder: undefined // Inicia vazio para forçar o setup
  });

  const [brand, setBrand] = useState<BrandSettings>({
    fontTitle: 'Playfair Display', 
    fontBody: 'Inter', 
    colorPrimary: '#D4AF37', 
    colorBackground: '#FDFBF7', 
    colorText: '#121212', 
    colorContrast: '#121212', 
    colorDetail: '#D4AF37'
  });

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(selected);
      } else { setHasApiKey(true); }
    };
    checkKey();
  }, []);

  const handleRegisterSale = (saleData: Omit<Sale, 'id'>) => {
    const newSale: Sale = {
      ...saleData,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString()
    };
    setSales(prev => [newSale, ...prev]);
    setShowSaleModal(false);
  };

  const handleSOSAction = async () => {
    if (!objectionInput) return;
    setIsGeneratingSOS(true);
    setSosResponse('');
    try {
      const response = await generateStrategyResponse(profile, 'objection_killer', { objectionText: objectionInput });
      setSosResponse(response);
    } catch (e) {
      console.error(e);
      setSosResponse("Erro ao processar. Tente novamente.");
    } finally {
      setIsGeneratingSOS(false);
    }
  };

  const handleSaveMetrics = () => {
    const newMetric: FunnelMetric = {
      id: Math.random().toString(36).substr(2, 9),
      batchId: wizardData.batchId,
      date: new Date().toISOString(),
      label: wizardData.label || `Ciclo ${metrics.length + 1}`,
      salesCount: wizardData.salesCount || 0,
      revenueGenerated: wizardData.revenueGenerated || 0
    };
    setMetrics(prev => [...prev, newMetric]);
    setWizardStep(3);
  };

  const openPerformanceWizard = (batchId?: string, batchTitle?: string) => {
    setWizardData({ batchId, label: batchTitle, salesCount: 0, revenueGenerated: 0 });
    setWizardStep(1);
    setShowPerformanceWizard(true);
  };

  const updateProfile = (p: Partial<UserProfile>) => setProfile(prev => ({...prev, ...p}));

  // --- DEMO LOADER: NICHO MENOPAUSA ---
  const loadMenopauseDemo = () => {
    // 1. Perfil da Dra. Elena Ramos
    const demoProfile: Partial<UserProfile> = {
        fullName: 'Dra. Elena Ramos',
        specialty: 'Saúde da Mulher & Menopausa',
        instagramHandle: 'dra.elenaramos.menopausa',
        targetAudience: 'Mulheres 45+ com fogachos e ganho de peso',
        promise90Days: 'Recupere sua energia, libido e cintura em 12 semanas sem reposição sintética.',
        uniqueMechanism: 'Protocolo Hormônio Natural (PHN)',
        commonEnemy: 'A normalização do sofrimento e remédios genéricos',
        financialGoal: 25000,
        archetype: 'Cuidador',
        productLadder: {
            lead_magnet: { id: 'p1', name: 'Manual do Alívio dos Fogachos', type: 'lead_magnet', price: 0, promise: 'Alívio natural em 24h', isActive: true },
            tripwire: { id: 'p2', name: 'Desafio 14 Dias: Resgate Metabólico', type: 'tripwire', price: 97, promise: 'Desinflamar e dormir melhor', isActive: true },
            high_ticket: { id: 'p3', name: 'Mentoria Menopausa Plena', type: 'high_ticket', price: 1500, promise: 'Protocolo completo de 90 dias', isActive: true },
            recurring: { id: 'p4', name: 'Clube Mulher Vital', type: 'recurring', price: 97, promise: 'Manutenção e Comunidade', isActive: true },
            downsell: { id: 'p5', name: 'Guia de Suplementação 45+', type: 'downsell', price: 47, promise: 'Lista de compras essencial', isActive: true }
        }
    };
    setProfile(prev => ({ ...prev, ...demoProfile }));

    // 2. Isca Digital (Material)
    const demoMaterial: Material = {
        id: 'demo-bait-1',
        userId: 'demo',
        title: 'Guia Anti-Fogacho 24h',
        type: 'guide',
        mode: 'auto',
        createdAt: new Date().toISOString(),
        pages: [
            { type: 'cover', title: 'Adeus Calorão', content: 'Guia prático para alívio imediato dos fogachos sem hormônios.' },
            { type: 'intro', title: 'O Mecanismo do Calor', content: 'Entenda por que seu termostato interno quebrou e como o chá de sálvia pode consertá-lo.' },
            { type: 'content', title: 'Receita do Shot Matinal', content: '1. Cúrcuma\n2. Pimenta Preta\n3. Própolis\n\nBeba em jejum para desinflamar.' }
        ]
    };
    setMaterials([demoMaterial]);

    // 3. Desafio 14 Dias (Challenge)
    const demoChallenge: Challenge = {
        id: 'demo-chal-1',
        userId: 'demo',
        title: 'Desafio 14 Dias: Resgate Metabólico',
        duration: 14,
        price: '97',
        pillar: 'Desinflamação Natural',
        gamification: true,
        createdAt: new Date().toISOString(),
        launchStrategy: [
            { day: 'Antecipação 1', script: 'Meninas, cansei de ver vocês sofrendo. Vem aí algo novo.' },
            { day: 'Venda', script: 'Inscrições Abertas: Apenas R$ 97 para mudar sua vida em 2 semanas.' }
        ],
        dailyMissions: Array.from({ length: 14 }).map((_, i) => ({
            day: i + 1,
            theme: i === 0 ? 'Detox do Açúcar' : i === 13 ? 'Celebração' : `Dia ${i + 1} do Resgate`,
            morning_script: `Bom dia Flor! Hoje o foco é ${i === 0 ? 'cortar o veneno branco' : 'manter o ritmo'}.`,
            night_script: 'Como foi seu dia? Postem foto do prato!',
            gamification_points: 10,
            mentor_tip: 'Lembre-se: a constância vence a intensidade.'
        }))
    };
    setChallenges([demoChallenge]);

    // 4. Lista VIP (1 Mês)
    const demoVipPlan: VipWeek[] = [
        { week: 1, type: 'CONTENT', headline: 'Por que você engorda na barriga?', association: 'O pneu de estepe que salva sua vida', script: 'Áudio explicativo sobre cortisol x insulina.', status: 'pending' },
        { week: 2, type: 'OFFER', headline: 'Convite para o Resgate', association: 'A boia salva-vidas', script: 'Link para o desafio de R$ 97.', status: 'pending' },
        { week: 3, type: 'CONTENT', headline: 'Libido tem jeito?', association: 'Acendendo a fogueira molhada', script: 'Dicas sobre maca peruana e tribulus.', status: 'pending' },
        { week: 4, type: 'OFFER', headline: 'Vagas da Mentoria', association: 'Primeira Classe', script: 'Aplicação para acompanhamento individual.', status: 'pending' }
    ];
    setVipPlan(demoVipPlan);

    // 5. Brand Colors (Tons de Menopausa/Feminino Sóbrio)
    setBrand({
        fontTitle: 'Playfair Display',
        fontBody: 'Lato',
        colorPrimary: '#9F7AEA', // Roxo suave
        colorBackground: '#FAF5FF',
        colorText: '#44337A',
        colorContrast: '#FFFFFF',
        colorDetail: '#D53F8C' // Rosa
    });

    setActivePage('dashboard');
    alert("✨ Ambiente configurado para Dra. Elena Ramos (Nicho Menopausa). Tudo pronto!");
  };

  return (
    <Layout activePage={activePage} setActivePage={setActivePage}>
      {activePage === 'dashboard' && (
        <Dashboard 
          onStartSmartPlanner={() => { setInitialShowSmartPlanner(true); setActivePage('calendar'); }}
          onNavigateToCalendar={() => setActivePage('calendar')}
          onOpenCreatePost={() => { setInitialShowCreate(true); setActivePage('calendar'); }}
          onOpenPerformanceWizard={() => openPerformanceWizard()}
          onNavigateToFunnels={() => setActivePage('funnels')}
          onNavigateToMaterials={() => setActivePage('materials')}
          onNavigateToLive={() => setActivePage('live')}
          onNavigateToConnections={() => setActivePage('connections')}
          setActivePage={setActivePage}
          tasks={tasks} toggleTask={toggleTask} 
          posts={posts} setPosts={setPosts}
          setMaterials={setMaterials}
          setVipPlan={setVipPlan}
          challenges={challenges}
          setChallenges={setChallenges}
          metrics={metrics} profile={profile}
        />
      )}
      {activePage === 'business-lab' && (
        <BusinessLab 
          profile={profile} 
          updateProfile={updateProfile} 
          setActivePage={setActivePage} 
          setPosts={setPosts} 
          setWeeklyReports={setWeeklyReports}
          onLoadDemo={loadMenopauseDemo} // Passing the demo function
        />
      )}
      {activePage === 'challenges' && (
        <ChallengeCreator 
          profile={profile} 
          challenges={challenges} 
          setChallenges={setChallenges} 
        />
      )}
      {activePage === 'vip-list' && (
        <VipListManager 
          profile={profile} 
          vipPlan={vipPlan} 
          setVipPlan={setVipPlan} 
        />
      )}
      {activePage === 'funnels' && (
        <Funnels 
          profile={profile} 
          posts={posts} 
          setPosts={setPosts} 
          materials={materials} 
          setActivePage={setActivePage} 
          savedFunnels={savedFunnels} 
          setSavedFunnels={setSavedFunnels} 
        />
      )}
      {activePage === 'calendar' && (
        <Calendar 
          profile={profile} brand={brand} posts={posts} setPosts={setPosts} 
          metrics={metrics} weeklyReports={weeklyReports} onOpenPerformanceWizard={openPerformanceWizard}
          initialShowSmartPlanner={initialShowSmartPlanner} initialShowCreate={initialShowCreate}
          clearInitialTriggers={() => { setInitialShowSmartPlanner(false); setInitialShowCreate(false); }}
        />
      )}
      {activePage === 'materials' && <MaterialsLibrary materials={materials} setMaterials={setMaterials} profile={profile} brand={brand} />}
      {activePage === 'brand' && <BrandHub profile={profile} brand={brand} updateProfile={updateProfile} updateBrand={(b) => setBrand(prev => ({...prev, ...b}))} />}
      {activePage === 'live' && <LiveSupport posts={posts} setPosts={setPosts} profile={profile} />}
      {activePage === 'billing' && <FinancialGPS profile={profile} sales={sales} onRegisterSale={handleRegisterSale} updateProfile={updateProfile} />}

      {/* SOS VENDA & FLOATING BUTTONS - REFINADOS LUXURY */}
      <button 
        onClick={() => { setShowSOSModal(true); setSosResponse(''); }}
        className="fixed bottom-10 right-36 w-16 h-16 bg-red-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[100]"
      >
         <LifeBuoy size={28} />
      </button>

      <button 
        onClick={() => setShowSaleModal(true)}
        className="fixed bottom-10 right-10 w-20 h-20 bg-gray-950 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[100] border-4 border-white"
      >
         <DollarSign size={32} className="text-[#D4AF37]" />
      </button>

      {/* MODAL SOS VENDA */}
      {showSOSModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[600] flex items-center justify-center p-6 animate-in fade-in">
           <div className="bg-white rounded-[48px] w-full max-w-xl overflow-hidden shadow-2xl relative animate-in zoom-in-95">
              <header className="p-8 border-b bg-gray-50 flex justify-between items-center">
                 <h3 className="text-xl font-black font-serif">Destruidor de Objeções IA</h3>
                 <button onClick={() => setShowSOSModal(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
              </header>
              <div className="p-10 space-y-8">
                 {!sosResponse ? (
                   <div className="space-y-6">
                      <textarea 
                        rows={4} value={objectionInput} onChange={e => setObjectionInput(e.target.value)}
                        placeholder="Ex: 'Vou pensar e te aviso...'"
                        className="w-full p-8 bg-gray-50 rounded-3xl border-none outline-none font-bold text-gray-700"
                      />
                      <button onClick={handleSOSAction} disabled={isGeneratingSOS} className="w-full py-6 bg-gray-950 text-white rounded-3xl font-black uppercase tracking-widest text-sm shadow-xl flex items-center justify-center gap-3">
                         {isGeneratingSOS ? <Loader2 className="animate-spin" /> : <Zap size={18} className="text-[#D4AF37]" />}
                         {isGeneratingSOS ? 'Processando...' : 'Gerar Resposta High-Ticket'}
                      </button>
                   </div>
                 ) : (
                   <div className="space-y-8 animate-in zoom-in-95">
                      <div className="bg-gray-50 p-8 rounded-[32px] border border-gray-100 relative group">
                         <div className="text-gray-900 font-bold leading-relaxed whitespace-pre-wrap text-lg font-serif italic">"{sosResponse}"</div>
                         <button onClick={() => { navigator.clipboard.writeText(sosResponse); alert('Copiado!'); }} className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase text-emerald-600 tracking-widest"><Copy size={12}/> Copiar Script</button>
                      </div>
                      <button onClick={() => setSosResponse('')} className="w-full py-4 text-gray-400 font-black uppercase tracking-widest text-[10px]">Tentar outro ângulo</button>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
