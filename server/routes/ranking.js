import express from 'express';
import supabase from '../db/supabaseAdmin.js';

const router = express.Router();

router.get('/:materia', async (req, res) => {
  const { materia } = req.params;

  // Busca as 10 maiores pontuações da matéria
  const { data: pontuacoes, error } = await supabase
    .from('pontuacoes_materias')
    .select('pontuacao, id_crianca')
    .eq('materia', materia)
    .order('pontuacao', { ascending: false })
    .limit(10);

  if (error) return res.status(400).json({ error: error.message });

  // Busca os nomes das crianças
  const ids = pontuacoes.map(p => p.id_crianca);
  const { data: criancas, error: errorCriancas } = await supabase
    .from('Crianca')
    .select('id, nome')
    .in('id', ids);

  if (errorCriancas) return res.status(400).json({ error: errorCriancas.message });

  // Junta nome da criança e pontuação
  const ranking = pontuacoes.map(p => {
    const crianca = criancas.find(c => c.id === p.id_crianca);
    return {
      nome: crianca ? crianca.nome : 'Criança',
      pontuacao: p.pontuacao
    };
  });

  res.json(ranking);
});

export default router;