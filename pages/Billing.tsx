
import React from 'react';
import { CreditCard, Zap, TrendingUp, History, ExternalLink, ArrowUpRight, BarChart3, ReceiptText, CheckCircle2, AlertCircle, Book } from 'lucide-react';

interface AllowanceStat {
  label: string;
  used: number;
  limit: number;
  excess: number;
  unitCost: number;
  color: string;
}

const Billing: React.FC = () => {
  const allowances: AllowanceStat[] = [
    { label: 'Posts (Carrossel)', used: 12, limit: 15, excess: 0, unitCost: 5.00, color: 'bg-emerald-500' },
    { label: 'Materiais Ricos (E-books)', used: 2, limit: 1, excess: 1, unitCost: 25.00, color: 'bg-blue-600' },
    { label: 'Estratégias de Stories', used: 1, limit: 3, excess: 0, unitCost: 10.00, color: 'bg-purple-500' },
    { label: 'Utilizações de IA', used: 18, limit: 15, excess: 3, unitCost: 2.00, color: 'bg-amber-500' },
  ];

  const basePrice = 200.00;
  const totalExcess = allowances.reduce((acc, curr) => acc + (curr.excess * curr.unitCost), 0);
  const nextInvoiceTotal = basePrice + totalExcess;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header>
        <h2 className="text-3xl font-bold">Financeiro</h2>
        {/* Fixed prohibited term 'Alcateia' to 'Nutri.AI' */}
        <p className="text-gray-500 mt-1">Plano Nutri.AI Pro: Sua estrutura de escala completa.</p>
      </header>

      {/* Main Billing Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Seu Plano Atual</span>
              <h3 className="text-2xl font-bold mt-2">Plano Nutri Pro</h3>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Assinatura fixa de <span className="font-bold text-gray-900">R$ 200,00</span> que garante sua base de conteúdo mensal. Cobramos apenas o que você decidir escalar além do limite.
            </p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {['15 Posts', '1 E-book', '3 Stories', '15 Créditos IA'].map((feat) => (
                <span key={feat} className="flex items-center gap-1.5 text-[10px] font-bold bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg text-gray-600">
                  <CheckCircle2 size={12} className="text-emerald-500" /> {feat} inclusos
                </span>
              ))}
            </div>
          </div>
          <div className="w-full md:w-px h-px md:h-32 bg-gray-100"></div>
          <div className="text-center space-y-2 min-w-[160px]">
            <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">Valor Base</p>
            <p className="text-4xl font-black text-gray-900">R$ 200</p>
            <p className="text-[10px] text-gray-400">cobrança mensal fixa</p>
          </div>
        </div>

        <div className="bg-emerald-900 p-8 rounded-[32px] text-white shadow-xl shadow-emerald-900/20 flex flex-col justify-between">
          <div className="space-y-1">
            <h4 className="text-emerald-200/60 text-xs font-bold uppercase tracking-widest">Próxima Fatura (Est.)</h4>
            <p className="text-4xl font-black">R$ {nextInvoiceTotal.toFixed(2).replace('.', ',')}</p>
          </div>
          
          <div className="space-y-3 mt-8">
            <div className="flex justify-between text-xs border-b border-white/10 pb-2">
              <span className="opacity-60">Assinatura Fixa</span>
              <span>R$ 200,00</span>
            </div>
            <div className="flex justify-between text-xs border-b border-white/10 pb-2">
              <span className="opacity-60">Excedente de Uso</span>
              <span className="text-emerald-400 font-bold">+ R$ {totalExcess.toFixed(2).replace('.', ',')}</span>
            </div>
            <button className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 mt-2">
              Gerenciar Cartão <ArrowUpRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <BarChart3 size={24} className="text-emerald-600" /> Controle de Consumo
            </h3>
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div> No Limite
              <div className="w-3 h-3 rounded-full bg-red-500 ml-2"></div> Excedente
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {allowances.map((stat, i) => {
              const percentage = Math.min((stat.used / stat.limit) * 100, 100);
              const isExceeded = stat.used > stat.limit;
              
              return (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm font-bold text-gray-800">{stat.label}</p>
                      <p className="text-[10px] text-gray-400">Limite: {stat.limit} inclusos</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-black ${isExceeded ? 'text-red-500' : 'text-gray-900'}`}>
                        {stat.used}<span className="text-xs text-gray-300 font-medium">/{stat.limit}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`absolute top-0 left-0 h-full ${isExceeded ? 'bg-red-500' : stat.color} transition-all duration-1000 ease-out`} 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  {isExceeded && (
                    <div className="flex items-center gap-1.5 text-red-600 bg-red-50 p-2 rounded-xl text-[10px] font-bold animate-in slide-in-from-top-1">
                      <AlertCircle size={14} /> 
                      Cobrança excedente: {stat.excess} x R$ {stat.unitCost.toFixed(2)} = R$ {(stat.excess * stat.unitCost).toFixed(2)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <ReceiptText size={20} className="text-emerald-600" /> Transparência
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Diferente de outros SaaS, o Nutri.AI não trava sua conta ao atingir o limite. 
              Nossa IA continua trabalhando e você só paga pelo excedente na fatura seguinte.
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-gray-400">
                <span>Tabela de Excedente</span>
                <span>Unitário</span>
              </div>
              <div className="flex justify-between text-xs py-2 border-b border-gray-50">
                <span>Post Extra</span>
                <span className="font-bold">R$ 5,00</span>
              </div>
              <div className="flex justify-between text-xs py-2 border-b border-gray-50">
                <span>E-book Extra</span>
                <span className="font-bold text-blue-600">R$ 25,00</span>
              </div>
              <div className="flex justify-between text-xs py-2 border-b border-gray-50">
                <span>Crédito IA Extra</span>
                <span className="font-bold">R$ 2,00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
