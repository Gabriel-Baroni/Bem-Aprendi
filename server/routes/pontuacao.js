import express from 'express';
import supabase from '../db/supabaseClient.js';

const router = express.Router();

router.post('/', async (req, res) => { //função assíncrona para lidar com a requisição POST
  const { user_id, materia, pontuacao } = req.body; // extrai os dados do corpo da requisição

  if (!user_id || !materia || typeof pontuacao !== 'number') { //Verifica se os dados estão conformes o esperado
    return res.status(400).json({ message: 'Dados inválidos' });
  }

  try {
    // Faz upsert da pontuação da matéria (atualiza se já existe, insere se não)
    const { error: upsertError } = await supabase
      .from('pontuacoes_materias') //Consula a tabela pontuacoes_materias
      .upsert([
        { id_auth: user_id, materia, pontuacao } // Insere os dados
      ], { onConflict: ['id_auth', 'materia'] }); // Atualiza se já existir um registro com o mesmo id_auth e materia

    if (upsertError) throw upsertError; //Se tiver erro na ação de upsert, lança o erro

     
    const { data: pontuacoes, error: selectError } = await supabase 
      .from('pontuacoes_materias') // Consulta a tabela pontuacoes_materias para pegar as últimas pontuações
      .select('pontuacao') // Seleciona apenas a coluna pontuacao
      .eq('id_auth', user_id); // Filtra pelo id do usuário 

    if (selectError) throw selectError; //Se tiver erro na consulta, lança o erro

     // Recalcula a pontuação total do usuário somando as últimas pontuações de cada matéria
    const novaPontuacaoTotal = pontuacoes.reduce((soma, p) => soma + (p.pontuacao || 0), 0);

    // Atualiza na tabela Usuario_infos
    const { error: updateError } = await supabase
      .from('Usuario_infos') // Consulta a tabela Usuario_infos para atualizar a pontuação total
      .update({ pontuacao_total: novaPontuacaoTotal }) // Atualiza a coluna pontuacao_total com o novo valor
      .eq('id_auth', user_id);  // Filtra pelo id do usuário

    if (updateError) throw updateError; // Se tiver erro na atualização, lança o erro

    return res.status(200).json({
      message: 'Pontuação da matéria e total atualizadas com sucesso',
      pontuacao_total: novaPontuacaoTotal  
    });
  } catch (err) {
    console.error('Erro ao atualizar pontuação:', err.message);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

export default router; 
