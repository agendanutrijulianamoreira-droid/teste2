
import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar as CalendarIcon, Wand2, Plus, ArrowRight, Loader2, CheckCircle2, X, 
  ChevronLeft, ChevronRight, Download, Sparkles, MousePointer2, Zap, Layers, 
  Image as ImageIcon, Trash2, Video, Heart, Microscope, Target, Flame, LayoutTemplate,
  Monitor, Smartphone, Search, Upload, Palette, Type, Smartphone as MobileIcon,
  FileText, Wand, Grid, List, Shuffle
} from 'lucide-react';
import { STRATEGY_CONFIG, FORMAT_CONFIG, ELITE_GALLERY } from '../constants';
import { StrategyType, Post, UserProfile, BrandSettings, PostFormat, PostTemplate, WeeklyReport } from '../types';
import { generatePostContent, generateImage } from '../services/geminiService';
import PostPreview from '../components/PostPreview';

interface CalendarProps {
  profile: UserProfile;
  brand: BrandSettings;
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  metrics: any[];
  weeklyReports: WeeklyReport[]; 
  onOpenPerformanceWizard: (batchId?: string, batchTitle?: string) => void;
  initialShowSmartPlanner?: boolean;
  initialShowCreate?: boolean;
  clearInitialTriggers?: () => void;
}

