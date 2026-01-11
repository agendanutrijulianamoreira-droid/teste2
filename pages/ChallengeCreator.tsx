
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, Challenge } from '../types';
import { generateChallengeStructure } from '../services/geminiService';
import { 
  Trophy, Calendar, Target, Zap, MessageCircle, 
  ChevronRight, Play, CheckCircle, Plus, ArrowLeft, Loader2
} from 'lucide-react';
import { supabase } from '../supabaseClient';

interface ChallengeCreatorProps {
  profile: UserProfile;
  challenges: Challenge[];
  setChallenges: React.Dispatch<React.SetStateAction<Challenge[]>>;
}

const ChallengeCreator: React.FC<ChallengeCreatorProps> = ({ profile, challenges, setChallenges }) => {
  const [view, setView] = useState<'LIST' | 'WIZARD' | 'DETAILS'>('LIST');
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    duration: 21,
    price: 47,
    pillar: profile.uniqueMechanism || 'Nutrição',
    gamification: true,
    highTicketOffer: profile.productLadder?.high_ticket?.name || 'Mentoria'
  });

  const handleGenerate = async () => {
    setLoading(true);
    setLoadingText('Desenhando Estratégia...');
    try {
      const structure = await generateChallengeStructure(profile, {
        title: formData.title || `Desafio ${formData.duration} Dias`,
        duration: formData.duration,
        pillar: formData.pillar,
        gamification: formData.gamification,
        highTicketOffer: formData.highTicketOffer
      });

      // Fix: Challenge interface uses userId, duration, price (string), launchStrategy, and dailyMissions
      const newChallenge: Challenge = {
        id: `local-${Date.now()}`,
        userId: profile.id,
        title: formData.title || `Desafio ${formData.duration} Dias`,
        duration: formData.duration,
        price: String(formData.price),
        pillar: formData.pillar,
        gamification: formData.gamification,
        launchStrategy: structure.launch_strategy.map((s: any) => ({
          day: String(s.day),
          script: s.script
        })),
        dailyMissions: structure.daily_missions.map((m: any) => ({
          day: m.day,
          theme: m.theme,
          morning_script: m.morning_script,
          night_script: m.night_script,
          gamification_points: m.gamification_points,
          mentor_tip: m.description,
          image_prompt: m.image_prompt
        })),
        createdAt: new Date().toISOString()
      };

      setChallenges(prev => [newChallenge, ...prev]);
      setSelectedChallenge(newChallenge);
      setView('DETAILS');
    } catch (error) {
      console.error(error);
      alert("Erro ao criar desafio.");
    } finally {
      setLoading(false);
    }
  };

  if (view === 'LIST') {
    return (
      <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight font-serif">Fábrica de Desafios</h1>
            <p className="text-gray-500 mt-2 font-medium">Crie produtos de entrada magnéticos.</p>
          </div>
          <button onClick={() => setView('WIZARD')} className="bg-emerald-600 text-white px-8 py-4 rounded-[20px] font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-700 transition shadow-xl shadow-emerald-100">
            <Plus className="w-5 h-5" /> Novo Desafio
          </button>
        </div>

        {challenges.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[48px] border-2 border-dashed border-gray-100 text-center">
            <Trophy className="w-12 h-12 text-gray-200 mb-6" />
            <h3 className="text-xl font-bold text-gray-900">Sua esteira está vazia</h3>
            <p className="text-gray-400 mt-2">Gere um desafio agora ou use o Piloto Automático no Dashboard.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {challenges.map((c) => (
              <div key={c.id} onClick={() => { setSelectedChallenge(c); setView('DETAILS'); }} className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 hover:shadow-xl transition-all cursor-pointer group h-[280px] flex flex-col justify-between">
                <div>
                   <div className="flex justify-between mb-4">
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-3 py-1 rounded-full uppercase">{c.pillar}</span>
                      <span className="text-gray-400 text-[10px] font-bold uppercase">{c.duration} Dias</span>
                   </div>
                   <h3 className="text-xl font-black text-gray-900 line-clamp-2">{c.title}</h3>
                </div>
                <div className="flex items-center justify-between border-t pt-4">
                   <p className="font-bold text-emerald-600">R$ {c.price}</p>
                   <ChevronRight className="text-gray-300 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (view === 'WIZARD') {
      return (
          <div className="max-w-xl mx-auto py-20 animate-in slide-in-from-bottom-8">
              <div className="bg-white rounded-[48px] p-12 shadow-2xl space-y-10 border border-gray-50">
                  <header className="text-center">
                      <h2 className="text-3xl font-black font-serif">Configurar Desafio</h2>
                  </header>
                  <div className="space-y-6">
                      <input type="text" placeholder="Nome (Ex: Detox 7 Dias)" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-5 bg-gray-50 rounded-2xl border-none font-bold text-gray-900" />
                      <div className="grid grid-cols-2 gap-4">
                          <input type="number" placeholder="Preço" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full p-5 bg-gray-50 rounded-2xl border-none font-bold text-gray-900" />
                          <select value={formData.duration} onChange={e => setFormData({...formData, duration: Number(e.target.value)})} className="w-full p-5 bg-gray-50 rounded-2xl border-none font-bold text-gray-900">
                             <option value={7}>7 Dias</option>
                             <option value={14}>14 Dias</option>
                             <option value={21}>21 Dias</option>
                          </select>
                      </div>
                      <button onClick={handleGenerate} disabled={loading} className="w-full py-6 bg-emerald-600 text-white rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-3">
                         {loading ? <Loader2 className="animate-spin" /> : <Zap size={16} />} {loading ? 'Orquestrando...' : 'Gerar Estrutura IA'}
                      </button>
                  </div>
              </div>
          </div>
      );
  }

  if (view === 'DETAILS' && selectedChallenge) {
    const missions = selectedChallenge.dailyMissions || [];
    return (
      <div className="p-8 max-w-[1600px] mx-auto flex flex-col animate-in fade-in">
        <header className="flex items-center justify-between mb-10">
           <div className="flex items-center gap-6">
              <button onClick={() => setView('LIST')} className="p-4 bg-gray-100 rounded-full hover:bg-white transition-colors"><ArrowLeft size={20}/></button>
              <h1 className="text-3xl font-black font-serif">{selectedChallenge.title}</h1>
           </div>
        </header>
        <div className="flex gap-8 overflow-x-auto pb-10 custom-scrollbar">
           {missions.map((m: any, idx: number) => (
             <div key={idx} className="w-[350px] shrink-0 space-y-4">
                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                   <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-xs mb-4">{m.day}</div>
                   <h4 className="text-xl font-black text-gray-900 mb-2">{m.theme}</h4>
                   <p className="text-xs text-gray-500 font-medium leading-relaxed mb-6">{m.mentor_tip}</p>
                   <div className="space-y-4">
                      <button onClick={() => { navigator.clipboard.writeText(m.morning_script); alert('Manhã copiada!'); }} className="w-full py-3 bg-gray-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-600">Copiar Script Manhã</button>
                      <button onClick={() => { navigator.clipboard.writeText(m.night_script); alert('Noite copiada!'); }} className="w-full py-3 bg-gray-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-blue-600">Copiar Script Noite</button>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    );
  }

  return null;
};

export default ChallengeCreator;
