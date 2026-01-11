
import React, { useState } from 'react';
import { FUNNEL_BLUEPRINTS, EnhancedFunnelBlueprint } from '../constants';
import { Zap, Trophy, Heart, ArrowRight, X, Loader2, Magnet, Sparkles, Flame, Star, Lightbulb, TrendingUp, Search, Clock, MessageSquare, Copy, Check, Microscope, Crown, Target, Ban, Filter } from 'lucide-react';
import { Post, UserProfile, Material, SavedFunnel, StrategyType, AudacityLevel, FunnelCategory, PostFormat } from '../types';
import { generatePostsFromBlueprint } from '../services/geminiService';

interface FunnelsProps {
  profile: UserProfile;
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  materials: Material[];
  setActivePage: (page: string) => void;
  savedFunnels: SavedFunnel[];
  setSavedFunnels: React.Dispatch<React.SetStateAction<SavedFunnel[]>>;
}

const Funnels: React.FC<FunnelsProps> = ({ profile, setPosts, setActivePage }) => {
  const [activeTab, setActiveTab] = useState<FunnelCategory | 'all'>('all');
  const [selectedFunnel, setSelectedFunnel] = useState<EnhancedFunnelBlueprint | null>(null);
  const [blueprintAnswers, setBlueprintAnswers] = useState<Record<string, string>>({});
  const [isApplying, setIsApplying] = useState(false);
  const [startDate, setStartDate] = useState<number>(new Date().getDate());
  const [audacity, setAudacity] = useState<AudacityLevel>('educativa');
  const [generationSteps, setGenerationSteps] = useState<string[]>([]);
  const [resultContent, setResultContent] = useState<any[] | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const applyBlueprint = async () => {
    if (!selectedFunnel) return;
    setIsApplying(true);
    setGenerationSteps(['Iniciando motor de inteligência Nutri.AI...', 'Mapeando gatilhos de dor latente...']);
    
    const batchId = `funnel-${Math.random().toString(36).substr(2, 9)}`;

    try {
      setGenerationSteps(prev => [...prev, `Roteirizando formato: ${selectedFunnel.outputFormat || 'Carrossel'}...`]);
      const result = await generatePostsFromBlueprint(
        profile, 
        selectedFunnel.title, 
        selectedFunnel.pattern, 
        blueprintAnswers,
        audacity,
        selectedFunnel.outputFormat || 'carousel'
      );

      if (!result.posts || result.posts.length === 0) throw new Error("A IA falhou.");

      if (selectedFunnel.outputFormat === 'script_whatsapp' || selectedFunnel.outputFormat === 'roteiro_stories') {
        setResultContent(result.posts);
        setIsApplying(false);
      } else {
        const newPosts: Post[] = result.posts.map((p, i) => ({
          id: `auto-${Math.random().toString(36).substr(2, 5)}-${i}`,
          userId: profile.id,
          scheduledDate: new Date().toISOString(),
          calendarIndex: (startDate + i + 3), 
          status: 'draft',
          strategyType: (p.strategyType as StrategyType) || selectedFunnel.pattern[i] || 'autoridade_clinica',
          format: selectedFunnel.outputFormat || 'carousel',
          toneIntensity: audacity,
          batchId: batchId,
          batchTitle: selectedFunnel.title,
          content: {
            title: p.title || 'Sem Título',
            caption: p.caption || '',
            slides: p.slides || [{ text: 'Conteúdo não gerado.' }]
          }
        }));
        setPosts(prev => [...prev, ...newPosts]);
        setIsApplying(false);
        setSelectedFunnel(null);
        setActivePage('calendar');
      }
    } catch (err) {
      console.error(err);
      setIsApplying(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getIcon = (iconName: string, className: string) => {
    const icons: any = { Zap, Trophy, Heart, Magnet, Search, Clock, MessageSquare, Target, Microscope, Crown, Ban };
    const IconComp = icons[iconName] || Sparkles;
    return <IconComp className={className} />;
  };

  const filteredFunnels = activeTab === 'all' 
    ? FUNNEL_BLUEPRINTS 
    : FUNNEL_BLUEPRINTS.filter(f => f.category === activeTab);

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Sales Hub Pro</h2>
          <p className="text-xl text-gray-500 mt-2 font-medium">Selecione o funil ideal para o seu momento de faturamento.</p>
        </div>
        
        <div className="flex bg-gray-100 p-1.5 rounded-[20px] w-fit shadow-inner">
           {[
             { id: 'all', label: 'Todos' },
             { id: 'start', label: 'Atração' },
             { id: 'sell', label: 'Conversão' },
             { id: 'caixa', label: 'Caixa Rápido' }
           ].map(tab => (
             <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
             >
               {tab.label}
             </button>
           ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         {filteredFunnels.map(funnel => (
           <div 
             key={funnel.id} 
             onClick={() => setSelectedFunnel(funnel)}
             className="group bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer relative overflow-hidden h-[380px] flex flex-col justify-between"
           >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${funnel.color} opacity-10 rounded-bl-[80px] group-hover:scale-150 transition-transform duration-700`} />
              <div className="space-y-6">
                 <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${funnel.color} flex items-center justify-center text-white shadow-lg`}>
                    {getIcon(funnel.icon, "w-7 h-7")}
                 </div>
                 <h3 className="text-xl font-black text-gray-900 leading-tight">{funnel.title}</h3>
                 <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{funnel.promise}</p>
                 <p className="text-sm text-gray-500 font-medium leading-relaxed line-clamp-3">{funnel.description}</p>
              </div>
              <div className="pt-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-600">
                 Configurar <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </div>
           </div>
         ))}
      </div>

      {selectedFunnel && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-6">
           <div className="bg-white rounded-[48px] w-full max-w-2xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col">
              {isApplying ? (
                <div className="p-20 text-center space-y-10 flex flex-col items-center">
                   <div className="relative">
                      <Loader2 size={80} className="text-emerald-600 animate-spin" />
                      <Sparkles className="absolute inset-0 m-auto text-emerald-400" size={32} />
                   </div>
                   <div className="space-y-4">
                     <h3 className="text-3xl font-black text-gray-900">Construindo Funil...</h3>
                     <div className="flex flex-col gap-2">
                       {generationSteps.map((step, i) => <p key={i} className="text-gray-400 font-bold text-sm animate-pulse">{step}</p>)}
                     </div>
                   </div>
                </div>
              ) : resultContent ? (
                <div className="p-12 space-y-10 overflow-y-auto custom-scrollbar">
                   <header className="text-center">
                      <h3 className="text-3xl font-black text-gray-900 tracking-tight">
                        {selectedFunnel.outputFormat === 'roteiro_stories' ? 'Roteiros de Stories' : 'Scripts de Abordagem'}
                      </h3>
                      <p className="text-gray-500 font-medium mt-2">Copie e use agora mesmo na sua rede.</p>
                   </header>
                   <div className="space-y-6">
                      {resultContent.map((item, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-3xl p-8 border border-gray-100 relative group">
                           <button 
                             onClick={() => copyToClipboard(item.script || item.caption || '', idx)}
                             className="absolute top-6 right-6 p-3 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-emerald-600 shadow-sm transition-all"
                           >
                             {copiedIndex === idx ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
                           </button>
                           <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4">Parte {idx + 1}</p>
                           <p className="text-gray-700 leading-relaxed font-medium whitespace-pre-wrap pr-10">{item.script || item.caption}</p>
                        </div>
                      ))}
                   </div>
                   <button onClick={() => { setSelectedFunnel(null); setResultContent(null); }} className="w-full py-6 bg-emerald-600 text-white rounded-[24px] font-black uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all">Concluir</button>
                </div>
              ) : (
                <>
                  <header className="p-10 border-b flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedFunnel.color} flex items-center justify-center text-white shadow-md`}>
                           {getIcon(selectedFunnel.icon, "w-6 h-6")}
                        </div>
                        <h3 className="text-2xl font-black text-gray-900">{selectedFunnel.title}</h3>
                     </div>
                     <button onClick={() => setSelectedFunnel(null)} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
                  </header>
                  <div className="p-10 overflow-y-auto flex-1 space-y-8 custom-scrollbar">
                     {selectedFunnel.questions.map(q => (
                        <div key={q.id} className="space-y-3">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{q.label}</label>
                           <textarea 
                             rows={2}
                             placeholder={q.placeholder} 
                             value={blueprintAnswers[q.id] || ''} 
                             onChange={e => setBlueprintAnswers({...blueprintAnswers, [q.id]: e.target.value})} 
                             className="w-full p-5 rounded-2xl bg-gray-50 border-none font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 text-gray-700" 
                           />
                        </div>
                     ))}
                  </div>
                  <footer className="p-10 border-t bg-gray-50/50">
                    <button 
                       onClick={applyBlueprint} 
                       disabled={Object.keys(blueprintAnswers).length < selectedFunnel.questions.length} 
                       className="w-full py-6 bg-emerald-600 text-white rounded-3xl font-black uppercase tracking-widest text-sm shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                       <Sparkles size={20} /> Gerar Sequência Estratégica
                    </button>
                  </footer>
                </>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default Funnels;
