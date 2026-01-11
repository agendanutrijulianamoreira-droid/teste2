
import React from 'react';
import { Lock, CheckCircle2, Circle, ArrowRight, ShieldAlert, Rocket } from 'lucide-react';
import { UserProfile } from '../types';

interface PlannerGuardProps {
  profile: UserProfile;
  onNavigate: (page: string) => void;
  onUnlockedAction: () => void;
}

const PlannerGuard: React.FC<PlannerGuardProps> = ({ profile, onNavigate, onUnlockedAction }) => {
  // Critérios de desbloqueio
  const hasBrand = !!(profile.commonEnemy && profile.uniqueMechanism);
  const hasBusiness = !!profile.productLadder;
  const isReady = hasBrand && hasBusiness;

  if (isReady) {
    return (
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-[40px] p-10 md:p-12 text-white relative overflow-hidden shadow-2xl group cursor-pointer animate-in zoom-in-95 duration-500" onClick={onUnlockedAction}>
        <div className="absolute right-0 top-0 h-full w-1/2 bg-white/5 skew-x-12 transform origin-bottom-left" />
        <div className="absolute -right-10 -bottom-20 opacity-20 text-white"><Rocket size={200} /></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="space-y-4">
              <span className="bg-emerald-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-lg shadow-emerald-500/20">IA Pronta para Decolar</span>
              <h3 className="text-3xl md:text-4xl font-black leading-tight">Planeje seu Mês em <br/> 30 segundos ⚡</h3>
              <p className="text-indigo-200 font-medium max-w-lg">Sua base estratégica está sólida. O Orquestrador agora pode criar sua jornada completa de 30 dias.</p>
           </div>
           <button className="bg-white text-indigo-900 px-10 py-5 rounded-[24px] font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-transform flex items-center gap-3 shrink-0">
              Gerar Estratégia Mensal 🚀
           </button>
        </div>
      </div>
    );
  }

  const progress = (hasBrand ? 50 : 0) + (hasBusiness ? 50 : 0);

  return (
    <div className="bg-white border-4 border-gray-50 rounded-[48px] p-12 relative overflow-hidden shadow-sm group">
      <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
        <Lock size={180} />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shadow-inner">
              <Lock size={28} />
            </div>
            <div>
              <h3 className="text-3xl font-black text-gray-900 tracking-tight">Estratégia Bloqueada</h3>
              <p className="text-gray-400 font-medium">A IA precisa "estudar" seu negócio antes de trabalhar.</p>
            </div>
          </div>

          <div className="space-y-4">
             <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-50">
                <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${progress}%` }} />
             </div>
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{progress}% do Onboarding Concluído</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className={`p-6 rounded-3xl border-2 transition-all flex items-center justify-between ${hasBrand ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-transparent opacity-60'}`}>
                <div className="flex items-center gap-4">
                   {hasBrand ? <CheckCircle2 className="text-emerald-500" /> : <Circle className="text-gray-300" />}
                   <span className={`font-black text-xs uppercase tracking-widest ${hasBrand ? 'text-emerald-900' : 'text-gray-400'}`}>DNA da Marca</span>
                </div>
                {!hasBrand && (
                  <button onClick={() => onNavigate('brand')} className="text-[10px] font-black text-emerald-600 hover:underline">CONFIGURAR</button>
                )}
             </div>

             <div className={`p-6 rounded-3xl border-2 transition-all flex items-center justify-between ${hasBusiness ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-transparent opacity-60'}`}>
                <div className="flex items-center gap-4">
                   {hasBusiness ? <CheckCircle2 className="text-emerald-500" /> : <Circle className="text-gray-300" />}
                   <span className={`font-black text-xs uppercase tracking-widest ${hasBusiness ? 'text-emerald-900' : 'text-gray-400'}`}>Business Lab</span>
                </div>
                {!hasBusiness && (
                  <button onClick={() => onNavigate('business-lab')} className="text-[10px] font-black text-emerald-600 hover:underline">CONFIGURAR</button>
                )}
             </div>
          </div>
        </div>

        <div className="w-full lg:w-72 p-8 bg-amber-50 rounded-[32px] border border-amber-100 space-y-4">
           <ShieldAlert className="text-amber-500" size={32} />
           <h4 className="font-black text-amber-900 text-sm uppercase tracking-tight">Por que está travado?</h4>
           <p className="text-amber-800/70 text-xs font-medium leading-relaxed">
             Gerar conteúdo sem definir seu **Inimigo Comum** e sua **Esteira de Produtos** resultaria em posts genéricos que não vendem.
           </p>
           <button 
             disabled 
             className="w-full py-4 bg-gray-200 text-gray-400 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-not-allowed"
           >
             Aguardando Requisitos
           </button>
        </div>
      </div>
    </div>
  );
};

export default PlannerGuard;
