import { Router } from 'express';
import supabase from '../db/supabaseClient.js';

const router = Router();

// Rota para CADASTRO
router.post('/register', async (req, res) => {
  const { nome, email, idade, senha, tipo } = req.body;

  try {
    const { data, error } = await supabase
      .from('Usuario')  // Tabela no Supabase onde os dados do usuário serão armazenados
      .insert([{ nome, email, idade, senha, tipo }]);  // Inserir os dados na tabela

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json({ message: 'Usuário cadastrado com sucesso', data });
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
});

// Rota para LOGIN
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const { data, error } = await supabase
      .from('Usuario')  
      .select('*')  
      .eq('email', email)  
      .eq('senha', senha)  
      .single(); 

    if (error || !data) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    return res.json({ message: 'Login realizado com sucesso', usuario: data });
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
});

export default router;
