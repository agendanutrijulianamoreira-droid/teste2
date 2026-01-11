
import React, { useState, useRef } from 'react';
import { Mic, MicOff, Volume2, ShieldCheck, Loader2, Zap, Calendar as CalendarIcon, Check, X, ArrowRight } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality, Type, FunctionDeclaration } from '@google/genai';
import { MODELS, STRATEGY_CONFIG } from '../constants';
import { Post, UserProfile } from '../types';
import { PERSONAS } from '../services/geminiService'; // Importando Personas

interface LiveSupportProps {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  profile: UserProfile;
}

const LiveSupport: React.FC<LiveSupportProps> = ({ posts, setPosts, profile }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [pendingPost, setPendingPost] = useState<any | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  let nextStartTime = 0;

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const createBlob = (data: Float32Array) => {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  };

  const suggestPostFunction: FunctionDeclaration = {
    name: 'suggest_post_creation',
    description: 'Sugere a criação de um post no calendário com base na conversa estratégica de nutrição.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        strategyType: { 
          type: Type.STRING, 
          description: 'O tipo de estratégia (conversao_direta, conexao_valores, autoridade_clinica, mito_verdade, lifestyle).' 
        },
        title: { 
          type: Type.STRING, 
          description: 'O título principal do carrossel.' 
        },
        caption: { 
          type: Type.STRING, 
          description: 'Legenda magnética para o Instagram.' 
        },
        slides: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              imagePrompt: { type: Type.STRING }
            }
          }
        }
      },
      required: ['strategyType', 'title', 'caption', 'slides']
    }
  };

  const startSession = async () => {
    setIsConnecting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

      const sessionPromise = ai.live.connect({
        model: MODELS.live,
        callbacks: {
          onopen: () => {
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (event) => {
              const inputData = event.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
            setIsActive(true);
            setIsConnecting(false);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Process model audio output
            if (message.serverContent?.modelTurn?.parts[0]?.inlineData?.data) {
              const base64 = message.serverContent.modelTurn.parts[0].inlineData.data;
              nextStartTime = Math.max(nextStartTime, outputCtx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputCtx.destination);
              source.start(nextStartTime);
              nextStartTime += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            // FIX: Handle interruption to stop playback and reset queue
            const interrupted = message.serverContent?.interrupted;
            if (interrupted) {
              for (const source of sourcesRef.current.values()) {
                try { source.stop(); } catch(e) {}
              }
              sourcesRef.current.clear();
              nextStartTime = 0;
            }

            if (message.serverContent?.outputTranscription) {
               setTranscript(prev => [...prev.slice(-10), `Nutri.AI: ${message.serverContent?.outputTranscription?.text}`]);
            }
            if (message.toolCall) {
              for (const fc of message.toolCall.functionCalls) {
                if (fc.name === 'suggest_post_creation') {
                  setPendingPost(fc.args);
                  sessionPromise.then(s => s.sendToolResponse({
                    functionResponses: {
                      id: fc.id,
                      name: fc.name,
                      response: { result: "Post sugerido e visualizado pelo usuário." }
                    }
                  }));
                }
              }
            }
          },
          onerror: (e) => console.error(e),
          onclose: () => setIsActive(false),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: `
            ${PERSONAS.MENTOR_ORCHESTRATOR}
            
            CONTEXTO DA NUTRICIONISTA:
            - Nome: ${profile.fullName}
            - Especialidade: ${profile.specialty}
            - Mecanismo Único: ${profile.uniqueMechanism}
            
            Use a função 'suggest_post_creation' para formalizar ideias discutidas se ela pedir para agendar algo.
          `,
          outputAudioTranscription: {},
          tools: [{ functionDeclarations: [suggestPostFunction] }]
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setIsConnecting(false);
    }
  };

  const stopSession = () => {
    if (sessionRef.current) sessionRef.current.close();
    setIsActive(false);
  };

  const confirmPostCreation = () => {
    if (!pendingPost) return;
    const newPost: Post = {
      id: Math.random().toString(36).substr(2, 9),
      userId: profile.id,
      scheduledDate: new Date().toISOString(),
      calendarIndex: selectedDay + 3,
      status: 'draft',
      strategyType: pendingPost.strategyType,
      format: 'carousel',
      content: {
        title: pendingPost.title,
        slides: pendingPost.slides,
        caption: pendingPost.caption
      }
    };
    setPosts(prev => [...prev, newPost]);
    setPendingPost(null);
    setTranscript(prev => [...prev, "Sucesso: Conteúdo adicionado ao seu calendário!"]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <header className="text-center">
        <h2 className="text-3xl font-bold">Assistente de Voz Estratégica</h2>
        <p className="text-gray-500 mt-2">Planeje seus carrosséis de venda apenas conversando com a IA.</p>
      </header>

      {pendingPost && (
        <div className="bg-emerald-600 rounded-3xl p-8 text-white shadow-2xl space-y-6">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold">Sugestão: {pendingPost.title}</h3>
            <button onClick={() => setPendingPost(null)}><X size={20} /></button>
          </div>
          <p className="text-sm opacity-90">{pendingPost.caption.substring(0, 150)}...</p>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase opacity-60">Escolha o dia no calendário:</label>
            <div className="flex gap-2 flex-wrap">
              {Array.from({ length: 31 }).map((_, i) => (
                <button key={i} onClick={() => setSelectedDay(i + 1)} className={`w-10 h-10 rounded-xl font-bold text-xs ${selectedDay === i + 1 ? 'bg-white text-emerald-700' : 'bg-white/10'}`}>{i + 1}</button>
              ))}
            </div>
          </div>
          <button onClick={confirmPostCreation} className="w-full py-4 bg-white text-emerald-700 rounded-2xl font-bold">Agendar este Post</button>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-gray-100 p-12 flex flex-col items-center gap-8 shadow-sm">
        <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${isActive ? 'bg-emerald-500 text-white animate-pulse' : 'bg-gray-100 text-gray-400'}`}>
          <Mic size={48} />
        </div>
        <button 
          onClick={isActive ? stopSession : startSession}
          disabled={isConnecting}
          className={`px-10 py-5 rounded-2xl font-bold text-lg shadow-xl transition-all ${isActive ? 'bg-red-500 text-white' : 'bg-emerald-600 text-white'}`}
        >
          {isConnecting ? <Loader2 className="animate-spin" /> : isActive ? 'Encerrar Conversa' : 'Ativar Voz Estratégica ✨'}
        </button>
        <div className="w-full bg-gray-50 rounded-2xl p-6 min-h-[100px]">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Transcrição ao Vivo</p>
          <div className="space-y-2">
            {transcript.map((t, i) => (
              <div key={i} className={`text-sm ${t.startsWith('Nutri.AI:') ? 'text-emerald-700 font-bold' : 'text-gray-600'}`}>{t}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveSupport;
