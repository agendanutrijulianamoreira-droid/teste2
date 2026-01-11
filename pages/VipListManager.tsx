
import React, { useState, useEffect } from 'react';
import { Crown, Zap, Heart, MessageCircle, Copy, Loader2, Send, Calendar, Clock, DollarSign, ChevronRight, ChevronDown } from 'lucide-react';
import { UserProfile, VipCycle, VipMessageConfig, VipWeek } from '../types';
import { generateVipMessage, generateVipStrategyBatch } from '../services/geminiService';

interface VipListManagerProps {
  profile: UserProfile;
  vipPlan?: VipWeek[]; // Now receiving from App.tsx
  setVipPlan?: React.Dispatch<React.SetStateAction<VipWeek[]>>; // Now receiving from App.tsx
}

const VipListManager: React.FC<VipListManagerProps> = ({ profile, vipPlan: propVipPlan, setVipPlan: propSetVipPlan }) => {
  const [activeMode, setActiveMode] = useState<'single' | 'batch'>('single');
  
  // Single Mode State
  const [config, setConfig] = useState<VipMessageConfig>({
    cycle: 'content',
    headline: '',
    topic: '',
    association: ''
  });
  const [generatedText, setGeneratedText] = useState('');
  
  // Batch Mode State (If props not provided, fallback to local state for standalone usage compatibility)
  const [localVipPlan, setLocalVipPlan] = useState<VipWeek[]>([]);
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);
  
  const [isGenerating, setIsGenerating] = useState(false);

  const currentVipPlan = propVipPlan || localVipPlan;
  const setPlan = propSetVipPlan || setLocalVipPlan;

  // Auto-switch to batch mode if plan exists
  useEffect(() => {
    if (currentVipPlan.length > 0) {
      setActiveMode('batch');
    }
  }, [currentVipPlan.length]);

  const handleGenerateSingle = async () => {
    if (!config.headline || !config.topic || !config.association) return;
    setIsGenerating(true);
    try {
      const text = await generateVipMessage(profile, config);
      setGeneratedText(text);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateBatch = async () => {
    setIsGenerating(true);
    try {
      const weeks = await generateVipStrategyBatch(profile);
      setPlan(weeks);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Mensagem copiada!');
  };

  const openWhatsApp = (text: string) => {
    const url = `https://web.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <Crown className="text-emerald-500" /> Lista VIP 👑
          </h2>
          <p className="text-xl text-gray-500 mt-2">Transforme seu WhatsApp em uma máquina de vendas íntima.</p>
        </div>
        
        <div className="flex bg-gray-100 p-1.5 rounded-[20px] w-fit shadow-inner">
           <button 
             onClick={() => setActiveMode('single')}
             className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeMode === 'single' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
           >
             Mensagem Rápida
           </button>
           <button 
             onClick={() => setActiveMode('batch')}
             className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeMode === 'batch' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
           >
             Planejador 2 Meses
           </button>
        </div>
      </header>

      {/* SINGLE MESSAGE MODE */}
      {activeMode === 'single' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* LEFT: CONTROLS */}
          <div className="space-y-10">
            
            {/* Cycle Selector */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Selecione o Ciclo da Semana</label>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setConfig({...config, cycle: 'content'})}
                  className={`p-6 rounded-3xl border-4 text-left transition-all ${config.cycle === 'content' ? 'border-emerald-500 bg-emerald-50 shadow-md' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${config.cycle === 'content' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    <Heart size={20} />
                  </div>
                  <h4 className={`font-black text-lg ${config.cycle === 'content' ? 'text-emerald-900' : 'text-gray-700'}`}>Semana de Conteúdo</h4>
                  <p className="text-xs font-medium opacity-60 mt-1">Nutrir, conectar e gerar valor puro.</p>
                </button>

                <button 
                  onClick={() => setConfig({...config, cycle: 'offer'})}
                  className={`p-6 rounded-3xl border-4 text-left transition-all ${config.cycle === 'offer' ? 'border-emerald-500 bg-emerald-50 shadow-md' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${config.cycle === 'offer' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    <Zap size={20} />
                  </div>
                  <h4 className={`font-black text-lg ${config.cycle === 'offer' ? 'text-emerald-900' : 'text-gray-700'}`}>Semana de Oferta</h4>
                  <p className="text-xs font-medium opacity-60 mt-1">Recall do tema anterior e venda direta.</p>
                </button>
              </div>
            </div>

            {/* Inputs */}
            <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                  {config.cycle === 'content' ? 'Headliner (Gancho Inicial)' : 'Gancho de Atenção'}
                </label>
                <input 
                  value={config.headline}
                  onChange={(e) => setConfig({...config, headline: e.target.value})}
                  placeholder={config.cycle === 'content' ? "Ex: Acordar cansada não é normal" : "Ex: Sobre o cansaço que falamos..."}
                  className="w-full p-5 rounded-2xl bg-gray-50 border-none font-bold text-gray-900 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                  {config.cycle === 'content' ? 'Assunto (Tema Principal)' : 'Assunto (Tema da Semana Passada)'}
                </label>
                <input 
                  value={config.topic}
                  onChange={(e) => setConfig({...config, topic: e.target.value})}
                  placeholder="Ex: Ciclo do Cortisol"
                  className="w-full p-5 rounded-2xl bg-gray-50 border-none font-bold text-gray-900 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Associação (Metáfora)</label>
                <input 
                  value={config.association}
                  onChange={(e) => setConfig({...config, association: e.target.value})}
                  placeholder="Ex: Celular viciado que a bateria não carrega 100%"
                  className="w-full p-5 rounded-2xl bg-gray-50 border-none font-bold text-gray-900 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                />
              </div>

              <button 
                onClick={handleGenerateSingle}
                disabled={isGenerating || !config.headline || !config.topic}
                className="w-full py-6 bg-emerald-600 text-white rounded-3xl font-black uppercase tracking-widest text-sm shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isGenerating ? <Loader2 className="animate-spin" /> : <MessageCircle />} 
                {isGenerating ? 'Escrevendo Copy...' : 'Gerar Mensagem VIP'}
              </button>
            </div>
          </div>

          {/* RIGHT: WHATSAPP PREVIEW */}
          <div className="flex flex-col items-center">
             <div className="relative w-[380px] h-[750px] bg-black rounded-[60px] shadow-2xl border-[8px] border-gray-800 overflow-hidden">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-20"></div>
                
                {/* Screen Content */}
                <div className="w-full h-full bg-[#E5DDD5] flex flex-col font-sans relative">
                   {/* WhatsApp Header */}
                   <div className="bg-[#075E54] h-24 pt-8 px-4 flex items-center gap-3 text-white shadow-md z-10 shrink-0">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-sm">JM</div>
                      <div className="flex-1">
                         <p className="font-bold text-sm truncate">Lista VIP 👑</p>
                         <p className="text-[10px] opacity-80">lista de transmissão</p>
                      </div>
                   </div>

                   {/* Chat Area */}
                   <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat">
                      {generatedText ? (
                         <div className="bg-[#DCF8C6] p-3 rounded-lg shadow-sm max-w-[90%] self-end ml-auto text-sm text-gray-800 leading-relaxed whitespace-pre-wrap relative">
                            {generatedText}
                            <div className="text-[10px] text-gray-500 text-right mt-1 flex items-center justify-end gap-1">
                               {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                               <span className="text-blue-500">✓✓</span>
                            </div>
                            {/* Triangle tail */}
                            <div className="absolute top-0 -right-2 w-0 h-0 border-t-[10px] border-t-[#DCF8C6] border-r-[10px] border-r-transparent"></div>
                         </div>
                      ) : (
                         <div className="flex justify-center mt-20 opacity-50">
                            <span className="bg-[#E1F3FB] text-gray-600 text-xs px-3 py-1 rounded-lg shadow-sm">
                               As mensagens dessa conversa são protegidas com criptografia de ponta a ponta.
                            </span>
                         </div>
                      )}
                   </div>

                   {/* Input Area (Mock) */}
                   <div className="bg-[#F0F0F0] p-2 flex items-center gap-2 shrink-0">
                      <div className="bg-white flex-1 rounded-full px-4 py-2 text-gray-400 text-sm">
                         Digite uma mensagem
                      </div>
                      <div className="w-10 h-10 bg-[#075E54] rounded-full flex items-center justify-center text-white">
                         <Send size={18} />
                      </div>
                   </div>
                </div>
             </div>

             {/* Copy Action */}
             {generatedText && (
               <button 
                 onClick={() => copyToClipboard(generatedText)}
                 className="mt-8 px-10 py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-3"
               >
                 <Copy size={16} /> Copiar Texto
               </button>
             )}
          </div>
        </div>
      )}

      {/* BATCH MODE */}
      {activeMode === 'batch' && (
        <div className="max-w-3xl mx-auto space-y-12">
           {currentVipPlan.length === 0 ? (
             <div className="bg-white rounded-[48px] border border-gray-100 p-16 text-center space-y-8 shadow-sm animate-in zoom-in-95">
                <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                   <Calendar size={48} />
                </div>
                <div>
                   <h3 className="text-3xl font-black text-gray-900">Planejamento de 8 Semanas</h3>
                   <p className="text-gray-500 max-w-md mx-auto mt-2 text-lg">Gere 2 meses de estratégia completa, alternando conteúdo e vendas dos produtos do Business Lab.</p>
                </div>
                <button 
                   onClick={handleGenerateBatch}
                   disabled={isGenerating}
                   className="px-10 py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:bg-emerald-700 transition-all flex items-center gap-3 mx-auto disabled:opacity-50"
                >
                   {isGenerating ? <Loader2 className="animate-spin" /> : <Zap />}
                   {isGenerating ? 'Criando Estratégia...' : 'Gerar Cronograma Completo'}
                </button>
             </div>
           ) : (
             <div className="space-y-8">
                <div className="flex justify-between items-center px-4">
                   <h3 className="font-black text-gray-400 uppercase tracking-widest text-xs">Cronograma Bimestral</h3>
                   <button onClick={() => setPlan([])} className="text-xs text-red-500 font-bold hover:underline">Limpar Plano</button>
                </div>
                <div className="space-y-4">
                   {currentVipPlan.map((week) => (
                      <div 
                        key={week.week} 
                        className={`bg-white rounded-[32px] border-l-8 overflow-hidden shadow-sm transition-all duration-300 ${expandedWeek === week.week ? 'shadow-xl scale-[1.02]' : 'hover:scale-[1.01]'} ${week.type === 'CONTENT' ? 'border-l-emerald-500' : 'border-l-amber-500'}`}
                      >
                         <div 
                           onClick={() => setExpandedWeek(expandedWeek === week.week ? null : week.week)}
                           className="p-8 cursor-pointer flex justify-between items-center"
                         >
                            <div className="flex items-center gap-6">
                               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg ${week.type === 'CONTENT' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                  {week.week}
                               </div>
                               <div>
                                  <div className="flex items-center gap-3 mb-1">
                                     <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${week.type === 'CONTENT' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                        {week.type === 'CONTENT' ? 'Nutrir' : 'Vender'}
                                     </span>
                                     <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                        {week.type === 'CONTENT' ? <Heart size={10} /> : <DollarSign size={10} />}
                                        {week.type === 'CONTENT' ? 'Valor' : week.productName || 'Oferta'}
                                     </span>
                                  </div>
                                  <h4 className="font-bold text-gray-900 text-lg">{week.headline}</h4>
                               </div>
                            </div>
                            <div className={`transition-transform duration-300 ${expandedWeek === week.week ? 'rotate-180' : ''}`}>
                               <ChevronDown className="text-gray-300" />
                            </div>
                         </div>

                         {expandedWeek === week.week && (
                            <div className="px-8 pb-8 pt-0 animate-in slide-in-from-top-2">
                               <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 mb-6">
                                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed font-medium">{week.script}</p>
                               </div>
                               <div className="flex gap-4">
                                  <button onClick={() => copyToClipboard(week.script)} className="flex-1 py-4 bg-white border border-gray-200 text-gray-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-50 flex items-center justify-center gap-2">
                                     <Copy size={16} /> Copiar
                                  </button>
                                  <button onClick={() => openWhatsApp(week.script)} className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-700 flex items-center justify-center gap-2 shadow-lg shadow-emerald-100">
                                     <MessageCircle size={16} /> Abrir WhatsApp
                                  </button>
                               </div>
                            </div>
                         )}
                      </div>
                   ))}
                </div>
             </div>
           )}
        </div>
      )}
    </div>
  );
};

export default VipListManager;
