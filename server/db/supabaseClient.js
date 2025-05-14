import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;


if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL e/ou chave de API não encontrados no arquivo .env');
  }

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
