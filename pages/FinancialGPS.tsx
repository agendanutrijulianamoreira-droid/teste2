
import React, { useState, useMemo } from 'react';
import { 
  DollarSign, TrendingUp, Target, PieChart, ArrowRight, Zap, Trophy, Crown, 
  Edit3, Save, ChevronRight, AlertTriangle, ShieldCheck, Sparkles, Magnet,
  BarChart3, History, Wallet, CheckCircle2, X, Repeat, Flame, Users, ArrowDown
} from 'lucide-react';
import { UserProfile, ProductLadder, Sale, ProductDetail } from '../types';

interface FinancialGPSProps {
  profile: UserProfile;
  sales: Sale[];
  onRegisterSale: (sale: Omit<Sale, 'id'>) => void;
  updateProfile: (p: Partial<UserProfile>) => void;
}

const FinancialGPS: React.FC<FinancialGPSProps> = ({ profile, sales, onRegisterSale, updateProfile }) => {
  const [activeTab, setActiveTab] = useState<'gps' | 'ladder' | 'hybrid'>('gps');
  const [monthlyGoal, setMonthlyGoal] = useState(profile.financialGoal || 15000);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  
  // Simulador Híbrido
  const [leadsCount, setLeadsCount] = useState(50);
  const [conversionRate, setConversionRate] = useState(10); // 10% do desafio para a mentoria

  const forecast = useMemo(() => {
    if (!profile.productLadder) return null;
    const { tripwire, high_ticket } = profile.productLadder;
    const targetHigh = monthlyGoal * 0.7;
    const targetEntry = monthlyGoal * 0.3;
    return {
      high: { units: Math.ceil(targetHigh / (high_ticket.price || 1)), amount: targetHigh },
      entry: { units: Math.ceil(targetEntry / (tripwire.price || 1)), amount: targetEntry }
    };
  }, [monthlyGoal, profile.productLadder]);

  const hybridResult = useMemo(() => {
    if (!profile.productLadder) return 0;
    const entryRevenue = leadsCount * profile.productLadder.tripwire.price;
    const highTicketSales = Math.floor(leadsCount * (conversionRate / 100));
    const highRevenue = highTicketSales * profile.productLadder.high_ticket.price;
    return entryRevenue + highRevenue;
  }, [leadsCount, conversionRate, profile.productLadder]);

  const currentRevenue = useMemo(() => sales.reduce((acc, s) => acc + s.amount, 0), [sales]);
  const progressPercent = Math.min((currentRevenue / monthlyGoal) * 100, 100);

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <DollarSign className="text-emerald-500" /> GPS Financeiro 📈
          </h2>
          <p className="text-xl text-gray-500 mt-2 font-medium">Sua rota para a liberdade geográfica e faturamento previsível.</p>
        </div>
        
        <div className="flex bg-gray-100 p-1.5 rounded-[20px] w-fit shadow-inner">
           <button onClick={() => setActiveTab('gps')} className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'gps' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}>Metas</button>
           <button onClick={() => setActiveTab('hybrid')} className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'hybrid' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}>Efeito Híbrido</button>
        </div>
      </header>

      {activeTab === 'gps' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1 space-y-8">
             <div className="bg-white rounded-[48px] p-10 border border-gray-100 shadow-sm space-y-10 relative overflow-hidden group">
                <header className="space-y-4">
                   <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">Objetivo do Mês</span>
                   {isEditingGoal ? (
                     <div className="flex items-center gap-3">
                        <span className="text-3xl font-black text-gray-900">R$</span>
                        <input autoFocus type="number" value={monthlyGoal} onChange={(e) => setMonthlyGoal(Number(e.target.value))} onBlur={() => { setIsEditingGoal(false); updateProfile({ financialGoal: monthlyGoal }); }} className="w-full text-5xl font-black text-gray-900 outline-none bg-transparent" />
                     </div>
                   ) : (
                     <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsEditingGoal(true)}>
                        <h3 className="text-5xl font-black text-gray-900 tabular-nums">R$ {monthlyGoal.toLocaleString()}</h3>
                        <Edit3 size={20} className="text-gray-200" />
                     </div>
                   )}
                </header>
                <div className="space-y-6">
                   <div className="flex justify-between items-end">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Faturado: R$ {currentRevenue.toLocaleString()}</p>
                      <p className="text-2xl font-black text-emerald-600">{progressPercent.toFixed(0)}%</p>
                   </div>
                   <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden border-2 border-white">
                      <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
                   </div>
                </div>
             </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
             <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] px-4 flex items-center gap-2">Engenharia Reversa</h3>
             {profile.productLadder ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-emerald-900 p-8 rounded-[40px] text-white">
                     <Crown className="text-emerald-400 mb-4" size={32} />
                     <p className="text-[10px] font-black uppercase opacity-60">Mentorias Necessárias</p>
                     <p className="text-4xl font-black mt-2">{forecast?.high.units}</p>
                     <p className="text-xs font-medium opacity-40 mt-1">Foco em {profile.productLadder.high_ticket.name}</p>
                  </div>
                  <div className="bg-white p-8 rounded-[40px] border border-gray-100">
                     <Zap className="text-purple-500 mb-4" size={32} />
                     <p className="text-[10px] font-black uppercase text-gray-400">Alunos no Desafio</p>
                     <p className="text-4xl font-black text-gray-900 mt-2">{forecast?.entry.units}</p>
                     <p className="text-xs font-medium text-gray-400 mt-1">Foco em {profile.productLadder.tripwire.name}</p>
                  </div>
               </div>
             ) : (
               <div className="p-20 text-center bg-gray-50 rounded-[40px] border-2 border-dashed">Configure sua esteira no Business Lab.</div>
             )}
          </div>
        </div>
      )}

      {activeTab === 'hybrid' && (
        <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-bottom-8">
           <div className="bg-white rounded-[48px] p-12 border border-gray-100 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="space-y-10">
                 <header>
                    <h3 className="text-2xl font-black text-gray-900">Efeito Híbrido</h3>
                    <p className="text-sm text-gray-500 font-medium">Veja como o Desafio alimenta sua Mentoria.</p>
                 </header>
                 <div className="space-y-8">
                    <div className="space-y-4">
                       <div className="flex justify-between"><label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Leads no Desafio</label><span className="font-black text-emerald-600">{leadsCount}</span></div>
                       <input type="range" min="10" max="300" value={leadsCount} onChange={e => setLeadsCount(Number(e.target.value))} className="w-full h-2 bg-gray-100 rounded-full appearance-none accent-emerald-500" />
                    </div>
                    <div className="space-y-4">
                       <div className="flex justify-between"><label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Taxa de Conversão High Ticket</label><span className="font-black text-emerald-600">{conversionRate}%</span></div>
                       <input type="range" min="1" max="30" value={conversionRate} onChange={e => setConversionRate(Number(e.target.value))} className="w-full h-2 bg-gray-100 rounded-full appearance-none accent-emerald-500" />
                    </div>
                 </div>
              </div>

              <div className="flex flex-col items-center justify-center space-y-8">
                 <div className="relative w-full max-w-[200px] aspect-square flex flex-col items-center justify-center gap-2">
                    <div className="absolute inset-0 border-4 border-emerald-100 rounded-full animate-ping opacity-20" />
                    <div className="w-full h-full bg-emerald-50 rounded-full flex flex-col items-center justify-center p-8 text-center border-4 border-emerald-500 shadow-xl shadow-emerald-100">
                       <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Faturamento</p>
                       <p className="text-2xl font-black text-emerald-900 leading-tight">R$ {hybridResult.toLocaleString()}</p>
                    </div>
                 </div>
                 <div className="flex flex-col items-center text-center gap-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                       <Users size={14} /> {leadsCount} Alunos Desafio
                    </div>
                    <ArrowDown className="text-gray-200" />
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                       <Crown size={14} /> {Math.floor(leadsCount * (conversionRate / 100))} Alunos Mentoria
                    </div>
                 </div>
              </div>
           </div>

           <div className="p-8 bg-emerald-900 rounded-[32px] text-white flex items-center justify-between">
              <div className="flex-1">
                 <h4 className="font-black uppercase text-xs tracking-widest mb-1">Diagnóstico da Estratégia</h4>
                 <p className="text-sm text-emerald-100/60 font-medium">Com uma conversão de {conversionRate}%, você alcança {(hybridResult / monthlyGoal * 100).toFixed(0)}% da sua meta apenas com este funil híbrido.</p>
              </div>
              <Sparkles className="text-emerald-400" />
           </div>
        </div>
      )}
    </div>
  );
};

export default FinancialGPS;
