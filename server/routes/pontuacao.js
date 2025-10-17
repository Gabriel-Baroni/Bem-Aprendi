import express from 'express';
import supabase from '../db/supabaseAdmin.js';

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

  } catch (error) {
    console.error('Erro ao atualizar pontuação:', error.message);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

export default router;
