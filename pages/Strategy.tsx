
import React, { useState } from 'react';
import { Compass, Megaphone, Magnet, Brain, ArrowRight, Loader2, Sparkles, Copy, Save, CheckCircle2, X, ChevronLeft, Trash2, FileText, History, ShieldAlert, Search, BarChart3, TrendingUp } from 'lucide-react';
import { UserProfile, SavedStrategy, FunnelMetric } from '../types';
import { generateStrategyResponse, NutriBrainType } from '../services/geminiService';

// Basic Markdown renderer (simplified for this environment)
const Markdown = ({ content }: { content: string }) => {
  const lines = content.split('\n');
  return (
    <div className="space-y-4 text-gray-800 leading-relaxed">
      {lines.map((line, i) => {
        if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold mt-8 mb-4 text-emerald-800 border-b pb-2">{line.replace('### ', '')}</h3>;
        if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-black mt-10 mb-6 text-emerald-900">{line.replace('## ', '')}</h2>;
        if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-black mt-12 mb-8 text-emerald-950">{line.replace('# ', '')}</h1>;
        if (line.startsWith('- ') || line.startsWith('* ')) return <li key={i} className="ml-6 list-disc marker:text-emerald-500 my-2">{line.substring(2)}</li>;
        if (line.match(/^\d+\. /)) return <li key={i} className="ml-6 list-decimal marker:text-emerald-500 marker:font-bold my-2">{line.replace(/^\d+\. /, '')}</li>;
        if (!line.trim()) return <div key={i} className="h-2" />;
        return <p key={i} className="whitespace-pre-wrap">{line}</p>;
      })}
    </div>
  );
};

interface StrategyProps {
  profile: UserProfile;
  setActivePage: (page: string) => void;
  savedStrategies: SavedStrategy[];
  setSavedStrategies: React.Dispatch<React.SetStateAction<SavedStrategy[]>>;
  metrics: FunnelMetric[];
}

