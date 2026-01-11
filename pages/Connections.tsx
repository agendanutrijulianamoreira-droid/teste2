
import React, { useState } from 'react';
import { Instagram, CheckCircle2, AlertCircle, RefreshCw, ExternalLink, ShieldCheck, Zap, Loader2 } from 'lucide-react';
import { UserProfile } from '../types';

interface ConnectionsProps {
  profile: UserProfile;
  updateProfile: (p: Partial<UserProfile>) => void;
}

const Connections: React.FC<ConnectionsProps> = ({ profile, updateProfile }) => {
  const [isConnecting, setIsConnecting] = useState(false);

  // Simulação do fluxo Ayrshare OAuth
  const handleConnectInstagram = async () => {
    setIsConnecting(true);
    
    try {
      // 1. Em produção, chamamos nossa Edge Function que usa a API Ayrshare
      // 2. A função retorna uma URL do Facebook para autenticação
      // Exemplo: const { authUrl } = await fetch('/api/ayrshare/link').then(res => res.json());
      
      // Simulação de delay de rede
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulação de redirecionamento (em um app real, o usuário voltaria via callback)
      alert("Redirecionando para a página oficial do Facebook para autorizar o Nutri.AI...");
      
      // Após o "callback" de sucesso, o backend salvaria a ayrshare_profile_key
      updateProfile({ 
        isInstagramConnected: true, 
        ayrshareProfileKey: 'apk_test_' + Math.random().toString(36).substr(2, 9) 
      });
      
    } catch (error) {
      console.error("Erro ao conectar:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    if (confirm("Deseja realmente desconectar sua conta do Instagram? Você não poderá mais agendar posts automáticos.")) {
      updateProfile({ isInstagramConnected: false, ayrshareProfileKey: undefined });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
      <header>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Redes Sociais</h2>
        <p className="text-gray-500 mt-2 font-medium leading-relaxed">Conecte sua conta Business para postagens One-Click e agendamento automático.</p>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {/* Card do Instagram */}
        <div className={`bg-white rounded-[40px] border-4 p-10 transition-all duration-500 shadow-sm ${profile.isInstagramConnected ? 'border-emerald-100' : 'border-gray-50'}`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="flex items-center gap-6">
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-700 ${profile.isInstagramConnected ? 'bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 text-white shadow-xl' : 'bg-gray-100 text-gray-400'}`}>
                <Instagram size={40} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-black text-gray-900">Instagram Business</h3>
                  {profile.isInstagramConnected ? (
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 animate-in zoom-in">
                      <CheckCircle2 size={12} /> Conectado
                    </span>
                  ) : (
                    <span className="bg-gray-100 text-gray-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Desconectado</span>
                  )}
                </div>
                <p className="text-gray-500 font-medium max-w-sm">
                  {profile.isInstagramConnected 
                    ? `Vinculado como @${profile.instagramHandle}. Sua conta está pronta para receber automações.`
                    : "Conecte sua conta para habilitar o envio de posts direto do Nutri.AI."}
                </p>
              </div>
            </div>

            <div className="w-full md:w-auto">
              {profile.isInstagramConnected ? (
                <button 
                  onClick={handleDisconnect}
                  className="w-full md:w-auto px-8 py-4 bg-white border-2 border-red-50 text-red-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-50 transition-all"
                >
                  Desconectar Conta
                </button>
              ) : (
                <button 
                  onClick={handleConnectInstagram}
                  disabled={isConnecting}
                  className="w-full md:w-auto px-10 py-5 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isConnecting ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />}
                  {isConnecting ? 'CONECTANDO...' : 'CONECTAR INSTAGRAM'}
                </button>
              )}
            </div>
          </div>

          {/* Notificação de Erro (Mockup Ayrshare Token Expiration) */}
          {profile.instagramError && (
            <div className="mt-8 p-6 bg-red-50 border border-red-100 rounded-3xl flex items-center gap-4 text-red-700 animate-in slide-in-from-top-4">
              <AlertCircle className="shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-black uppercase tracking-tight">Conexão Expirada</p>
                <p className="text-xs font-medium opacity-80">Seu token de acesso ao Facebook expirou. Por favor, clique em Reconectar para normalizar seu fluxo de postagens.</p>
              </div>
              <button onClick={handleConnectInstagram} className="px-5 py-2 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all">Reconectar</button>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-emerald-950 rounded-[40px] p-12 text-white relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform duration-1000">
             <ShieldCheck size={160} />
           </div>
           <div className="relative z-10 max-w-2xl space-y-6">
              <h4 className="text-3xl font-black leading-tight">Segurança Nível Bancário</h4>
              <p className="text-emerald-100/60 leading-relaxed font-medium">
                Nós não temos acesso à sua senha. A conexão é feita via OAuth oficial do Facebook/Instagram através do nosso parceiro Ayrshare. O token de longa duração permite que o Nutri.AI poste seus carrosséis agendados sem que você precise abrir o aplicativo.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                 {[
                   { label: 'Criptografia 256-bit', icon: <ShieldCheck size={14} /> },
                   { label: 'Partner Ayrshare Oficial', icon: <Zap size={14} /> },
                   { label: 'Token de Longa Duração', icon: <RefreshCw size={14} /> }
                 ].map((badge, i) => (
                   <span key={i} className="bg-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-white/5">
                     {badge.icon} {badge.label}
                   </span>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Connections;
