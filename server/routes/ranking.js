// importações necessárias
import express from 'express';
import supabase from '../db/supabaseAdmin.js';

const router = express.Router();

// Define a rota GET com parâmetro dinâmco para buscar o ranking de pontuções de uma matéria específica
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

  // usa o .map para extarir os IDs das crianças
  const ids = pontuacoes.map(p => p.id_crianca);

  // Utiliza o método .in para buscar os nomes das crianças na tabela Crianca com base nos IDs extraídos 
  const { data: criancas, error: errorCriancas } = await supabase
    .from('Crianca')
    .select('id, nome')
    .in('id', ids);

  if (errorCriancas) return res.status(400).json({ error: errorCriancas.message });

 // Usa o .map para combinar as pontuações com os nomes das crianças e retorna o ranking
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