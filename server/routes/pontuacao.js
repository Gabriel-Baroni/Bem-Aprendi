import express from 'express';
import supabase from '../db/supabaseClient.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { id_crianca, materia, pontuacao } = req.body;

  if (!id_crianca || !materia || typeof pontuacao !== 'number') {
    return res.status(400).json({ message: 'Dados inválidos' });
  }

  try {
    // 1. Verificar se a criança existe
    const { data: criancaData, error: criancaError } = await supabase
      .from('Crianca')
      .select('*')
      .eq('id', id_crianca)
      .single();

    // 2. Se não existir, inserir criança auto-responsável
    if (!criancaData) {
      const { error: insertError } = await supabase
        .from('Crianca')
        .insert([{ id: id_crianca, id_responsavel: id_crianca}]);
      if (insertError) throw insertError;
    }

    // 3. Fazer upsert da pontuação
    const { error: upsertError } = await supabase
      .from('pontuacoes_materias')
      .upsert(
        [{ id_crianca, materia, pontuacao }],
        { onConflict: ['id_crianca', 'materia'] }
      );

    if (upsertError) throw upsertError;

    // 4. Buscar todas as pontuações para recalcular total
    const { data: pontuacoes, error: selectError } = await supabase
      .from('pontuacoes_materias')
      .select('pontuacao')
      .eq('id_crianca', id_crianca);

    if (selectError) throw selectError;

    // 5. Calcular nova pontuação total
    const novaPontuacaoTotal = pontuacoes.reduce((acc, p) => acc + (p.pontuacao || 0), 0);

    // 6. Atualizar pontuação total na tabela Crianca
    const { error: updateError } = await supabase
      .from('Crianca')
      .update({ pontuacao_total: novaPontuacaoTotal })
      .eq('id', id_crianca);

    if (updateError) throw updateError;

    return res.status(200).json({
      message: 'Pontuação atualizada com sucesso',
      pontuacao_total: novaPontuacaoTotal,
    });

  } catch (error) {
    console.error('Erro ao atualizar pontuação:', error.message);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

export default router;
