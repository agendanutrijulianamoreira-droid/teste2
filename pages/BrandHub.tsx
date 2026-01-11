
import React, { useState, useRef } from 'react';
import { UserProfile, BrandSettings, Archetype } from '../types';
import { COLOR_PRESETS, FONT_PAIRS, ARCHETYPES_CONFIG } from '../constants';
import { Upload, Check, Trash2, Shield, Sparkles, Zap, Microscope, Target, Ban, Magnet, Crown, Download, FileText, Info, Palette, X, Instagram, Loader2, ArrowRight } from 'lucide-react';

interface BrandHubProps {
  profile: UserProfile;
  brand: BrandSettings;
  updateProfile: (p: Partial<UserProfile>) => void;
  updateBrand: (b: Partial<BrandSettings>) => void;
}

const BrandHub: React.FC<BrandHubProps> = ({ profile, brand, updateProfile, updateBrand }) => {
  const [activeTab, setActiveTab] = useState<'strategy' | 'visual'>('strategy');
  const [instagramInput, setInstagramInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => updateBrand({ logoUrl: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleAutoBrandAnalysis = async () => {
    if (!instagramInput) return;
    setIsAnalyzing(true);

    // SIMULAÇÃO DE ANÁLISE DE IA (UX WOW EFFECT)
    await new Promise(resolve => setTimeout(resolve, 2500)); // Delay dramático

    // Seleciona um preset baseado no tamanho do handle (para ser determinístico mas parecer mágico)
    const presetIndex = instagramInput.length % COLOR_PRESETS.length;
    const detectedPreset = COLOR_PRESETS[presetIndex];
    
    // Simula detecção de logo (placeholder)
    const simulatedLogo = `https://ui-avatars.com/api/?name=${instagramInput.replace('@','')}&background=${detectedPreset.dominant.replace('#','')}&color=fff&size=256&font-size=0.33`;

    updateBrand({
      colorBackground: detectedPreset.dominant,
      colorContrast: detectedPreset.contrast,
      colorDetail: detectedPreset.detail,
      logoUrl: simulatedLogo
    });
    
    // Atualiza o handle se não tiver
    if (!profile.instagramHandle || profile.instagramHandle === 'seu_instagram') {
        updateProfile({ instagramHandle: instagramInput.replace('@','') });
    }

    setIsAnalyzing(false);
    alert(`✨ Análise Completa! Detectamos a essência visual de ${instagramInput}.`);
  };

  const handleDownloadManifesto = async () => {
    const element = document.getElementById('brand-manifesto-card');
    if (!element) return;
    // @ts-ignore
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const link = document.createElement('a');
    link.download = `Manifesto_Brand_${profile.fullName.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const archetypes: { id: Archetype; label: string; icon: any; color: string; desc: string }[] = [
    { id: 'Mago', label: 'O Mago', icon: <Sparkles />, color: 'bg-purple-500', desc: 'Transformação radical e mistério.' },
    { id: 'Herói', label: 'O Herói', icon: <Zap />, color: 'bg-orange-500', desc: 'Superação, força e disciplina.' },
    { id: 'Sábio', label: 'O Sábio', icon: <Microscope />, color: 'bg-blue-500', desc: 'Ciência, dados e verdade clínica.' },
    { id: 'Governante', label: 'O Governante', icon: <Shield />, color: 'bg-gray-900', desc: 'Elite, alto padrão e exclusividade.' },
  ];

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-32 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Brand Hub 2.0</h2>
          <p className="text-xl text-gray-500 mt-2 font-medium">Posicionamento Único: O Núcleo da sua Estratégia.</p>
        </div>
        <div className="flex bg-gray-100 p-1.5 rounded-[20px] w-fit shadow-inner">
          <button 
            onClick={() => setActiveTab('strategy')}
            className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'strategy' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            DNA Estratégico
          </button>
          <button 
            onClick={() => setActiveTab('visual')}
            className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'visual' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Identidade Visual
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* CONFIGURATION SIDEBAR */}
        <div className="lg:col-span-2 space-y-10">
          
          {activeTab === 'strategy' && (
            <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
              <section className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-10">
                 <header className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><Target size={24}/></div>
                    <h3 className="text-2xl font-black text-gray-900">Sua Estratégia de Venda</h3>
                 </header>

                 <div className="space-y-8">
                    <div className="space-y-3 group">
                       <div className="flex justify-between items-center">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">Nome do seu Método (Mecanismo Único) <Info size={12}/></label>
                          <span className="text-[9px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-tighter">Obrigatório</span>
                       </div>
                       <input 
                          type="text" 
                          value={profile.uniqueMechanism}
                          onChange={(e) => updateProfile({ uniqueMechanism: e.target.value })}
                          placeholder="Ex: Protocolo Reset Metabólico, Método Ciclo das Sementes"
                          className="w-full p-6 rounded-[24px] bg-gray-50 border-2 border-transparent focus:border-emerald-500/30 outline-none font-bold text-lg transition-all"
                       />
                       <p className="text-[10px] text-gray-400 font-medium ml-2">Não venda nutrição, venda um método. Dê um nome ao seu processo.</p>
                    </div>

                    <div className="space-y-3">
                       <div className="flex justify-between items-center">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">O Inimigo Comum (Contra o que você luta?) <Ban size={12} className="text-red-400"/></label>
                       </div>
                       <input 
                          type="text" 
                          value={profile.commonEnemy || ''}
                          onChange={(e) => updateProfile({ commonEnemy: e.target.value })}
                          placeholder="Ex: Terrorismo Nutricional, Dietas da Fome, Indústria do Glúten"
                          className="w-full p-6 rounded-[24px] bg-gray-50 border-2 border-transparent focus:border-red-500/20 outline-none font-bold text-lg transition-all"
                       />
                       <p className="text-[10px] text-gray-400 font-medium ml-2">Para ter fãs, você precisa de inimigos. Quem é o vilão da história do seu paciente?</p>
                    </div>

                    <div className="space-y-3">
                       <div className="flex justify-between items-center">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">A Promessa (Resultado em 90 dias) <Magnet size={12} className="text-emerald-500"/></label>
                       </div>
                       <input 
                          type="text" 
                          value={profile.promise90Days}
                          onChange={(e) => updateProfile({ promise90Days: e.target.value })}
                          placeholder="Ex: Emagreça 8kg em 90 dias comendo o que gosta"
                          className="w-full p-6 rounded-[24px] bg-gray-50 border-2 border-transparent focus:border-emerald-500/30 outline-none font-bold text-lg transition-all"
                       />
                       <p className="text-[10px] text-gray-400 font-medium ml-2">Seja específica. Tempo + Resultado claro.</p>
                    </div>
                 </div>
              </section>

              <section className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
                 <header className="flex items-center gap-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl"><Crown size={24}/></div>
                    <h3 className="text-2xl font-black text-gray-900">Personalidade de Marca</h3>
                 </header>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {archetypes.map((a) => (
                     <button 
                       key={a.id}
                       onClick={() => updateProfile({ archetype: a.id })}
                       className={`p-6 rounded-[32px] border-4 text-left transition-all flex items-center gap-6 ${profile.archetype === a.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-50 bg-white hover:border-gray-100'}`}
                     >
                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0 ${a.color}`}>
                         {a.icon}
                       </div>
                       <div>
                         <h4 className="font-black text-gray-900 text-md">{a.label}</h4>
                         <p className="text-[10px] text-gray-400 font-medium leading-relaxed">{a.desc}</p>
                       </div>
                     </button>
                   ))}
                 </div>
              </section>
            </div>
          )}

          {activeTab === 'visual' && (
            <div className="space-y-10 animate-in slide-in-from-left-4 duration-500">
               {/* BRAND MAGIC SETUP - AUTO ONBOARDING */}
               <section className="bg-gradient-to-r from-purple-600 to-indigo-600 p-10 rounded-[40px] shadow-2xl text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10"><Instagram size={140} /></div>
                  <div className="relative z-10 space-y-6">
                     <div>
                        <div className="flex items-center gap-2 mb-2">
                           <Sparkles size={18} className="text-yellow-400" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-purple-200">Brand Magic Setup</span>
                        </div>
                        <h3 className="text-3xl font-black">Importar do Instagram</h3>
                        <p className="text-purple-100/80 mt-2 font-medium max-w-lg">
                           Cole seu @usuário e nossa IA irá extrair sua paleta de cores e foto de perfil automaticamente. Comece com o pé direito.
                        </p>
                     </div>
                     <div className="flex gap-4">
                        <div className="flex-1 bg-white/10 border border-white/20 rounded-2xl p-2 flex items-center gap-3 px-6">
                           <span className="text-purple-200">@</span>
                           <input 
                              value={instagramInput}
                              onChange={(e) => setInstagramInput(e.target.value)}
                              placeholder="seu.usuario"
                              className="bg-transparent border-none text-white placeholder:text-purple-300/50 font-bold outline-none w-full"
                           />
                        </div>
                        <button 
                           onClick={handleAutoBrandAnalysis}
                           disabled={isAnalyzing || !instagramInput}
                           className="px-8 py-4 bg-white text-purple-600 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-purple-50 transition-all flex items-center gap-2 disabled:opacity-70 shadow-lg"
                        >
                           {isAnalyzing ? <Loader2 className="animate-spin" /> : <Zap size={16} />}
                           {isAnalyzing ? 'Extraindo...' : 'Analisar'}
                        </button>
                     </div>
                  </div>
               </section>

               <section className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-10">
                  <header className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Palette size={24}/></div>
                    <h3 className="text-2xl font-black text-gray-900">Design System</h3>
                  </header>

                  <div className="space-y-8">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Logo Principal</label>
                       {brand.logoUrl ? (
                         <div className="relative group w-fit">
                            <img src={brand.logoUrl} className="h-20 w-auto rounded-xl border p-4 bg-gray-50" />
                            <button onClick={() => updateBrand({ logoUrl: undefined })} className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><X size={14} /></button>
                         </div>
                       ) : (
                         <div onClick={() => logoInputRef.current?.click()} className="border-2 border-dashed border-gray-200 rounded-[24px] p-10 flex flex-col items-center justify-center gap-4 hover:border-emerald-300 transition-colors cursor-pointer group bg-gray-50/50">
                            <input type="file" ref={logoInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
                            <Upload className="text-gray-300 group-hover:text-emerald-500" />
                            <p className="font-bold text-xs text-gray-400 uppercase tracking-widest">Subir Logo PNG</p>
                         </div>
                       )}
                    </div>

                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Paleta de 3 Cores (Dominante, Contraste, Detalhe)</label>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {COLOR_PRESETS.map((preset, i) => (
                            <button 
                              key={i} 
                              onClick={() => updateBrand({ colorPrimary: preset.detail, colorContrast: preset.contrast, colorBackground: preset.dominant, colorText: preset.contrast, colorDetail: preset.detail })}
                              className={`flex items-center justify-between p-5 rounded-[24px] border-4 transition-all ${brand.colorBackground === preset.dominant ? 'border-emerald-500 bg-emerald-50' : 'border-gray-50 bg-white'}`}
                            >
                               <div className="flex -space-x-2">
                                  <div className="w-8 h-8 rounded-full border-2 border-white shadow-sm" style={{ background: preset.dominant }} title="Dominante" />
                                  <div className="w-8 h-8 rounded-full border-2 border-white shadow-sm" style={{ background: preset.contrast }} title="Contraste" />
                                  <div className="w-8 h-8 rounded-full border-2 border-white shadow-sm" style={{ background: preset.detail }} title="Detalhe" />
                               </div>
                               <span className="text-[11px] font-black text-gray-700 uppercase tracking-widest">{preset.name}</span>
                               {brand.colorBackground === preset.dominant && <Check size={16} className="text-emerald-600" />}
                            </button>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Par de Fontes (Header + Body)</label>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {FONT_PAIRS.map((pair) => (
                            <button 
                              key={pair.id}
                              onClick={() => updateBrand({ fontTitle: pair.title, fontBody: pair.body })}
                              className={`p-6 rounded-[24px] border-4 text-left transition-all ${brand.fontTitle === pair.title ? 'border-emerald-500 bg-emerald-50' : 'border-gray-50 bg-white'}`}
                            >
                               <h4 className="text-xl font-black" style={{ fontFamily: pair.title }}>{pair.title}</h4>
                               <p className="text-xs text-gray-400 font-medium mt-1">{pair.body} • {pair.label}</p>
                            </button>
                          ))}
                       </div>
                    </div>
                  </div>
               </section>
            </div>
          )}
        </div>

        {/* MANIFESTO PREVIEW */}
        <div className="lg:col-span-1 space-y-8">
           <div className="sticky top-8 space-y-6">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] px-4">Meu Manifesto da Marca</h3>
              
              <div 
                id="brand-manifesto-card"
                className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100 flex flex-col p-12 space-y-12 transition-all duration-700"
                style={{ backgroundColor: brand.colorBackground, color: brand.colorText, borderRadius: ARCHETYPES_CONFIG[profile.archetype].dna.borderRadius }}
              >
                 <header className="flex justify-between items-start">
                    {brand.logoUrl ? <img src={brand.logoUrl} className="h-10 w-auto object-contain" /> : <span className="font-black tracking-tighter text-2xl" style={{ color: brand.colorPrimary }}>N.AI</span>}
                    <div className="flex flex-col items-end opacity-40">
                       <span className="text-[8px] font-black uppercase tracking-widest">{profile.specialty}</span>
                       <span className="text-[8px] font-black uppercase tracking-widest">Brand Hub 2.0</span>
                    </div>
                 </header>

                 <div className="space-y-10">
                    <div className="space-y-2">
                       <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30" style={{ color: brand.colorPrimary }}>EU LUTO CONTRA</span>
                       <p className="text-3xl font-black leading-tight" style={{ fontFamily: brand.fontTitle }}>{profile.commonEnemy || 'Seu Inimigo Comum'}</p>
                    </div>

                    <div className="space-y-2">
                       <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30" style={{ color: brand.colorPrimary }}>EU DEFENDO O</span>
                       <p className="text-3xl font-black leading-tight" style={{ fontFamily: brand.fontTitle }}>{profile.uniqueMechanism || 'Seu Mecanismo Único'}</p>
                    </div>

                    <div className="space-y-2">
                       <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30" style={{ color: brand.colorPrimary }}>MINHA MISSÃO É</span>
                       <p className="text-2xl font-bold leading-relaxed opacity-80" style={{ fontFamily: brand.fontBody }}>{profile.promise90Days || 'Sua Promessa de 90 Dias'}</p>
                    </div>
                 </div>

                 <footer className="mt-auto pt-10 border-t border-black/5 flex justify-between items-center">
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-40">@{profile.instagramHandle}</span>
                    <div className="w-8 h-1 rounded-full" style={{ backgroundColor: brand.colorPrimary }} />
                 </footer>
              </div>

              <div className="grid grid-cols-1 gap-4">
                 <button 
                   onClick={handleDownloadManifesto}
                   className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 hover:bg-black transition-all"
                 >
                    <Download size={18}/> Baixar Manifesto PNG
                 </button>
                 <div className="p-6 bg-emerald-50 rounded-3xl flex items-start gap-4">
                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl"><Zap size={16}/></div>
                    <p className="text-[11px] text-emerald-900 font-bold leading-relaxed">
                       Este manifesto agora está <span className="underline">vinculado ao cérebro da IA</span>. Todos os novos posts serão calibrados para atacar seu inimigo e defender seu método.
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BrandHub;
