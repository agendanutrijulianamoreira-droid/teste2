
import React, { useState, useMemo } from 'react';
import { Post, UserProfile, WeeklyReport, ProductLadder, ProductDetail } from '../types';
import { generateProductLadder } from '../services/geminiService';
import { ArrowRight, Wand2, Loader2, Target, CheckCircle2, Package, Sparkles, User, RefreshCw, Trophy, Crown, Calendar as CalendarIcon, Gift, Zap, DollarSign, Magnet, History, Repeat, PlusCircle, PenTool, Eye, Check, Rocket, ShieldAlert, Ban, TrendingUp, Paperclip } from 'lucide-react';

interface BusinessLabProps {
  profile: UserProfile;
  updateProfile: (p: Partial<UserProfile>) => void;
  setActivePage: (page: string) => void;
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  setWeeklyReports: React.Dispatch<React.SetStateAction<WeeklyReport[]>>;
  onLoadDemo?: () => void; // New prop
}

const BusinessLab: React.FC<BusinessLabProps> = ({ profile, updateProfile, setActivePage, setPosts, setWeeklyReports, onLoadDemo }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [rawInput, setRawInput] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  
  // States para o Lab 5.0
  const [problem, setProblem] = useState(profile.promise90Days || '');
  const [pillars, setPillars] = useState(profile.uniqueMechanism || '');
  const [goal, setGoal] = useState(profile.financialGoal || 15000);

  const steps = [
    { id: 1, title: 'Posicionamento', icon: <Target />, desc: 'O Problema de 90 Dias e seus Pilares.' },
    { id: 2, title: 'Meta Financeira', icon: <DollarSign />, desc: 'Quanto você quer faturar nos próximos 30 dias?' },
    { id: 3, title: 'Império Digital', icon: <Package />, desc: 'A Esteira Híbrida de Lucro.' },
  ];

  const handleMagicRefine = async () => {
    setLoading(true);
    setLoadingText("Orquestrando seu Império...");
    try {
       const result = await generateProductLadder({ ...profile, promise90Days: problem, uniqueMechanism: pillars, financialGoal: goal });
       if (result) {
          // Helper para encontrar produtos de forma resiliente (case insensitive ou por posição)
          const findProduct = (expectedType: string, fallbackIndex: number, defaultName: string, defaultPrice: number) => {
             const found = result.products.find((p: any) => 
               p.type?.toLowerCase().includes(expectedType.toLowerCase()) || 
               p.type?.toLowerCase().replace('_', '').includes(expectedType.toLowerCase().replace('_', ''))
             );
             return found || result.products[fallbackIndex] || { name: defaultName, price: defaultPrice, type: expectedType, isActive: true };
          };

          updateProfile({ 
            uniqueMechanism: result.concept.mechanism,
            commonEnemy: result.concept.enemy,
            promise90Days: result.concept.promise,
            financialGoal: goal,
            productLadder: {
              lead_magnet: findProduct('lead_magnet', 0, 'Isca Digital', 0),
              tripwire: findProduct('tripwire', 1, 'Desafio de Entrada', 97),
              high_ticket: findProduct('high_ticket', 2, 'Mentoria Premium', 1500),
              recurring: findProduct('recurring', 3, 'Comunidade VIP', 97),
              downsell: findProduct('downsell', 4, 'E-book de Recuperação', 47)
            }
          });
          setStep(3);
       }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const salesNeeded = useMemo(() => {
    if (!profile.productLadder) return { high: 0, entry: 0 };
    const goalVal = profile.financialGoal || 15000;
    const highPrice = profile.productLadder.high_ticket.price || 2000;
    const entryPrice = profile.productLadder.tripwire.price || 97;
    
    const highTarget = goalVal * 0.7;
    const entryTarget = goalVal * 0.3;

    return {
      high: Math.ceil(highTarget / highPrice),
      entry: Math.ceil(entryTarget / entryPrice)
    };
  }, [profile.financialGoal, profile.productLadder]);

  const handleUpdateProduct = (type: keyof ProductLadder, data: Partial<ProductDetail>) => {
    if (!profile.productLadder) return;
    const newLadder = { ...profile.productLadder };
    newLadder[type] = { ...newLadder[type], ...data };
    updateProfile({ productLadder: newLadder });
  };

  if (step === 3) {
    const ladder = profile.productLadder;
    return (
      <div className="max-w-6xl mx-auto pb-20 animate-in fade-in duration-700">
        <header className="flex justify-between items-end mb-12">
           <div>
              <h2 className="text-5xl font-black text-gray-900 tracking-tighter">Meu Império Digital 👑</h2>
              <p className="text-xl text-gray-500 font-medium">Posicionamento e Esteira de Lucro Híbrida.</p>
           </div>
           <button onClick={() => setStep(1)} className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center gap-2">
              <RefreshCw size={14} /> Refazer Estratégia
           </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           {/* CONCEITO & POSICIONAMENTO */}
           <div className="lg:col-span-1 space-y-8">
              <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
                 <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2"><Target size={14} /> Posicionamento Incomum</h3>
                 <div className="space-y-6">
                    <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                       <p className="text-[8px] font-black text-emerald-600 uppercase mb-2">Seu Mecanismo Único</p>
                       <p className="text-lg font-black text-emerald-950 leading-tight">{profile.uniqueMechanism}</p>
                    </div>
                    <div className="p-6 bg-red-50 rounded-3xl border border-red-100">
                       <p className="text-[8px] font-black text-red-600 uppercase mb-2">O Inimigo Comum</p>
                       <p className="text-lg font-black text-red-950 leading-tight">{profile.commonEnemy}</p>
                    </div>
                    <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                       <p className="text-[8px] font-black text-blue-600 uppercase mb-2">A Big Promise</p>
                       <p className="text-lg font-black text-blue-950 leading-tight">{profile.promise90Days}</p>
                    </div>
                 </div>
              </section>

              {/* SIMULADOR FINANCEIRO */}
              <section className="bg-gray-900 p-8 rounded-[40px] text-white space-y-8 shadow-xl">
                 <div className="flex justify-between items-center">
                    <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2"><TrendingUp size={14} /> Simulador Financeiro</h3>
                    <Rocket className="text-white/20" size={20} />
                 </div>
                 <div className="space-y-6">
                    <div className="space-y-3">
                       <div className="flex justify-between">
                          <label className="text-[10px] font-black uppercase opacity-60">Meta de Faturamento</label>
                          <span className="text-emerald-400 font-black">R$ {goal.toLocaleString()}</span>
                       </div>
                       <input type="range" min="5000" max="100000" step="1000" value={goal} onChange={e => { setGoal(Number(e.target.value)); updateProfile({ financialGoal: Number(e.target.value) }); }} className="w-full h-2 bg-white/10 rounded-full appearance-none accent-emerald-500 cursor-pointer" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                       <div className="p-5 bg-white/5 rounded-2xl border border-white/10 text-center">
                          <p className="text-[9px] font-black text-emerald-400 uppercase mb-1">Vendas Mentoria</p>
                          <p className="text-3xl font-black">{salesNeeded.high}</p>
                       </div>
                       <div className="p-5 bg-white/5 rounded-2xl border border-white/10 text-center">
                          <p className="text-[9px] font-black text-emerald-400 uppercase mb-1">Vendas Desafio</p>
                          <p className="text-3xl font-black">{salesNeeded.entry}</p>
                       </div>
                    </div>
                    <p className="text-[9px] text-white/40 italic text-center">Baseado na regra de Pareto (70% Mentoria / 30% Entrada)</p>
                 </div>
              </section>
           </div>

           {/* ESTEIRA DE PRODUTOS EDITÁVEL */}
           <div className="lg:col-span-2 space-y-6">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] px-4 flex items-center gap-2"><Rocket size={14} className="text-emerald-500" /> Minha Esteira Lucrativa</h3>
              
              {ladder && (
                 <div className="grid grid-cols-1 gap-6">
                    {/* CARD: HIGH TICKET (FOCO PRINCIPAL) */}
                    <div className="bg-emerald-900 p-10 rounded-[48px] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 border-4 border-emerald-800 relative overflow-hidden group">
                       <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><Crown size={120} className="text-white" /></div>
                       <div className="flex-1 space-y-4 relative z-10">
                          <div className="flex items-center gap-3">
                             <Crown className="text-emerald-400" />
                             <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300 bg-emerald-950 px-3 py-1 rounded-full">High Ticket (O Método)</span>
                          </div>
                          <input className="w-full bg-transparent font-black text-white text-3xl outline-none focus:ring-2 focus:ring-emerald-500/20 rounded-lg" value={ladder.high_ticket.name} onChange={e => handleUpdateProduct('high_ticket', {name: e.target.value})} />
                          <div className="flex items-center gap-6">
                             <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-emerald-400">R$</span>
                                <input type="number" className="w-24 bg-white/10 rounded-xl p-2 font-black text-white outline-none" value={ladder.high_ticket.price} onChange={e => handleUpdateProduct('high_ticket', {price: Number(e.target.value)})} />
                             </div>
                             <div className="flex gap-3">
                                <button onClick={() => setActivePage('funnels')} className="px-4 py-2 bg-white text-emerald-900 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center gap-2"><Rocket size={12} /> Vender Agora</button>
                                <button className="px-4 py-2 bg-white/10 text-white rounded-xl font-black text-[9px] uppercase tracking-widest border border-white/20 flex items-center gap-2"><Paperclip size={12} /> Apoio</button>
                             </div>
                          </div>
                       </div>
                       <div className="text-right shrink-0 relative z-10">
                          <p className="text-5xl font-black text-white tabular-nums">{salesNeeded.high}</p>
                          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Contratos/mês</p>
                       </div>
                    </div>

                    {/* GRID DE OUTROS PRODUTOS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {/* DESAFIO SMART */}
                       <div className="bg-white p-8 rounded-[40px] border-2 border-purple-50 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all group">
                          <div className="space-y-4">
                             <div className="flex items-center gap-2">
                                <Zap className="text-purple-500" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-purple-500 bg-purple-50 px-3 py-1 rounded-full">Entrada (O Desafio)</span>
                             </div>
                             <input className="w-full bg-transparent font-black text-gray-900 text-xl outline-none" value={ladder.tripwire.name} onChange={e => handleUpdateProduct('tripwire', {name: e.target.value})} />
                             <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                   <span className="text-xs font-bold text-gray-300">R$</span>
                                   <input type="number" className="w-20 bg-gray-50 rounded-xl p-2 font-black text-emerald-600 outline-none" value={ladder.tripwire.price} onChange={e => handleUpdateProduct('tripwire', {price: Number(e.target.value)})} />
                                </div>
                                <p className="text-2xl font-black text-gray-900 tabular-nums">{salesNeeded.entry}<span className="text-[9px] text-gray-400 font-bold uppercase ml-2">Alunos</span></p>
                             </div>
                          </div>
                          <button onClick={() => setActivePage('challenges')} className="mt-6 w-full py-4 bg-purple-50 text-purple-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-purple-100 transition-all flex items-center justify-center gap-2">
                             <Wand2 size={14} /> Configurar Gamificação
                          </button>
                       </div>

                       {/* RECORRÊNCIA */}
                       <div className="bg-white p-8 rounded-[40px] border-2 border-blue-50 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all group">
                          <div className="space-y-4">
                             <div className="flex items-center gap-2">
                                <Repeat className="text-blue-500" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-blue-500 bg-blue-50 px-3 py-1 rounded-full">Recorrência (LTV)</span>
                             </div>
                             <input className="w-full bg-transparent font-black text-gray-900 text-xl outline-none" value={ladder.recurring.name} onChange={e => handleUpdateProduct('recurring', {name: e.target.value})} />
                             <div className="flex items-center gap-1">
                                <span className="text-xs font-bold text-gray-300">R$</span>
                                <input type="number" className="w-20 bg-gray-50 rounded-xl p-2 font-black text-emerald-600 outline-none" value={ladder.recurring.price} onChange={e => handleUpdateProduct('recurring', {price: Number(e.target.value)})} />
                                <span className="text-[10px] font-bold text-gray-400">/mês</span>
                             </div>
                          </div>
                          <button className="mt-6 w-full py-4 border-2 border-gray-100 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                             <PlusCircle size={14} /> Abrir Clube
                          </button>
                       </div>
                    </div>
                 </div>
              )}
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
         <div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Business Lab Architect</h2>
            <p className="text-xl text-gray-500 mt-2 font-medium">Construa seu império passo a passo.</p>
         </div>
         <div className="flex items-center gap-2">
            {steps.map((s) => (
               <div key={s.id} className={`h-2 rounded-full transition-all duration-500 ${step >= s.id ? 'w-12 bg-emerald-500' : 'w-4 bg-gray-200'}`} />
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
         <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-5 text-emerald-900">{steps[step-1].icon}</div>
               <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full uppercase tracking-widest">Etapa {step}/3</span>
               <h3 className="text-3xl font-black text-gray-900 leading-tight">{steps[step-1].title}</h3>
               <p className="text-gray-500 font-medium leading-relaxed">{steps[step-1].desc}</p>
            </div>
            
            {/* BUTTON TO LOAD DEMO DATA */}
            {onLoadDemo && (
               <button onClick={onLoadDemo} className="w-full py-4 bg-purple-100 text-purple-700 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-purple-200 transition-all flex items-center justify-center gap-2 shadow-sm border border-purple-200">
                  <Sparkles size={14} /> Carregar Demo: Nicho Menopausa
               </button>
            )}
         </div>

         <div className="lg:col-span-2 bg-white rounded-[48px] border border-gray-100 p-12 shadow-sm space-y-10 min-h-[500px] flex flex-col justify-center">
            {step === 1 && (
               <div className="space-y-8 animate-in slide-in-from-right-8">
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] pl-4">Qual problema você resolve em 90 dias?</label>
                     <textarea value={problem} onChange={e => setProblem(e.target.value)} placeholder="Ex: Mulheres que não conseguem engravidar devido a inflamação..." className="w-full p-8 bg-gray-50 border-none rounded-[32px] font-bold text-xl outline-none focus:ring-4 focus:ring-emerald-500/10 min-h-[140px] transition-all resize-none" />
                  </div>
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] pl-4">Quais os 3 pilares do seu método?</label>
                     <textarea value={pillars} onChange={e => setPillars(e.target.value)} placeholder="Ex: Desinflamação Intestinal, Ciclo das Sementes, Sono..." className="w-full p-8 bg-gray-50 border-none rounded-[32px] font-bold text-xl outline-none focus:ring-4 focus:ring-emerald-500/10 min-h-[140px] transition-all resize-none" />
                  </div>
                  <button onClick={() => setStep(2)} disabled={!problem || !pillars} className="w-full py-6 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-3">Próximo Passo <ArrowRight size={18} /></button>
               </div>
            )}

            {step === 2 && (
               <div className="space-y-8 animate-in slide-in-from-right-8 text-center">
                  <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto"><DollarSign size={40} /></div>
                  <div className="space-y-4">
                     <h3 className="text-3xl font-black text-gray-900">Defina seu Alvo</h3>
                     <p className="text-gray-500 max-w-sm mx-auto font-medium">Quanto você deseja faturar nos próximos 30 dias operando no modo High Ticket?</p>
                  </div>
                  <div className="flex items-center justify-center gap-4 max-w-sm mx-auto">
                     <span className="text-4xl font-black text-gray-300">R$</span>
                     <input type="number" autoFocus value={goal} onChange={e => setGoal(Number(e.target.value))} className="w-full bg-gray-50 p-6 rounded-3xl font-black text-4xl text-emerald-600 outline-none border-none text-center" />
                  </div>
                  <div className="flex gap-4">
                     <button onClick={() => setStep(1)} className="flex-1 py-5 bg-gray-100 text-gray-500 rounded-2xl font-black uppercase tracking-widest text-xs">Voltar</button>
                     <button onClick={handleMagicRefine} disabled={loading} className="flex-[2] py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl flex items-center justify-center gap-3">
                        {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
                        {loading ? 'Consultando IA...' : 'Construir Meu Império'}
                     </button>
                  </div>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default BusinessLab;
