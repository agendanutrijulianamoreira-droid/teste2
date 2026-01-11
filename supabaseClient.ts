
import { createClient } from '@supabase/supabase-js';

// As variáveis de ambiente devem ser configuradas no arquivo .env do projeto
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

// Mock client para evitar crash quando não houver credenciais configuradas
const mockSupabase = {
  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({
        order: (col: string, opts?: any) => Promise.resolve({ data: [], error: null }),
        single: () => Promise.resolve({ data: null, error: null })
      }),
      order: (col: string, opts?: any) => Promise.resolve({ data: [], error: null })
    }),
    insert: (data: any) => ({
      select: () => {
        // Simula sucesso na inserção, gerando IDs mockados se necessário
        const mockData = (Array.isArray(data) ? data : [data]).map((item: any) => ({
          ...item,
          id: item.id || `mock-${Math.random().toString(36).substr(2, 9)}`,
          created_at: item.created_at || new Date().toISOString()
        }));
        return Promise.resolve({ data: mockData, error: null });
      }
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        select: () => Promise.resolve({ 
          data: Array.isArray(data) ? data : [data], 
          error: null 
        })
      })
    }),
    delete: () => ({
      eq: (column: string, value: any) => Promise.resolve({ data: null, error: null })
    })
  })
};

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : mockSupabase as any;
