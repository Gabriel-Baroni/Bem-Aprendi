// importações necessárias
import express from 'express';
import supabase from '../db/supabaseAdmin.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { id_crianca, materia, pontuacao } = req.body;

  if (!id_crianca || !materia || typeof pontuacao !== 'number') {
    return res.status(400).json({ message: 'Dados inválidos' });
  }

  try {
    const { data: criancaData } = await supabase
      .from('Crianca')
      .select('id') 
      .eq('id', id_crianca)
      .single();

    if (!criancaData) {
      console.log(`Criança ${id_crianca} não encontrada, criando...`);
      const { error: insertCriancaError } = await supabase
        .from('Crianca')
        .insert([{ id: id_crianca, id_responsavel: id_crianca }]);
        
      if (insertCriancaError) throw insertCriancaError;
    }

    const { error: historicoError } = await supabase
      .from('historico_tentativas') // <-- Nome da nova tabela
      .insert([
        { id_crianca, materia, pontuacao }
      ]);
      
    if (historicoError) throw historicoError;

    // 3. ATUALIZAR A PONTUAÇÃO PRINCIPAL (O CÓDIGO ANTIGO)
    // Atualiza a tabela 'pontuacoes_materias' com a pontuação mais recente.
    const { error: upsertError } = await supabase
      .from('pontuacoes_materias')
      .upsert(
        [{ id_crianca, materia, pontuacao }],
        { onConflict: ['id_crianca', 'materia'] } // Use o nome da sua restrição
      );

    if (upsertError) throw upsertError;
    
    // 4. Enviar resposta de sucesso (TAMBÉM FALTA NO SEU CÓDIGO)
    return res.status(201).json({ message: 'Pontuação registrada e histórico salvo' });

  } catch (error) {
    console.error('Erro ao registrar pontuação:', error.message);
    return res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
  }
});

export default router;