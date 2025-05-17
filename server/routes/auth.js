import { Router } from 'express';
import supabase from '../db/supabaseClient.js';

const router = Router();

// Rota para CADASTRO
router.post('/register', async (req, res) => {
  let { nome, email, senha, idade } = req.body;

  idade = Number(idade);

  // Atribui o campo tipo um valor a depender da idade
  let tipo = idade >= 18 ? 'responsavel' : 'crianca';

  try {
    // Cadastro utilizando o Auth do Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha
    });
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Salva dados extras na tabela Usuario_infos e referencia pelo id do Auth 
    const userId = data.user.id;
    const { error: dbError } = await supabase
      .from('Usuario_infos')
      .insert([{ id_auth: userId, nome, idade, tipo }]);
    if (dbError) {
      return res.status(400).json({ error: dbError.message });
    }

    return res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
});

// Rota para LOGIN
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  // Login utilizando o Auth do Supabase
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha
    });

    if (error || !data || !data.user) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    return res.json({ message: 'Login realizado com sucesso', usuario: data.user });
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
});

export default router;
