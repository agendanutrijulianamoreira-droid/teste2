
import React, { useState } from 'react';
import { Plus, BookOpen, FileText, LayoutList, Loader2, Wand2, Trash2, ChevronRight, Eye, Sparkles, MousePointer2, Cpu, Zap, X, ArrowRight, Copy, Target, Crown } from 'lucide-react';
import { Material, MaterialType, UserProfile, BrandSettings, CreationMode } from '../types';
import { generateMaterialContent, generateDistributionKit } from '../services/geminiService';
import MaterialEditor from './MaterialEditor';

interface MaterialsLibraryProps {
  materials: Material[];
  setMaterials: React.Dispatch<React.SetStateAction<Material[]>>;
  profile: UserProfile;
  brand: BrandSettings;
}

const MaterialsLibrary: React.FC<MaterialsLibraryProps> = ({ materials, setMaterials, profile, brand }) => {
  const [showWizard, setShowWizard] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [distributionKit, setDistributionKit] = useState<{ stories: string[], caption: string } | null>(null);
  
  const [newMaterialConfig, setNewMaterialConfig] = useState({
    title: '',
    promise: '',
    type: 'guide' as MaterialType,
    mode: 'auto' as CreationMode,
    acuteSymptom: '', // Novo campo: Sintoma Agudo
    highTicketOffer: profile.productLadder?.high_ticket?.name || '' // Novo campo: Produto High Ticket
  });

  const handleCreateMaterial = async () => {
    setIsGenerating(true);
    try {
      let pages = [];
      if (newMaterialConfig.mode === 'auto') {
        pages = await generateMaterialContent(
            profile, 
            newMaterialConfig.type, 
            newMaterialConfig.title, 
            newMaterialConfig.promise,
            newMaterialConfig.highTicketOffer,
            newMaterialConfig.acuteSymptom
        );
      } else {
        pages = [
          { type: 'cover', title: newMaterialConfig.title || 'Título', content: newMaterialConfig.promise || 'Subtítulo' },
          { type: 'intro', title: 'Contexto', content: 'Introdução...' },
        ];
      }
      
      const newMaterial: Material = {
        id: Math.random().toString(36).substr(2, 9),
        userId: profile.id,
        title: newMaterialConfig.title || 'Novo Material',
        type: newMaterialConfig.type,
        mode: newMaterialConfig.mode,
        pages: pages as any,
        createdAt: new Date().toISOString()
      };
      
      setMaterials(prev => [newMaterial, ...prev]);
      
      // GERA KIT DE DISTRIBUIÇÃO AUTOMÁTICO
      const kit = await generateDistributionKit(profile, newMaterial.title);
      setDistributionKit(kit);
      
      setShowWizard(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (selectedMaterial) {
    return <MaterialEditor material={selectedMaterial} onClose={() => setSelectedMaterial(null)} brand={brand} profile={profile} />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Materiais Ricos</h2>
          <p className="text-gray-500 mt-1">Sua fábrica de iscas digitais e autoridade clínica.</p>
        </div>
        <button onClick={() => setShowWizard(true)} className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"><Plus size={18} /> Novo E-book</button>
      </header>

      {distributionKit && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex items-center justify-center p-6">
           <div className="bg-white rounded-[48px] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95">
              <header className="p-10 border-b bg-emerald-50 flex justify-between items-center text-emerald-900">
                 <div className="flex items-center gap-3"><Sparkles /> <h3 className="text-xl font-black">Seu Kit de Distribuição está Pronto!</h3></div>
                 <button onClick={() => setDistributionKit(null)}><X size={24} /></button>
              </header>
              <div className="p-10 space-y-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
                 <div className="space-y-4">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Sequência de Stories (Copia e Cola)</h4>
                    {distributionKit.stories.map((s, i) => (
                       <div key={i} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 relative">
                          <button onClick={() => { navigator.clipboard.writeText(s); alert('Copiado!'); }} className="absolute top-4 right-4 text-emerald-600"><Copy size={16} /></button>
                          <p className="text-sm font-medium text-gray-700 leading-relaxed pr-8">{s}</p>
                       </div>
                    ))}
                 </div>
                 <div className="space-y-4">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Legenda para Feed</h4>
                    <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100 relative">
                       <button onClick={() => { navigator.clipboard.writeText(distributionKit.caption); alert('Copiado!'); }} className="absolute top-4 right-4 text-emerald-600"><Copy size={16} /></button>
                       <p className="text-sm font-medium text-emerald-900 leading-relaxed pr-8">{distributionKit.caption}</p>
                    </div>
                 </div>
              </div>
              <footer className="p-10 border-t bg-gray-50/50"><button onClick={() => setDistributionKit(null)} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs">Concluir</button></footer>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
          {materials.map(m => (
            <div key={m.id} className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all group flex flex-col">
              <div className="aspect-[3/4] bg-gray-50 relative overflow-hidden flex items-center justify-center p-12">
                 <div className="w-full h-full bg-white shadow-2xl rounded-sm p-8 flex flex-col justify-between border-l-8 border-l-emerald-600">
                   <div className="space-y-4">
                     <div className="w-12 h-1.5 bg-emerald-600" />
                     <h4 className="text-sm font-black leading-tight uppercase tracking-tight text-gray-900">{m.title}</h4>
                   </div>
                 </div>
                 <div className="absolute inset-0 bg-gray-900/40 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-4 backdrop-blur-sm">
                   <button onClick={() => setSelectedMaterial(m)} className="w-16 h-16 bg-white rounded-full text-emerald-700 flex items-center justify-center shadow-xl hover:scale-110 transition-transform"><Eye size={24} /></button>
                 </div>
              </div>
              <div className="p-10 space-y-6">
                 <h3 className="font-bold text-gray-900 text-xl truncate leading-tight">{m.title}</h3>
                 <button onClick={() => setSelectedMaterial(m)} className="w-full py-5 border-2 border-gray-100 rounded-[20px] text-emerald-600 text-xs font-black uppercase tracking-widest hover:bg-emerald-50 hover:border-emerald-100 transition-all flex items-center justify-center gap-2">
                   Editar Conteúdo <ChevronRight size={16} />
                 </button>
              </div>
            </div>
          ))}
      </div>

      {showWizard && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[48px] w-full max-w-4xl overflow-hidden shadow-2xl">
            {isGenerating ? (
              <div className="p-32 text-center space-y-12">
                 <Loader2 size={100} className="animate-spin text-emerald-600 mx-auto" />
                 <h3 className="text-4xl font-black text-gray-900">Aplicando Protocolo de Elite...</h3>
                 <div className="space-y-2 text-gray-500 font-medium">
                    <p>Criando Capa Magnética...</p>
                    <p>Estruturando Pequena Vitória...</p>
                    <p>Conectando Oferta High-Ticket...</p>
                 </div>
              </div>
            ) : (
              <div className="p-16 space-y-10">
                <header className="text-center">
                  <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">Protocolo Definitivo</div>
                  <h3 className="text-4xl font-black text-gray-900">Nova Isca Digital Magnética</h3>
                  <p className="text-gray-500 mt-2 max-w-lg mx-auto">Não crie apenas "conteúdo". Crie uma amostra de autoridade que resolve um sintoma agudo e vende sua mentoria.</p>
                </header>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Título da Isca</label>
                         <input type="text" value={newMaterialConfig.title} onChange={e => setNewMaterialConfig({...newMaterialConfig, title: e.target.value})} placeholder="Ex: Manual do Alívio Imediato" className="w-full p-5 rounded-2xl bg-gray-50 border-none font-bold text-gray-900 outline-none focus:ring-2 focus:ring-emerald-500/20" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Target size={14}/> Qual SINTOMA AGUDO ela resolve?</label>
                         <input type="text" value={newMaterialConfig.acuteSymptom} onChange={e => setNewMaterialConfig({...newMaterialConfig, acuteSymptom: e.target.value})} placeholder="Ex: Inchaço abdominal pós-almoço" className="w-full p-5 rounded-2xl bg-gray-50 border-none font-bold text-gray-900 outline-none focus:ring-2 focus:ring-emerald-500/20" />
                         <p className="text-[10px] text-gray-400 font-medium">Foque na dor urgente, não na causa raiz.</p>
                      </div>
                   </div>
                   
                   <div className="space-y-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Promessa (Vitória Rápida)</label>
                         <input type="text" value={newMaterialConfig.promise} onChange={e => setNewMaterialConfig({...newMaterialConfig, promise: e.target.value})} placeholder="Ex: Desinchar em 24 horas" className="w-full p-5 rounded-2xl bg-gray-50 border-none font-bold text-gray-900 outline-none focus:ring-2 focus:ring-emerald-500/20" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Crown size={14}/> Qual Produto High-Ticket ela vende?</label>
                         <input type="text" value={newMaterialConfig.highTicketOffer} onChange={e => setNewMaterialConfig({...newMaterialConfig, highTicketOffer: e.target.value})} placeholder="Ex: Mentoria Desinflamação 90 Dias" className="w-full p-5 rounded-2xl bg-gray-50 border-none font-bold text-gray-900 outline-none focus:ring-2 focus:ring-emerald-500/20" />
                         <p className="text-[10px] text-gray-400 font-medium">A IA criará a ponte de venda no final do PDF.</p>
                      </div>
                   </div>
                </div>

                <div className="flex gap-4 pt-4">
                   <button onClick={() => setShowWizard(false)} className="px-8 py-5 bg-gray-100 text-gray-500 rounded-[24px] font-black uppercase text-xs tracking-widest hover:bg-gray-200 transition-all">Cancelar</button>
                   <button 
                     onClick={handleCreateMaterial} 
                     disabled={!newMaterialConfig.title || !newMaterialConfig.acuteSymptom || !newMaterialConfig.highTicketOffer}
                     className="flex-1 py-5 bg-emerald-600 text-white rounded-[24px] font-black uppercase text-xs tracking-widest shadow-xl shadow-emerald-200 hover:bg-emerald-700 hover:scale-[1.01] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
                   >
                      <Wand2 size={18} /> Orquestrar PDF Vendedor (10+ Páginas)
                   </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialsLibrary;