const Calendar: React.FC<CalendarProps> = ({ 
  profile, brand, posts, setPosts, metrics, weeklyReports = [], onOpenPerformanceWizard, 
  initialShowSmartPlanner = false, initialShowCreate = false,
  clearInitialTriggers
}) => {
  const [showSmartPlannerModal, setShowSmartPlannerModal] = useState(initialShowSmartPlanner);
  const [showCreateModal, setShowCreateModal] = useState(initialShowCreate);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  
  // Design Studio States
  const [remixColors, setRemixColors] = useState<Partial<BrandSettings> | undefined>(undefined);
  
  // View Modes
  const [viewMode, setViewMode] = useState<'calendar' | 'feed'>('calendar');

  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isVisualMagicRunning, setIsVisualMagicRunning] = useState(false);
  const [targetCellIndex, setTargetCellIndex] = useState<number | null>(null);

  useEffect(() => {
    if (initialShowSmartPlanner) setShowSmartPlannerModal(true);
    if (initialShowCreate) { setShowCreateModal(true); }
    if (clearInitialTriggers) clearInitialTriggers();
  }, [initialShowSmartPlanner, initialShowCreate]);

  // Reset remix when opening new post
  useEffect(() => {
    if (editingPost) setRemixColors(undefined);
  }, [editingPost?.id]);

  const handleDownloadPost = async () => {
    const element = document.getElementById('post-preview-card');
    if (!element) return;
    // @ts-ignore
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const link = document.createElement('a');
    link.download = `post_${editingPost?.content.title || 'nutri'}_slide_${currentSlideIndex + 1}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleVisualMagic = async () => {
    if (!editingPost || !editingPost.content.slides) return;
    setIsVisualMagicRunning(true);
    
    try {
      const updatedSlides = [...editingPost.content.slides];
      for (let i = 0; i < updatedSlides.length; i++) {
        if (!updatedSlides[i].imageUrl) {
          const url = await generateImage(`${updatedSlides[i].text} style ${profile.archetype}`);
          updatedSlides[i].imageUrl = url;
        }
      }
      const updatedPost = { ...editingPost, content: { ...editingPost.content, slides: updatedSlides } };
      setEditingPost(updatedPost);
      setPosts(prev => prev.map(p => p.id === editingPost.id ? updatedPost : p));
    } catch (e) {
      console.error(e);
    } finally {
      setIsVisualMagicRunning(false);
    }
  };

  const handleGenerateSlideImage = async () => {
    if (!editingPost) return;
    setIsGeneratingImage(true);
    const prompt = editingPost.content.slides?.[currentSlideIndex].imagePrompt || editingPost.content.title;
    const url = await generateImage(prompt);
    const updatedSlides = editingPost.content.slides ? [...editingPost.content.slides] : [];
    if (updatedSlides[currentSlideIndex]) {
      updatedSlides[currentSlideIndex].imageUrl = url;
      setEditingPost({...editingPost, content: {...editingPost.content, slides: updatedSlides}});
    }
    setIsGeneratingImage(false);
  };

  const handleRemixColors = () => {
    // Shuffles the primary, secondary, and text colors to create a fresh look
    const colors = [brand.colorPrimary, brand.colorBackground, brand.colorContrast, brand.colorDetail];
    const shuffled = colors.sort(() => 0.5 - Math.random());
    setRemixColors({
      colorBackground: shuffled[0],
      colorContrast: shuffled[1],
      colorPrimary: shuffled[2],
      colorDetail: shuffled[3],
      colorText: shuffled[1]
    });
  };

  const dates = Array.from({ length: 35 }).map((_, i) => i - 3);
  const sortedPosts = [...posts].sort((a, b) => (a.calendarIndex || 0) - (b.calendarIndex || 0));

  const postTemplates: { id: PostTemplate; label: string; icon: any; desc: string }[] = [
    { id: 'clinical_journal', label: 'The Clinical Journal', icon: <Type />, desc: 'Elegante, Bege, Serifado' },
    { id: 'modern_tweet', label: 'Modern Tweet', icon: <MobileIcon />, desc: 'Limpo, Card flutuante' },
    { id: 'dark_aesthetic', label: 'Dark Aesthetic', icon: <Palette />, desc: 'Fundo Escuro, Autoridade' }
  ];

  const userPhotoPlaceholder = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName)}&background=random&color=fff`;
  const userPhoto = (profile.personalPhotos && profile.personalPhotos.length > 0) ? profile.personalPhotos[0] : userPhotoPlaceholder;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex justify-between items-center">
        <div><h2 className="text-3xl font-black text-gray-900 tracking-tight">Calendário Estratégico</h2></div>
        <div className="flex gap-4">
           {/* View Toggle */}
           <div className="flex bg-gray-100 p-1.5 rounded-2xl">
              <button onClick={() => setViewMode('calendar')} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'calendar' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-400'}`}>
                 <CalendarIcon size={14} /> Agenda
              </button>
              <button onClick={() => setViewMode('feed')} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'feed' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-400'}`}>
                 <Grid size={14} /> Feed Preview
              </button>
           </div>
          <button onClick={() => setShowSmartPlannerModal(true)} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-100 flex items-center gap-2 hover:bg-emerald-700 transition-all"><Wand2 size={16} /> Smart Planner ⚡</button>
        </div>
      </header>

      {viewMode === 'calendar' && (
        <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm grid grid-cols-7">
          {dates.map((d, i) => {
            const dayPosts = posts.filter(p => p.calendarIndex === i);
            return (
              <div key={i} onClick={() => d > 0 && d <= 31 && (setTargetCellIndex(i), setShowCreateModal(true))} className={`min-h-[160px] p-4 border-r border-b group relative hover:bg-emerald-50/20 transition-all cursor-pointer ${d < 1 || d > 31 ? 'bg-gray-50/10' : 'bg-white'}`}>
                <div className="flex justify-between items-start">
                   <span className="text-xs font-black text-gray-300">{d > 0 && d <= 31 ? d : ''}</span>
                </div>
                <div className="mt-2 space-y-1">
                  {dayPosts.map(p => (
                    <div key={p.id} onClick={(e) => { e.stopPropagation(); setEditingPost(p); setCurrentSlideIndex(0); }} className={`p-2 rounded-xl text-[10px] font-black uppercase tracking-tighter border shadow-sm ${STRATEGY_CONFIG[p.strategyType]?.color || 'bg-gray-100'} hover:scale-105 transition-transform`}>
                      {p.content.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VISUAL FEED PLANNER (Instagram Grid) */}
      {viewMode === 'feed' && (
        <div className="flex justify-center py-10">
           <div className="w-[375px] bg-white border-8 border-gray-900 rounded-[48px] overflow-hidden shadow-2xl relative">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-20" />
              
              <div className="pt-12 pb-6 px-5 border-b border-gray-100">
                 <header className="flex items-center gap-6 mb-6">
                    <div className="w-20 h-20 rounded-full p-0.5 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500">
                       <div className="w-full h-full rounded-full border-2 border-white overflow-hidden">
                          <img src={userPhoto} className="w-full h-full object-cover" />
                       </div>
                    </div>
                    <div className="flex-1 flex justify-around text-center">
                       <div><p className="font-bold text-gray-900">{posts.length}</p><p className="text-[10px] text-gray-500">Posts</p></div>
                       <div><p className="font-bold text-gray-900">12.5K</p><p className="text-[10px] text-gray-500">Seguidores</p></div>
                       <div><p className="font-bold text-gray-900">1.2K</p><p className="text-[10px] text-gray-500">Seguindo</p></div>
                    </div>
                 </header>
                 <div className="space-y-1">
                    <p className="font-bold text-sm text-gray-900">{profile.fullName}</p>
                    <p className="text-xs text-gray-600">{profile.specialty} • {profile.uniqueMechanism}</p>
                    <p className="text-xs text-blue-600 font-medium cursor-pointer">link.bio/agendamento</p>
                 </div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-3 gap-0.5 bg-white min-h-[400px]">
                 {sortedPosts.map((p) => (
                    <div 
                      key={p.id} 
                      onClick={() => { setEditingPost(p); setCurrentSlideIndex(0); }}
                      className="aspect-square bg-gray-50 relative group cursor-pointer overflow-hidden"
                    >
                       {/* Placeholder Visual ou Imagem */}
                       <div className="w-full h-full flex items-center justify-center p-2 text-center bg-gray-100 text-[8px] font-bold text-gray-400 uppercase break-words hover:bg-gray-200 transition-colors">
                          {p.content.slides?.[0]?.imageUrl ? (
                             <img src={p.content.slides[0].imageUrl} className="w-full h-full object-cover" />
                          ) : (
                             <span style={{color: brand.colorPrimary}}>{p.content.title}</span>
                          )}
                       </div>
                       
                       {/* Type Icon */}
                       <div className="absolute top-1 right-1 text-white drop-shadow-md">
                          {p.format === 'reels' ? <Video size={12} fill="white" /> : <Layers size={12} fill="white" />}
                       </div>
                    </div>
                 ))}
                 {/* Empty Slots */}
                 {Array.from({length: Math.max(0, 9 - sortedPosts.length)}).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square bg-gray-50 border border-transparent" />
                 ))}
              </div>
           </div>
        </div>
      )}

      {/* EDITOR DE POST (DESIGN STUDIO) */}
      {editingPost && (
        <div className="fixed inset-0 bg-white z-[300] flex flex-col overflow-hidden animate-in slide-in-from-right duration-500">
          <header className="h-24 border-b flex items-center justify-between px-10 bg-white shadow-sm shrink-0">
            <div className="flex items-center gap-6">
              <button onClick={() => setEditingPost(null)} className="p-3 hover:bg-gray-100 rounded-full transition-all"><ChevronLeft size={24} /></button>
              <div className="flex flex-col">
                <h3 className="font-black text-xl text-gray-900 leading-tight">{editingPost.content.title}</h3>
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Editando Carrossel</span>
              </div>
            </div>
            <div className="flex gap-4">
               <button 
                 onClick={handleRemixColors}
                 className="px-6 py-4 bg-purple-50 text-purple-600 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-purple-100 transition-all"
               >
                  <Shuffle size={16} /> Remix Cores
               </button>
               <button 
                 onClick={handleVisualMagic} 
                 disabled={isVisualMagicRunning}
                 className="px-8 py-4 bg-purple-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-purple-700 transition-all shadow-lg"
               >
                  {isVisualMagicRunning ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />} 
                  {isVisualMagicRunning ? 'Criando Galeria...' : 'Magia Visual'}
               </button>
               <button onClick={handleDownloadPost} className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-black transition-all shadow-lg"><Download size={16} /> Baixar Arte</button>
               <button onClick={() => setEditingPost(null)} className="px-12 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all">Salvar Projeto</button>
            </div>
          </header>

          <div className="flex-1 overflow-auto bg-gray-100/50 flex gap-0">
             
             {/* MAIN PREVIEW AREA */}
             <div className="flex-1 flex flex-col items-center justify-center p-12">
                <div id="post-preview-card" className="w-[450px] shadow-2xl rounded-2xl overflow-hidden ring-8 ring-white transition-all duration-500">
                   <PostPreview 
                    profile={profile} 
                    brand={brand} 
                    slide={editingPost.content.slides && editingPost.content.slides[currentSlideIndex] ? editingPost.content.slides[currentSlideIndex] : { text: "" }} 
                    index={currentSlideIndex} 
                    totalSlides={editingPost.content.slides ? editingPost.content.slides.length : 1} 
                    format={editingPost.format} 
                    templateVariant={editingPost.templateVariant || 'clinical_journal'}
                    colorOverride={remixColors}
                   />
                </div>
                {editingPost.content.slides && (
                  <div className="flex items-center gap-6 mt-12 bg-white px-8 py-4 rounded-full shadow-xl">
                     <button disabled={currentSlideIndex === 0} onClick={() => setCurrentSlideIndex(currentSlideIndex - 1)} className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-20"><ChevronLeft size={24} /></button>
                     <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{currentSlideIndex + 1} de {editingPost.content.slides.length}</span>
                     <button disabled={currentSlideIndex === editingPost.content.slides.length - 1} onClick={() => setCurrentSlideIndex(currentSlideIndex + 1)} className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-20"><ChevronRight size={24} /></button>
                  </div>
                )}
             </div>

             {/* SIDEBAR: DESIGN STUDIO */}
             <div className="w-[420px] bg-white border-l border-gray-200 overflow-y-auto custom-scrollbar p-10 space-y-10">
                
                <section>
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] block mb-6">Variações de Design</label>
                   <div className="space-y-6">
                      {postTemplates.map((tpl) => (
                         <div 
                           key={tpl.id}
                           onClick={() => setEditingPost({...editingPost, templateVariant: tpl.id})}
                           className={`group cursor-pointer rounded-3xl overflow-hidden border-4 transition-all ${editingPost.templateVariant === tpl.id ? 'border-emerald-500 shadow-xl' : 'border-gray-50 hover:border-gray-200'}`}
                         >
                            <div className="aspect-[4/5] relative pointer-events-none scale-90 origin-top">
                               {/* Live Miniature of the current slide in this template */}
                               <PostPreview 
                                  profile={profile} 
                                  brand={brand} 
                                  slide={editingPost.content.slides && editingPost.content.slides[currentSlideIndex] ? editingPost.content.slides[currentSlideIndex] : { text: "Preview" }} 
                                  index={currentSlideIndex} 
                                  totalSlides={editingPost.content.slides?.length || 1} 
                                  format={editingPost.format} 
                                  templateVariant={tpl.id}
                                  colorOverride={remixColors}
                               />
                            </div>
                            <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                               <p className="font-black text-xs uppercase tracking-widest text-gray-700">{tpl.label}</p>
                            </div>
                         </div>
                      ))}
                   </div>
                </section>

                <div className="w-full h-px bg-gray-100" />

                <section className="space-y-4">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Editor de Texto</label>
                   <textarea 
                     value={editingPost.content.slides && editingPost.content.slides[currentSlideIndex] ? editingPost.content.slides[currentSlideIndex].text : ''} 
                     onChange={(e) => { 
                       const updated = [...(editingPost.content.slides || [])]; 
                       if (updated[currentSlideIndex]) {
                         updated[currentSlideIndex].text = e.target.value; 
                         setEditingPost({...editingPost, content: {...editingPost.content, slides: updated}}); 
                       }
                     }} 
                     className="w-full p-6 bg-gray-50 border-none rounded-3xl font-bold text-base text-gray-700 outline-none focus:ring-4 focus:ring-emerald-500/10 min-h-[160px] leading-relaxed transition-all" 
                     rows={4} 
                     placeholder="Digite o conteúdo do slide..."
                   />
                </section>
                
                <section className="space-y-4">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">IA Art individual</label>
                   <button onClick={handleGenerateSlideImage} disabled={isGeneratingImage} className="w-full py-6 bg-emerald-50 text-emerald-600 rounded-3xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 border-2 border-dashed border-emerald-100 hover:bg-emerald-100 transition-all">
                       {isGeneratingImage ? <Loader2 className="animate-spin" /> : <Sparkles />} {isGeneratingImage ? 'Gerando...' : 'Regerar imagem deste slide'}
                   </button>
                </section>

             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
