// importações necessárias
import express from 'express';
import supabase from '../db/supabaseAdmin.js';

const router = express.Router();

// Define a rota GET para buscar o ranking de pontuções de uma matéria específica
router.get('/:materia', async (req, res) => {
  const { materia } = req.params;

// Busca as 10 maiores pontuações da matéria na tabela pontuacoes_materias
  const { data: pontuacoes, error } = await supabase
    .from('pontuacoes_materias')
    .select('pontuacao, id_crianca')
    .eq('materia', materia)
    .order('pontuacao', { ascending: false })
    .limit(10);

  if (error) return res.status(400).json({ error: error.message });

  // Busca os nomes das crianças que possuem as 10 maiores pontuações
  const ids = pontuacoes.map(p => p.id_crianca);

  // Consulta os dados das crianças (nome e ID) na tabela Crianca
  const { data: criancas, error: errorCriancas } = await supabase
    .from('Crianca')
    .select('id, nome')
    .in('id', ids);

  if (errorCriancas) return res.status(400).json({ error: errorCriancas.message });

 // Junta os nomes das crianças com as pontuações
  const ranking = pontuacoes.map(p => {
    const crianca = criancas.find(c => c.id === p.id_crianca);
    return {
      nome: crianca ? crianca.nome : 'Criança',
      pontuacao: p.pontuacao
    };
  });

  // Retorna a lista do ranking no formato JSON
  res.json(ranking);
});

export default router;