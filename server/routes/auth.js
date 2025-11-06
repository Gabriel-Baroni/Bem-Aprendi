// importações necessárias
import { Router } from 'express';
import supabase from '../db/supabaseAdmin.js';

const router = Router();

// ---------ROTA PARA CADASTRO----------
router.post('/register', async (req, res) => {
  let { nome, email, senha, idade } = req.body;

  idade = Number(idade); //Coverte a idade para um número 

  // Atribui do campo tipo dependendo da idade (condicional ternária)
  let tipo = idade >= 18 ? 'responsavel' : 'crianca';

  try {
    // Cadastro utilizando o serviço  Auth do Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Salva dados extras na tabela Usuario_infos e referencia pelo id do Auth (nome, idade, tipo)
    const userId = data.user.id;
    const { error: dbError } = await supabase
      .from('Usuario_infos')
      .insert([{ id_auth: userId, nome, idade, tipo }]);
    if (dbError) {
      return res.status(400).json({ error: dbError.message });
    }
    
    // Logs de sucesso ou erro 
    return res.status(201).json({ message: 'Usuário cadastrado com sucesso', user_id: userId });

  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
});

// ---------ROTA PARA LOGIN----------
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Faz o login pelo serviço Auth do Supabase
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
    
    // Busca de dados adicionias do usuário na tabela Usuario_infos (nome, tipo)
    const { data: infos, error: infoError } = await supabase
      .from('Usuario_infos')
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
