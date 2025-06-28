import { Router } from 'express';
import supabase from '../db/supabaseClient.js';

const router = Router();

// ---------ROTA PARA CADASTRO----------
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
    console.log('Resposta do signUp:', data); // 👈 VER AQUI
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

    return res.status(201).json({ message: 'Usuário cadastrado com sucesso', user_id: userId });
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
});

// ---------ROTA PARA LOGIN----------
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Faz o login pelo Auth do Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha
    });

    if (error || !data || !data.user) {
      return res.status(401).json({ 
        error: 'Email ou senha inválidos', 
        details: error ? error.message : 'Dados incompletos no retorno',
      });
    }

    const userId = data.user.id;

    // Agora buscamos os dados complementares na tabela Usuario_infos
    const { data: infos, error: infoError } = await supabase
      .from('Usuario_infos')
      .select('nome, tipo') // você pode adicionar mais campos se quiser
      .eq('id_auth', userId)
      .single();

    if (infoError) {
      return res.status(404).json({ error: 'Dados do usuário não encontrados' });
    }

    return res.json({
      message: 'Login realizado com sucesso',
      user_id: userId,
      session: data.session,
      usuario: {
        nome: infos.nome,
        tipo: infos.tipo
      }
    });

  } catch (error) {
    console.error('Erro interno do servidor:', error);
    return res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
});

export default router;
