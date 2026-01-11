
import React from 'react';
import { BrandSettings, UserProfile, CarouselSlide, PostFormat, PostTemplate } from '../types';

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
  const getFontSizeClass = () => {
    if (charCount < 50) return 'text-4xl sm:text-5xl leading-tight'; // Headline Mode
    if (charCount < 100) return 'text-2xl sm:text-3xl leading-snug'; // Subheadline Mode
    if (charCount > 200) return 'text-sm sm:text-base leading-relaxed'; // Body Mode
    return 'text-lg sm:text-2xl leading-relaxed'; // Standard Mode
  };

  const getTitleSizeClass = () => {
    return charCount < 30 ? 'text-5xl sm:text-6xl' : 'text-3xl sm:text-4xl';
  };

  const pagination = `${index + 1}/${totalSlides}`;
  const handle = `@${profile.instagramHandle.toLowerCase()}`;
  const userPhotoPlaceholder = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName)}&background=random&color=fff`;
  const userPhoto = (profile.personalPhotos && profile.personalPhotos.length > 0) ? profile.personalPhotos[0] : userPhotoPlaceholder;

  // 1. Template: The Clinical Journal (Elegant / Serif)
  if (templateVariant === 'clinical_journal') {
    return (
      <div 
        className="relative w-full aspect-[4/5] overflow-hidden p-2 group shadow-inner transition-colors duration-500"
        style={{ backgroundColor: brand.colorBackground }}
      >
        {/* Borda Interna Inset */}
        <div className="absolute inset-4 border opacity-30 pointer-events-none z-10" style={{ borderColor: brand.colorDetail }} />
        
        <div className="relative h-full flex flex-col p-8 sm:p-10 z-20">
          <header className="flex justify-between items-start border-t-2 pt-4 mb-6 sm:mb-8" style={{ borderColor: brand.colorContrast }}>
            <span className="font-black text-[8px] sm:text-[10px] tracking-[0.4em] uppercase" style={{ fontFamily: brand.fontBody, color: brand.colorContrast }}>
              {profile.fullName}
            </span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-200 overflow-hidden shrink-0 -mt-2">
              <img src={userPhoto} alt="Nutri" className="w-full h-full object-cover" />
            </div>
          </header>

          <main className="flex-1 flex flex-col justify-center">
            {index === 0 ? (
              <h2 
                className={`${getTitleSizeClass()} font-black mb-6 text-balance uppercase tracking-tight`} 
                style={{ fontFamily: brand.fontTitle, color: brand.colorContrast }}
              >
                {slide.text}
              </h2>
            ) : (
              <p 
                className={`${getFontSizeClass()} font-medium text-balance`} 
                style={{ fontFamily: brand.fontBody, color: brand.colorContrast }}
              >
                {slide.text}
              </p>
            )}
          </main>

          <footer className="flex justify-between items-center mt-auto pt-6 border-t" style={{ borderColor: `${brand.colorContrast}20` }}>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60" style={{ color: brand.colorContrast }}>{handle}</span>
            <span className="text-[10px] font-black" style={{ color: brand.colorContrast }}>{pagination}</span>
          </footer>
        </div>

        {slide.imageUrl && (
          <div className="absolute inset-0 z-0">
             <img src={slide.imageUrl} className="w-full h-full object-cover opacity-10 grayscale hover:grayscale-0 transition-all duration-700" alt="" />
          </div>
        )}
      </div>
    );
  }

  // 2. Template: Modern Tweet (Clean / Pop / Card)
  if (templateVariant === 'modern_tweet') {
    return (
      <div className="relative w-full aspect-[4/5] bg-slate-100 overflow-hidden flex items-center justify-center p-6 sm:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200/50 via-transparent to-gray-300/30 pointer-events-none" />
        
        {/* Background Accent Blur */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] opacity-40" style={{ backgroundColor: brand.colorPrimary }} />

        <div className="relative z-10 w-full bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[24px] sm:rounded-[32px] p-8 sm:p-10 flex flex-col gap-6">
          <header className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-white shadow-sm">
              <img src={userPhoto} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-gray-900 leading-tight text-sm sm:text-base">{profile.fullName}</span>
              <span className="text-gray-400 text-xs font-medium tracking-tight">@{profile.instagramHandle.toLowerCase()}</span>
            </div>
          </header>

          <main className="flex-1 min-h-[100px] flex items-center">
             <div className={`${getFontSizeClass()} font-bold text-gray-900 text-left text-balance`} style={{ fontFamily: 'Inter' }}>
                {slide.text?.split(' ').map((word, i) => {
                  const isHighlight = word.length > 5 && i % 3 === 0; // Smart highlight
                  return (
                    <span key={i} className={isHighlight ? 'px-1 rounded-sm' : ''} style={{ backgroundColor: isHighlight ? `${brand.colorPrimary}30` : 'transparent' }}>
                      {word}{' '}
                    </span>
                  );
                })}
             </div>
          </main>

          <footer className="flex justify-between items-center text-gray-300 border-t border-gray-50 pt-4 sm:pt-6">
             <div className="flex gap-4 text-gray-400 text-xs font-medium">
               <span>{new Date().toLocaleDateString()}</span>
             </div>
             <span className="text-[12px] font-black text-gray-900 bg-gray-100 px-2 py-1 rounded-md">{pagination}</span>
          </footer>
        </div>
      </div>
    );
  }

  // 3. Template: Dark Aesthetic (Bold / High Contrast)
  if (templateVariant === 'dark_aesthetic') {
    return (
      <div className="relative w-full aspect-[4/5] bg-black overflow-hidden group">
        {slide.imageUrl ? (
          <img src={slide.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <div className="absolute inset-0 opacity-20" style={{ backgroundColor: brand.colorPrimary }} />
        )}

        {/* Overlay Dramático */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />
        
        <div className="relative h-full z-20 flex flex-col p-10 sm:p-12 text-white">
          <header className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="font-black text-[9px] tracking-[0.3em] uppercase opacity-90 text-emerald-400" style={{ color: brand.colorPrimary }}>{profile.fullName}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-[10px] font-black border border-white/20">
              {pagination}
            </div>
          </header>

          <main className="flex-1 flex flex-col items-center justify-center text-center px-2">
             <h2 
               className={`${getTitleSizeClass()} font-black leading-[1.1] mb-4 text-balance drop-shadow-2xl`}
               style={{ fontFamily: 'Inter' }}
             >
               {slide.text}
             </h2>
             <div className="w-12 h-1 rounded-full mt-6" style={{ backgroundColor: brand.colorPrimary }} />
          </main>

          <footer className="mt-auto backdrop-blur-md bg-white/5 border border-white/10 p-5 rounded-2xl flex justify-between items-center shadow-xl">
            <span className="text-[9px] font-black tracking-[0.2em] uppercase opacity-80 text-white">
              {handle}
            </span>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: brand.colorPrimary }} />
          </footer>
        </div>
      </div>
    );
  }

  return null;
};

export default PostPreview;
