//Importações necessárias
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Configuração do Supabase usando variáveis de ambiente
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Verificação se as variáveis de ambiente estão definidas
if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL e/ou chave de API não encontrados no arquivo .env');
  }

// Criação do cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
