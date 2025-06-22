import express from 'express';
import supabase from '../supabase.js'; // sua instância Supabase configurada

const router = express.Router();

router.post('/', async (req, res) => {
  const { user_id, pontuacao } = req.body;

  if (!user_id || typeof pontuacao !== 'number') {
    return res.status(400).json({ message: 'Dados inválidos' });
  }

  try {
    // Primeiro busca a pontuação atual do usuário
    const { data, error: selectError } = await supabase
      .from('Usuario_infos')
      .select('pontuacao_total')
      .eq('id', user_id)
      .single();

    if (selectError) throw selectError;

    const pontuacaoAtual = data?.pontuacao_total || 0;
    const novaPontuacao = pontuacaoAtual + pontuacao;

    // Atualiza somando a pontuação
    const { error: updateError } = await supabase
      .from('Usuario_infos')
      .update({ pontuacao_total: novaPontuacao })
      .eq('id', user_id);

    if (updateError) throw updateError;

    return res.status(200).json({ message: 'Pontuação atualizada com sucesso', pontuacao_total: novaPontuacao });
  } catch (err) {
    console.error('Erro ao atualizar pontuação:', err.message);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

export default router;
