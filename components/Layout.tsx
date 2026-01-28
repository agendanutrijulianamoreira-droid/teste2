import React from 'react';
import { 
  LayoutDashboard, Palette, Briefcase, Calendar, Filter, 
  Library, Trophy, Crown, MessageSquareQuote, BarChart3, 
  ChevronRight, Sparkles, Target, Zap, PlusCircle
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  setActivePage: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activePage, setActivePage }) => {
  
  const menuGroups = [
    {
      label: 'Visão Geral',
      items: [
        { id: 'dashboard', label: 'Command Center', icon: <LayoutDashboard size={18} /> },
      ]
    },
    {
      label: 'Estratégia (O Cérebro)',
      items: [
        { id: 'brand', label: 'Brand Hub', icon: <Palette size={18} /> },
        { id: 'business-lab', label: 'Business Lab', icon: <Briefcase size={18} /> },
      ]
    },
    {
      label: 'Operação (Plano de Ação)',
      items: [
        { id: 'calendar', label: 'Calendário & Feed', icon: <Calendar size={18} /> },
        { id: 'funnels', label: 'Funis de Venda', icon: <Filter size={18} /> },
      ]
    },
    {
      label: 'Produtos (A Fábrica)',
      items: [
        { id: 'materials', label: 'Materiais Ricos', icon: <Library size={18} /> },
        { id: 'challenges', label: 'Fábrica de Desafios', icon: <Trophy size={18} /> },
      ]
    },
    {
      label: 'Conversão (O Dinheiro)',
      items: [
        { id: 'vip-list', label: 'Lista VIP CRM', icon: <Crown size={18} /> },
        { id: 'live', label: 'Mentor IA (Voz)', icon: <MessageSquareQuote size={18} /> },
      ]
    },
    {
      label: 'Resultados',
      items: [
        { id: 'billing', label: 'Financeiro GPS', icon: <BarChart3 size={18} /> },
      ]
    }
  ];

  return (
    <div className="flex min-h-screen bg-[#FDFBF7]">
      {/* Sidebar - Estética Luxury Editorial */}
      <aside className="w-80 bg-white border-r border-gray-100 flex flex-col sticky top-0 h-screen z-50">
        <div className="p-10 border-b border-gray-50">
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter font-serif flex items-center gap-2">
            Nutri.AI <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
          </h1>
          <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em] mt-2">The High-Ticket System</p>
        </div>
        
        <nav className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
          
          {/* New Primary Creation Button */}
          <button
            onClick={() => setActivePage('create')}
            className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group ${
              activePage === 'create'
                ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-100'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            <PlusCircle size={20} />
            <span className="text-sm font-black tracking-tight">Criar com IA</span>
          </button>

          {menuGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-3">
              <h3 className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{group.label}</h3>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-500 group ${
                      activePage === item.id
                        ? 'bg-gray-900 text-white shadow-xl translate-x-2'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium'
                    }`}
                  >
                    <span className={`transition-colors ${activePage === item.id ? 'text-[#D4AF37]' : 'text-gray-400 group-hover:text-gray-900'}`}>
                      {item.icon}
                    </span>
                    <span className="text-sm font-bold tracking-tight">{item.label}</span>
                    {activePage === item.id && (
                      <ChevronRight size={14} className="ml-auto text-[#D4AF37]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-8 border-t border-gray-50">
          <div className="bg-gray-950 p-6 rounded-[32px] text-white space-y-4 relative overflow-hidden group cursor-pointer shadow-2xl">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Sparkles size={40} /></div>
             <div className="relative z-10">
                <p className="text-[8px] font-black text-[#D4AF37] uppercase tracking-[0.3em] mb-1">Elite Member</p>
                <p className="text-sm font-black tracking-tight">Dra. Juliana Costa</p>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">
        {/* Remove max-width and padding from here to allow full-page components */}
        <div>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;