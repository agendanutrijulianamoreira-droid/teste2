
import React from 'react';
import { BrandSettings, UserProfile, CarouselSlide, PostFormat, PostTemplate } from '../types';
import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react';

interface PostPreviewProps {
  profile: UserProfile;
  brand: BrandSettings;
  slide: CarouselSlide;
  index: number;
  totalSlides: number;
  format?: PostFormat;
  templateVariant?: PostTemplate;
  colorOverride?: Partial<BrandSettings>; // Support for Remix Colors
}

const PostPreview: React.FC<PostPreviewProps> = ({ 
  profile, 
  brand: globalBrand, 
  slide, 
  index, 
  totalSlides, 
  format = 'carousel',
  templateVariant = 'clinical_journal',
  colorOverride
}) => {
  
  // Merge global brand with overrides (for Remix feature)
  const brand = { ...globalBrand, ...colorOverride };

  // SAFETY CHECK: Prevent crash if slide is undefined
  if (!slide) return null;

  const charCount = slide.text?.length || 0;
  
  // INTELLIGENT FONT SIZING (Auto-Adapt)
  const getFontSizeClass = (baseSize: 'sm' | 'md' | 'lg' = 'md') => {
    if (baseSize === 'lg') {
        if (charCount < 40) return 'text-5xl leading-tight';
        if (charCount < 80) return 'text-3xl leading-snug';
        return 'text-2xl leading-relaxed';
    }
    // Default Text
    if (charCount < 50) return 'text-3xl leading-snug'; 
    if (charCount < 100) return 'text-xl leading-relaxed'; 
    return 'text-lg leading-relaxed'; 
  };

  const pagination = `${index + 1}/${totalSlides}`;
  const handle = `@${profile.instagramHandle.toLowerCase().replace('@','')}`;
  const userPhotoPlaceholder = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName)}&background=random&color=fff`;
  const userPhoto = (profile.personalPhotos && profile.personalPhotos.length > 0) ? profile.personalPhotos[0] : userPhotoPlaceholder;

  // 1. Template: Minimalist (Baseado no modelo Canva Minimalista)
  if (templateVariant === 'clinical_journal') {
    return (
      <div 
        className="relative w-full aspect-[4/5] overflow-hidden flex flex-col"
        style={{ backgroundColor: brand.colorBackground }}
      >
        <div className="flex-1 flex flex-col p-8 sm:p-12 relative z-10">
          {/* Header Minimalista */}
          <header className="flex justify-between items-center mb-8 opacity-60">
             <span className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: brand.colorText }}>{profile.specialty}</span>
             <span className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: brand.colorText }}>{pagination}</span>
          </header>

          <main className="flex-1 flex flex-col justify-center">
            {index === 0 ? (
              // Capa Minimalista
              <div className="space-y-6">
                 <div className="w-12 h-1 mb-6" style={{ backgroundColor: brand.colorPrimary }} />
                 <h2 
                  className="font-serif font-medium text-balance italic leading-[1.1] text-5xl sm:text-6xl"
                  style={{ color: brand.colorText, fontFamily: brand.fontTitle }}
                 >
                   {slide.text}
                 </h2>
                 <p className="text-xs font-medium uppercase tracking-widest mt-4 opacity-70" style={{ color: brand.colorText }}>
                    {profile.fullName}
                 </p>
              </div>
            ) : (
              // Conteúdo Minimalista
              <div className="space-y-6 h-full flex flex-col justify-center">
                 <p 
                   className={`${getFontSizeClass('lg')} font-serif text-balance font-medium`} 
                   style={{ color: brand.colorText, fontFamily: brand.fontTitle }}
                 >
                   {slide.text}
                 </p>
              </div>
            )}
          </main>

          <footer className="mt-auto pt-8 border-t border-black/5 flex justify-between items-end">
             <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full overflow-hidden grayscale">
                   <img src={userPhoto} className="w-full h-full object-cover" />
                </div>
                <span className="text-[9px] font-bold tracking-widest uppercase opacity-50" style={{ color: brand.colorText }}>{handle}</span>
             </div>
             {index === 0 && <div className="text-[30px] opacity-20" style={{ color: brand.colorPrimary }}>✦</div>}
          </footer>
        </div>
      </div>
    );
  }

  // 2. Template: Modern Tweet (Baseado no modelo Canva Twitter)
  if (templateVariant === 'modern_tweet') {
    return (
      <div className="relative w-full aspect-[4/5] bg-gray-100 overflow-hidden flex items-center justify-center p-6">
        {/* Fundo desfocado/textura */}
        <div className="absolute inset-0 opacity-10 pattern-grid-lg" style={{ color: brand.colorPrimary }} />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white to-transparent opacity-50 blur-3xl" />

        {/* Card do Tweet */}
        <div className="relative w-full bg-white shadow-xl rounded-[24px] p-8 flex flex-col gap-6 border border-gray-100/50">
          
          {/* Header do Tweet */}
          <header className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-100">
              <img src={userPhoto} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col leading-tight">
              <div className="flex items-center gap-1.5">
                 <span className="font-bold text-gray-900 text-sm truncate max-w-[140px]">{profile.fullName}</span>
                 <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center text-[8px] text-white">✓</div>
              </div>
              <span className="text-gray-400 text-xs font-normal">{handle}</span>
            </div>
            <div className="ml-auto text-gray-300">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
            </div>
          </header>

          {/* Corpo do Tweet */}
          <main className="flex-1">
             <p className={`${getFontSizeClass('md')} text-gray-800 font-medium leading-relaxed whitespace-pre-wrap`} style={{ fontFamily: 'Inter, sans-serif' }}>
                {slide.text}
             </p>
             {slide.imageUrl && (
                <div className="mt-4 rounded-xl overflow-hidden border border-gray-100">
                   <img src={slide.imageUrl} className="w-full h-auto object-cover max-h-48" />
                </div>
             )}
          </main>

          {/* Metadata & Footer */}
          <footer className="space-y-4">
             <div className="text-[11px] text-gray-400 font-medium border-b border-gray-50 pb-4">
                {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} · {new Date().toLocaleDateString()} · <span className="text-blue-500 font-semibold">Twitter for iPhone</span>
             </div>
             
             {/* Fake Engagement Metrics */}
             <div className="flex justify-between items-center text-gray-500 px-2">
                <div className="flex items-center gap-2 group cursor-pointer">
                   <MessageCircle size={18} className="group-hover:text-blue-500 transition-colors" />
                   <span className="text-xs font-bold">24</span>
                </div>
                <div className="flex items-center gap-2 group cursor-pointer">
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-green-500 transition-colors"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>
                   <span className="text-xs font-bold">12</span>
                </div>
                <div className="flex items-center gap-2 group cursor-pointer">
                   <Heart size={18} className="group-hover:text-red-500 transition-colors" />
                   <span className="text-xs font-bold">148</span>
                </div>
                <div className="flex items-center gap-2 group cursor-pointer">
                   <Bookmark size={18} className="group-hover:text-blue-500 transition-colors" />
                   <span className="text-xs font-bold">42</span>
                </div>
             </div>
          </footer>
        </div>
        
        {/* Pagination Pill */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full">
           {pagination}
        </div>
      </div>
    );
  }

  // 3. Template: Dark Aesthetic (High Contrast / Authority)
  if (templateVariant === 'dark_aesthetic') {
    return (
      <div className="relative w-full aspect-[4/5] bg-[#0A0A0A] overflow-hidden group flex flex-col">
        {slide.imageUrl ? (
          <div className="absolute inset-0 opacity-40">
             <img src={slide.imageUrl} alt="" className="w-full h-full object-cover grayscale mix-blend-overlay" />
             <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent" />
          </div>
        ) : (
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-b from-white/5 to-transparent rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        )}
        
        <div className="relative h-full z-20 flex flex-col p-10 sm:p-12 text-white justify-between">
          <header className="flex justify-between items-center border-b border-white/10 pb-6">
            <span className="font-black text-[10px] tracking-[0.3em] uppercase text-white/50">{profile.fullName}</span>
            <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-[9px] font-bold bg-white/5">
              {index + 1}
            </div>
          </header>

          <main className="flex-1 flex flex-col justify-center py-8">
             <h2 
               className={`${getFontSizeClass('lg')} font-black leading-[1.1] text-balance tracking-tight`}
               style={{ fontFamily: 'Inter', textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
             >
               {slide.text}
             </h2>
             {index === 0 && (
                <div className="w-16 h-1 mt-8 bg-white" />
             )}
          </main>

          <footer className="flex justify-between items-center">
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase opacity-40">
              {handle}
            </span>
            <div className="flex gap-1">
               {Array.from({length: totalSlides}).map((_, i) => (
                  <div key={i} className={`h-1 rounded-full transition-all ${i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/20'}`} />
               ))}
            </div>
          </footer>
        </div>
      </div>
    );
  }

  return null;
};

export default PostPreview;
