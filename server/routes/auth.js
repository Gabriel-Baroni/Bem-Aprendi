import { Router } from 'express';
import supabase from '../db/supabaseAdmin.js';

const router = Router();

// ---------ROTA PARA CADASTRO ----------
router.post('/register', async (req, res) => {
  let { nome, email, senha, idade } = req.body;

  idade = Number(idade);
  let tipo = idade >= 18 ? 'responsavel' : 'crianca';

  try {
    // 1. Cadastro utilizando o Auth do Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: senha
    });
    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    const userId = authData.user.id;

    // 2. Salva dados na tabela Usuario_infos E já captura os dados de volta
    const { data: profileData, error: dbError } = await supabase
      .from('Usuario_infos') // Use aspas se o nome tiver maiúsculas
      .insert([{ id_auth: userId, nome, idade, tipo }])
      .select('nome, tipo') // Pega os dados de volta
      .single(); // Espera um único resultado

    if (dbError) {
      // Se a criação do perfil falhar, apague o utilizador do Auth (rollback)
      await supabase.auth.admin.deleteUser(userId);
      return res.status(400).json({ error: dbError.message });
    }

    // 3. [NOVO PASSO] Faz o login para obter a sessão
    const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({
      email,
      password: senha
    });

    if (sessionError) {
      // Isto não devia acontecer, mas é uma boa verificação
      return res.status(400).json({ error: sessionError.message });
    }

    // 4. [NOVO RETORNO] Devolve o objeto completo que o frontend espera
    return res.status(201).json({
      message: 'Usuário cadastrado e logado com sucesso',
      user_id: userId,
      session: sessionData.session, // <-- A SESSÃO QUE ESTAVA EM FALTA
      usuario: {
        nome: profileData.nome,
        tipo: profileData.tipo
      }
    });

  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
});

// ---------ROTA PARA LOGIN (JÁ ESTAVA CORRETA)----------
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
      .from('Usuario_infos') // Use aspas se o nome tiver maiúsculas
      .select('nome, tipo')
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
