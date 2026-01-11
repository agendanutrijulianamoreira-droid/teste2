
import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, Download, Wand2, Loader2, Sparkles, Image as ImageIcon, CheckCircle2, Maximize, Minimize, Type, Bold, List, AlignLeft, RefreshCw, PlusCircle, Quote, Layout } from 'lucide-react';
import { Material, BrandSettings, UserProfile } from '../types';
import { generateImage, refineMaterialText } from '../services/geminiService';

interface MaterialEditorProps {
  material: Material;
  onClose: () => void;
  brand: BrandSettings;
  profile: UserProfile;
}

const MaterialEditor: React.FC<MaterialEditorProps> = ({ material, onClose, brand, profile }) => {
  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  const [pages, setPages] = useState(material.pages);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [isRefiningText, setIsRefiningText] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [zoom, setZoom] = useState(0.8);
  const [activeAiTool, setActiveAiTool] = useState<string | null>(null);

  const currentPage = pages[currentPageIdx];

  const updatePageAt = (index: number, data: Partial<typeof currentPage>) => {
    const updated = [...pages];
    updated[index] = { ...updated[index], ...data };
    setPages(updated);
  };

  const handleAiRefinement = async (action: 'improve' | 'expand' | 'summarize') => {
    if (!currentPage.content) return;
    setIsRefiningText(true);
    setActiveAiTool(action);
    try {
      const refined = await refineMaterialText(profile, currentPage.content, action);
      updatePageAt(currentPageIdx, { content: refined });
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefiningText(false);
      setActiveAiTool(null);
    }
  };

  const handleGenerateImage = async () => {
    setIsGeneratingImg(true);
    try {
      const prompt = currentPage.imagePrompt || currentPage.title;
      // Fixed: generateImage only accepts prompt as argument in geminiService.ts
      const url = await generateImage(prompt);
      updatePageAt(currentPageIdx, { imageUrl: url });
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingImg(false);
    }
  };

  const exportToPdf = () => {
    setIsExporting(true);
    const element = document.getElementById('material-export-container');
    if (!element) return;

    const opt = {
      margin: 0,
      filename: `${material.title.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // @ts-ignore
    window.html2pdf().from(element).set(opt).save().then(() => {
      setIsExporting(false);
    });
  };

  return (
    <div className="fixed inset-0 bg-[#F9FAFB] z-50 flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden">
      {/* Editor Header */}
      <header className="h-24 bg-white border-b flex items-center justify-between px-12 shrink-0 z-50 shadow-sm">
        <div className="flex items-center gap-10">
          <button onClick={onClose} className="p-3.5 hover:bg-gray-100 rounded-full transition-all group">
            <X size={24} className="group-hover:rotate-90 transition-transform text-gray-500" />
          </button>
          <div className="flex flex-col">
              <h3 className="font-black text-xl text-gray-900 leading-tight">{material.title}</h3>
              <div className="flex gap-4 mt-1">
                 <span className="text-[10px] text-emerald-600 font-black uppercase tracking-[0.2em]">Página {currentPageIdx + 1} de {pages.length}</span>
                 <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded ${material.mode === 'auto' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-400'}`}>
                   MODO {material.mode.toUpperCase()}
                 </span>
              </div>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
           <div className="hidden lg:flex items-center gap-3 bg-emerald-50/50 px-5 py-2.5 rounded-2xl text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-100/50">
             <CheckCircle2 size={16} /> Salvamento Local Ativo
           </div>
           <button 
             onClick={exportToPdf}
             disabled={isExporting}
             className="bg-gray-900 text-white px-10 py-4 rounded-[20px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-gray-800 transition-all flex items-center gap-3 disabled:opacity-50"
           >
             {isExporting ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />} 
             {isExporting ? 'Finalizando...' : 'Exportar PDF de Elite'}
           </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar: AI Tools & Controls */}
        <aside className="w-[400px] bg-white border-r overflow-y-auto p-12 space-y-12 z-40 custom-scrollbar">
           
           <section className="space-y-6">
             <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Título da Página</label>
                <Type size={16} className="text-gray-300" />
             </div>
             <input 
               type="text" 
               value={currentPage.title} 
               onChange={(e) => updatePageAt(currentPageIdx, { title: e.target.value })}
               placeholder="Ex: O Mecanismo de Cura"
               className="w-full p-6 rounded-[24px] bg-gray-50 border-none text-lg font-black focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-gray-300"
             />
           </section>

           {material.mode !== 'manual' && (
             <section className="space-y-8 bg-emerald-950 p-10 rounded-[40px] text-white shadow-2xl shadow-emerald-900/30">
                <header className="flex items-center gap-4">
                   <div className="p-3 bg-emerald-500 rounded-2xl shadow-lg">
                      <Sparkles size={20} />
                   </div>
                   <h4 className="text-[11px] font-black uppercase tracking-[0.3em]">AI Co-Pilot PRO</h4>
                </header>
                
                <div className="grid grid-cols-1 gap-4">
                   {[
                     { id: 'improve', icon: <RefreshCw size={20} />, label: 'Polir Escrita', sub: 'Refinamento estratégico' },
                     { id: 'expand', icon: <PlusCircle size={20} />, label: 'Expandir Tópico', sub: 'Adicionar base clínica' },
                     { id: 'summarize', icon: <List size={20} />, label: 'Resumir Prática', sub: 'Gerar Checklist' },
                   ].map(tool => (
                     <button 
                       key={tool.id}
                       onClick={() => handleAiRefinement(tool.id as any)}
                       disabled={isRefiningText || !currentPage.content}
                       className={`flex items-center gap-5 p-5 rounded-[24px] transition-all text-left group ${activeAiTool === tool.id ? 'bg-emerald-500 shadow-xl' : 'bg-white/10 hover:bg-white/20'}`}
                     >
                        <div className={`${activeAiTool === tool.id ? 'animate-spin' : 'group-hover:scale-110 transition-transform'}`}>
                          {activeAiTool === tool.id ? <Loader2 /> : tool.icon}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black uppercase tracking-widest">{tool.label}</span>
                          <span className="text-[9px] opacity-60 font-bold">{tool.sub}</span>
                        </div>
                     </button>
                   ))}
                </div>
             </section>
           )}

           <section className="space-y-6">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Visual & Mídia</label>
              <div className="flex flex-col gap-6">
                 {currentPage.imageUrl && (
                   <div className="relative group aspect-[4/3] rounded-[32px] overflow-hidden shadow-xl border-4 border-gray-50">
                      <img src={currentPage.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <button 
                        onClick={() => updatePageAt(currentPageIdx, { imageUrl: undefined })}
                        className="absolute inset-0 bg-red-600/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-black text-xs uppercase tracking-[0.2em] backdrop-blur-sm"
                      >
                         Trocar Imagem
                      </button>
                   </div>
                 )}
                 <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={handleGenerateImage}
                      disabled={isGeneratingImg}
                      className="flex flex-col items-center justify-center gap-4 p-8 bg-gray-50 border-2 border-dashed border-gray-100 rounded-[32px] hover:border-emerald-300 hover:bg-emerald-50 transition-all group"
                    >
                       {isGeneratingImg ? <Loader2 className="animate-spin text-emerald-600" /> : <Sparkles className="text-gray-300 group-hover:text-emerald-600 group-hover:scale-110 transition-transform" />}
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-emerald-600">IA Art ✨</span>
                    </button>
                    <button className="flex flex-col items-center justify-center gap-4 p-8 bg-gray-50 border-2 border-dashed border-gray-100 rounded-[32px] hover:border-gray-300 hover:bg-gray-100 transition-all group">
                       <ImageIcon className="text-gray-300 group-hover:text-gray-600 group-hover:scale-110 transition-transform" />
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-gray-900">Upload</span>
                    </button>
                 </div>
              </div>
           </section>
        </aside>

        {/* Paper Canvas */}
        <div className="flex-1 bg-gray-100 flex flex-col items-center p-20 overflow-auto scroll-smooth relative">
           
           {/* Floating Toolbar */}
           <div className="flex items-center gap-10 mb-16 sticky top-0 bg-white/90 backdrop-blur-2xl px-10 py-5 rounded-[32px] shadow-2xl border border-white z-50 animate-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-6 border-r pr-10">
                 <button onClick={() => setZoom(Math.max(0.4, zoom - 0.1))} className="p-2.5 hover:bg-gray-100 rounded-xl text-gray-400 transition-colors"><Minimize size={22} /></button>
                 <span className="text-sm font-black text-gray-900 w-16 text-center tabular-nums">{Math.round(zoom * 100)}%</span>
                 <button onClick={() => setZoom(Math.min(1.4, zoom + 0.1))} className="p-2.5 hover:bg-gray-100 rounded-xl text-gray-400 transition-colors"><Maximize size={22} /></button>
              </div>

              <div className="flex items-center gap-4 border-r pr-10">
                 <button className="p-2.5 hover:bg-gray-100 rounded-xl text-gray-700 font-black">B</button>
                 <button className="p-2.5 hover:bg-gray-100 rounded-xl text-gray-700 underline">U</button>
                 <button className="p-2.5 hover:bg-gray-100 rounded-xl text-gray-700">“</button>
                 <button className="p-2.5 hover:bg-gray-100 rounded-xl text-gray-700"><List size={18} /></button>
              </div>

              <div className="flex items-center gap-8">
                <button 
                  onClick={() => setCurrentPageIdx(Math.max(0, currentPageIdx - 1))}
                  disabled={currentPageIdx === 0}
                  className="p-2.5 hover:bg-gray-100 rounded-full disabled:opacity-20 transition-all border border-gray-100 shadow-sm"
                >
                  <ChevronLeft size={28} />
                </button>
                <div className="flex flex-col items-center">
                  <span className="font-black text-[10px] text-gray-900 tracking-[0.3em] uppercase">{currentPageIdx + 1} / {pages.length}</span>
                  <div className="flex gap-1 mt-1">
                    {pages.map((_, i) => (
                      <div key={i} className={`h-1 rounded-full transition-all ${i === currentPageIdx ? 'w-4 bg-emerald-500' : 'w-1 bg-gray-200'}`} />
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => setCurrentPageIdx(Math.min(pages.length - 1, currentPageIdx + 1))}
                  disabled={currentPageIdx === pages.length - 1}
                  className="p-2.5 hover:bg-gray-100 rounded-full disabled:opacity-20 transition-all border border-gray-100 shadow-sm"
                >
                  <ChevronRight size={28} />
                </button>
              </div>
           </div>

           {/* Export Container (A4) */}
           <div 
             id="material-export-container" 
             className="flex flex-col gap-0 origin-top shadow-[0_60px_150px_rgba(0,0,0,0.15)] mb-40 bg-white"
             style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
           >
              {pages.map((page, idx) => (
                <div 
                  key={idx}
                  className={`relative flex flex-col overflow-hidden transition-opacity duration-500 ${idx !== currentPageIdx && !isExporting ? 'hidden' : 'block'}`}
                  style={{ 
                    width: '210mm', 
                    height: '297mm', 
                    fontFamily: brand.fontBody,
                    backgroundColor: brand.colorBackground,
                    color: brand.colorText,
                    pageBreakAfter: 'always'
                  }}
                >
                   {/* Layout dinâmico A4 */}
                   {page.type === 'cover' ? (
                      <div className="h-full flex flex-col relative">
                         {page.imageUrl && <img src={page.imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-20" />}
                         <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center p-32 space-y-20">
                            <div className="w-32 h-2.5 bg-emerald-600 rounded-full" style={{ backgroundColor: brand.colorPrimary }} />
                            <h1 className="text-9xl font-black leading-[0.9] tracking-tighter" style={{ fontFamily: brand.fontTitle, color: brand.colorPrimary }}>{page.title}</h1>
                            
                            <div 
                              contentEditable={idx === currentPageIdx && !isExporting}
                              suppressContentEditableWarning
                              onBlur={(e) => updatePageAt(idx, { content: e.currentTarget.innerText })}
                              className="text-4xl font-medium opacity-70 max-w-3xl leading-relaxed outline-none cursor-text px-4 py-2 border-2 border-transparent hover:border-emerald-100 rounded-2xl transition-all"
                            >
                              {page.content}
                            </div>

                            <div className="pt-40 flex flex-col items-center">
                               <div className="w-px h-32 bg-gray-100 mb-10" />
                               <p className="text-[12px] font-black tracking-[0.6em] uppercase opacity-40 mb-4">Autoria Estratégica</p>
                               <p className="text-4xl font-black" style={{ fontFamily: brand.fontTitle }}>{profile.fullName}</p>
                            </div>
                         </div>
                         <footer className="h-32 bg-gray-900 text-white flex items-center justify-between px-28 relative z-10">
                            <span className="text-[12px] font-black tracking-widest opacity-40 uppercase">© {new Date().getFullYear()} • NUTRI.AI SYSTEM</span>
                            <div className="flex items-center gap-4">
                               <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                               <span className="text-[12px] font-black tracking-[0.4em] opacity-80 uppercase">{profile.specialty}</span>
                            </div>
                         </footer>
                      </div>
                   ) : (
                      <div className="h-full flex flex-col p-32">
                         <header className="flex justify-between items-start mb-28 border-b border-gray-100 pb-16">
                            <div className="flex flex-col gap-3">
                               <span className="text-[12px] font-black tracking-[0.5em] opacity-30 uppercase">{material.title}</span>
                               <span className="text-4xl font-black leading-tight" style={{ color: brand.colorPrimary, fontFamily: brand.fontTitle }}>{page.title}</span>
                            </div>
                            {brand.logoUrl ? (
                              <img src={brand.logoUrl} className="h-16 w-auto object-contain" />
                            ) : (
                              <div className="px-6 py-4 border-[6px] border-emerald-600 rounded-[24px] text-emerald-600 font-black text-2xl tracking-tighter">N.AI</div>
                            )}
                         </header>

                         <div className="flex-1 flex gap-24">
                            <div className="flex-1">
                               <div 
                                 contentEditable={idx === currentPageIdx && !isExporting}
                                 suppressContentEditableWarning
                                 onBlur={(e) => updatePageAt(idx, { content: e.currentTarget.innerText })}
                                 className="whitespace-pre-wrap leading-[1.8] text-2xl text-gray-800 opacity-90 outline-none cursor-text px-4 py-2 border-2 border-transparent hover:border-emerald-50 rounded-2xl transition-all" 
                                 style={{ fontSize: '1.45rem' }}
                               >
                                 {page.content}
                               </div>
                            </div>
                            
                            {page.imageUrl && (
                               <div className="w-[360px] h-fit sticky top-0">
                                  <div className="relative">
                                     <div className="absolute -inset-8 bg-emerald-50 rounded-[56px] -rotate-2" />
                                     <img src={page.imageUrl} className="relative w-full aspect-[3/4] object-cover rounded-[40px] shadow-2xl border-4 border-white" />
                                  </div>
                                  <div className="mt-16 p-10 bg-gray-50/50 rounded-[40px] border border-gray-100 relative overflow-hidden backdrop-blur-sm">
                                     <Layout className="absolute -right-6 -bottom-6 text-emerald-100/50" size={120} />
                                     <p className="text-[12px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4 relative z-10">Contexto Clínico</p>
                                     <p className="text-md italic font-medium leading-relaxed text-gray-600 relative z-10">
                                       Informação técnica estruturada para facilitar o entendimento do paciente e elevar sua percepção de valor.
                                     </p>
                                  </div>
                               </div>
                            )}
                         </div>

                         <footer className="mt-28 flex justify-between items-center text-[12px] font-black tracking-[0.6em] opacity-20 uppercase border-t border-gray-100 pt-16">
                            <div className="flex gap-14">
                               <span>@{profile.instagramHandle}</span>
                               <span>ELITE MEMBER</span>
                            </div>
                            <span>PAGE {idx + 1} / {pages.length}</span>
                         </footer>
                      </div>
                   )}
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialEditor;