const Strategy: React.FC<StrategyProps> = ({ profile, setActivePage, savedStrategies, setSavedStrategies, metrics }) => {
  const [activeTab, setActiveTab] = useState<'tools' | 'saved'>('tools');
  const [activeTool, setActiveTool] = useState<NutriBrainType | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [viewingSaved, setViewingSaved] = useState<SavedStrategy | null>(null);
  
  const [formData, setFormData] = useState<Record<string, any>>({});

  const strategicTools = [
    { 
      id: 'funnel_compass' as NutriBrainType, 
      label: 'Bússola de Funil', 
      desc: 'Diagnóstico para escolher sua próxima campanha.', 
      icon: <Compass className="text-blue-500" />,
      color: 'bg-blue-50 border-blue-100 text-blue-700'
    },
    { 
      id: 'ad_generator' as NutriBrainType, 
      label: 'Gerador de Anúncios', 
      desc: 'Copywriting magnético para tráfego pago.', 
      icon: <Megaphone className="text-purple-500" />,
      color: 'bg-purple-50 border-purple-100 text-purple-700'
    },
    { 
      id: 'attraction_ideas' as NutriBrainType, 
      label: 'Ideias de Atração', 
      desc: 'Ganchos virais para atrair novos seguidores.', 
      icon: <Magnet className="text-orange-500" />,
      color: 'bg-orange-50 border-orange-100 text-orange-700'
    },
    { 
      id: 'content_modeling' as NutriBrainType, 
      label: 'Modelagem de Crenças', 
      desc: 'Quebre as objeções do seu paciente.', 
      icon: <Brain className="text-emerald-500" />,
      color: 'bg-emerald-50 border-emerald-100 text-emerald-700'
    },
  ];

  const tacticalTools = [
    {
      id: 'objection_killer' as NutriBrainType,
      label: 'Matador de Objeções',
      desc: 'SOS para fechar vendas no Direct.',
      icon: <ShieldAlert className="text-red-500" />,
      color: 'bg-red-50 border-red-100 text-red-700'
    },
    {
      id: 'promise_refinery' as NutriBrainType,
      label: 'Refinaria de Promessas',
      desc: 'Melhore sua promessa de venda.',
      icon: <Sparkles className="text-amber-500" />,
      color: 'bg-amber-50 border-amber-100 text-amber-700'
    },
    {
      id: 'monthly_audit' as NutriBrainType,
      label: 'Auditoria Mensal',
      desc: 'Análise de performance e próximos passos.',
      icon: <BarChart3 className="text-gray-500" />,
      color: 'bg-gray-50 border-gray-100 text-gray-700'
    }
  ];

  const getToolInputs = (toolId: NutriBrainType) => {
    switch (toolId) {
      case 'funnel_compass':
        return [
          { id: 'offer', label: 'Qual sua oferta atual?', placeholder: 'Ex: Mentoria de Emagrecimento' },
          { id: 'objective', label: 'Objetivo Principal?', placeholder: 'Ex: Escalar vendas' },
          { id: 'moment', label: 'Momento do Negócio?', placeholder: 'Ex: Começando agora / Já tenho clientes' },
        ];
      case 'ad_generator':
        return [
           { id: 'adOffer', label: 'O que vamos anunciar?', placeholder: 'Ex: Aula Gratuita sobre Intestino' },
        ];
      case 'attraction_ideas':
         return [
            { id: 'mainTopics', label: 'Quais seus pilares de conteúdo?', placeholder: 'Ex: Jejum, Low Carb, Sono' }
         ];
      case 'content_modeling':
         return [
            { id: 'beliefToBreak', label: 'Qual crença limitante o paciente tem?', placeholder: 'Ex: Comer carboidrato à noite engorda' }
         ];
      case 'objection_killer':
         return [
            { id: 'objectionText', label: 'Qual a objeção do cliente?', placeholder: 'Ex: Está muito caro' }
         ];
      case 'promise_refinery':
         return [
            { id: 'currentPromise', label: 'Sua promessa atual?', placeholder: 'Ex: Te ajudo a emagrecer' }
         ];
      case 'monthly_audit':
         return [
            { id: 'results', label: 'Resultados do Mês (Resumo)', placeholder: 'Ex: 10 vendas, R$ 5k de faturamento' }
         ];
      default:
        return [];
    }
  };

  const handleGenerate = async () => {
    if (!activeTool) return;
    setIsGenerating(true);
    setResponse('');
    try {
      const result = await generateStrategyResponse(profile, activeTool, formData);
      setResponse(result);
      setShowResult(true);
    } catch (e) {
      console.error(e);
      alert('Erro ao gerar estratégia.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (!response || !activeTool) return;
    setIsSaving(true);
    
    // Create new strategy object
    const newStrategy: SavedStrategy = {
      id: Math.random().toString(36).substr(2, 9),
      type: activeTool,
      title: `${activeTool.replace('_', ' ')} - ${new Date().toLocaleDateString()}`,
      content: response,
      createdAt: new Date().toISOString()
    };
    
    setSavedStrategies(prev => [newStrategy, ...prev]);
    
    setTimeout(() => {
      setIsSaving(false);
      setActiveTool(null);
      setShowResult(false);
      setResponse(null);
      setFormData({});
      setActiveTab('saved');
    }, 1000);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta estratégia?')) {
      setSavedStrategies(prev => prev.filter(s => s.id !== id));
      if (viewingSaved?.id === id) setViewingSaved(null);
    }
  };

  if (activeTool) {
    const inputs = getToolInputs(activeTool);
    const toolDef = [...strategicTools, ...tacticalTools].find(t => t.id === activeTool);

    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 pb-20">
         <button onClick={() => { setActiveTool(null); setShowResult(false); }} className="flex items-center gap-2 text-gray-500 font-bold hover:text-gray-900 transition-colors">
            <ChevronLeft size={20} /> Voltar para Ferramentas
         </button>

         <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl overflow-hidden">
            <header className={`p-10 border-b border-gray-50 flex items-center gap-6 ${toolDef?.color.split(' ')[0]}`}>
               <div className="p-4 bg-white rounded-2xl shadow-sm">{toolDef?.icon}</div>
               <div>
                  <h2 className="text-3xl font-black text-gray-900">{toolDef?.label}</h2>
                  <p className="text-gray-600 font-medium">{toolDef?.desc}</p>
               </div>
            </header>

            {!showResult ? (
              <div className="p-10 space-y-8">
                 {inputs.map((input) => (
                    <div key={input.id} className="space-y-3">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{input.label}</label>
                       <textarea 
                         rows={3}
                         placeholder={input.placeholder}
                         value={formData[input.id] || ''}
                         onChange={(e) => setFormData({...formData, [input.id]: e.target.value})}
                         className="w-full p-5 bg-gray-50 rounded-2xl border-none font-bold text-gray-900 outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
                       />
                    </div>
                 ))}
                 <button 
                   onClick={handleGenerate}
                   disabled={isGenerating || inputs.some(i => !formData[i.id])}
                   className="w-full py-6 bg-gray-900 text-white rounded-3xl font-black uppercase tracking-widest text-sm shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                 >
                    {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles size={18} className="text-yellow-400" />}
                    {isGenerating ? 'Analisando Dados...' : 'Gerar Estratégia de Elite'}
                 </button>
              </div>
            ) : (
              <div className="p-10 space-y-8">
                 <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    <Markdown content={response || ''} />
                 </div>
                 <div className="flex gap-4">
                    <button onClick={() => setShowResult(false)} className="px-8 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-200">Refazer</button>
                    <button onClick={() => navigator.clipboard.writeText(response || '')} className="flex-1 py-4 bg-white border-2 border-gray-100 text-gray-700 rounded-2xl font-black uppercase tracking-widest text-xs hover:border-emerald-500 hover:text-emerald-600 transition-all flex items-center justify-center gap-2"><Copy size={16}/> Copiar</button>
                    <button onClick={handleSave} disabled={isSaving} className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-700 shadow-lg shadow-emerald-200 flex items-center justify-center gap-2">
                       {isSaving ? <CheckCircle2 size={16} /> : <Save size={16} />}
                       {isSaving ? 'Salvo!' : 'Salvar no Arquivo'}
                    </button>
                 </div>
              </div>
            )}
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Strategy Center</h2>
          <p className="text-xl text-gray-500 mt-2 font-medium">O cérebro estratégico do seu negócio.</p>
        </div>
        
        <div className="flex bg-gray-100 p-1.5 rounded-[20px] w-fit shadow-inner">
           <button 
             onClick={() => setActiveTab('tools')}
             className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'tools' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
           >
             Ferramentas
           </button>
           <button 
             onClick={() => setActiveTab('saved')}
             className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'saved' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
           >
             Arquivos Salvos
           </button>
        </div>
      </header>

      {activeTab === 'tools' && (
        <div className="space-y-12">
           <section>
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-6 flex items-center gap-2"><Compass size={14} /> Planejamento Estratégico</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {strategicTools.map(tool => (
                    <div 
                      key={tool.id} 
                      onClick={() => { setActiveTool(tool.id); setFormData({}); setShowResult(false); }}
                      className={`group bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer relative overflow-hidden`}
                    >
                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${tool.color}`}>
                          {tool.icon}
                       </div>
                       <h4 className="text-xl font-black text-gray-900 mb-2">{tool.label}</h4>
                       <p className="text-sm text-gray-500 font-medium leading-relaxed">{tool.desc}</p>
                       <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0 duration-300">
                          <ArrowRight className="text-gray-300" />
                       </div>
                    </div>
                 ))}
              </div>
           </section>

           <section>
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-6 flex items-center gap-2"><ShieldAlert size={14} /> Tática & Conversão</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {tacticalTools.map(tool => (
                    <div 
                      key={tool.id} 
                      onClick={() => { setActiveTool(tool.id); setFormData({}); setShowResult(false); }}
                      className={`group bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer relative overflow-hidden`}
                    >
                       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${tool.color}`}>
                          {tool.icon}
                       </div>
                       <h4 className="text-lg font-black text-gray-900 mb-2">{tool.label}</h4>
                       <p className="text-xs text-gray-500 font-medium leading-relaxed">{tool.desc}</p>
                    </div>
                 ))}
              </div>
           </section>
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {savedStrategies.length === 0 ? (
             <div className="col-span-full py-20 text-center bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
                <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-400 font-bold">Nenhuma estratégia salva ainda.</p>
             </div>
           ) : (
             savedStrategies.map(strat => (
               <div key={strat.id} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between h-[300px]">
                  <div>
                     <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-gray-50 rounded-xl text-gray-400">
                           <FileText size={20} />
                        </div>
                        <button onClick={() => handleDelete(strat.id)} className="p-2 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-lg transition-colors"><Trash2 size={16} /></button>
                     </div>
                     <h4 className="font-black text-gray-900 text-lg line-clamp-2 mb-2">{strat.title}</h4>
                     <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-4">{new Date(strat.createdAt).toLocaleDateString()}</p>
                     <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">{strat.content.substring(0, 150)}...</p>
                  </div>
                  <button onClick={() => setViewingSaved(strat)} className="w-full py-3 bg-gray-50 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-50 hover:text-emerald-600 transition-colors mt-6">
                     Ler Completo
                  </button>
               </div>
             ))
           )}
        </div>
      )}

      {/* MODAL DE VISUALIZAÇÃO */}
      {viewingSaved && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-6">
           <div className="bg-white rounded-[40px] w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
              <header className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                 <div>
                    <h3 className="text-xl font-black text-gray-900">{viewingSaved.title}</h3>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Arquivo Estratégico</p>
                 </div>
                 <button onClick={() => setViewingSaved(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={24} /></button>
              </header>
              <div className="p-10 overflow-y-auto custom-scrollbar bg-white">
                 <Markdown content={viewingSaved.content} />
              </div>
              <footer className="p-6 border-t border-gray-100 flex justify-end bg-gray-50/50">
                 <button onClick={() => { navigator.clipboard.writeText(viewingSaved.content); alert('Copiado!'); }} className="px-6 py-3 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center gap-2">
                    <Copy size={14} /> Copiar Texto
                 </button>
              </footer>
           </div>
        </div>
      )}
    </div>
  );
};

export default Strategy;
