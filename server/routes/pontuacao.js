//Importações necessárias
import express from 'express';
import supabase from '../db/supabaseAdmin.js';

const router = express.Router();

//Define a rota POST 
router.post('/', async (req, res) => {
  const { id_crianca, materia, pontuacao } = req.body;

  //Verifica se os dados são válidos
  if (!id_crianca || !materia || typeof pontuacao !== 'number') {
    return res.status(400).json({ message: 'Dados inválidos' });
  }

  try {
    //Consulta pelo id na tabela Crianca 
    const { data: criancaData } = await supabase
      .from('Crianca')
      .select('id') 
      .eq('id', id_crianca)
      .single();

    //Se não tiver registro da criança, cria um registro
    if (!criancaData) {
      console.log(`Criança ${id_crianca} não encontrada, criando...`);
      const { error: insertCriancaError } = await supabase
        .from('Crianca')
        .insert([{ id: id_crianca, id_responsavel: id_crianca }]);
        
      if (insertCriancaError) throw insertCriancaError;
    }
    // Insere na tabela historico_tentativas todas as tentativas de cada usuário
    const { error: historicoError } = await supabase
      .from('historico_tentativas') 
      .insert([
        { id_crianca, materia, pontuacao }
      ]);
    if (historicoError) throw historicoError;

    // Atualiza a última pontuação do usuário em uma matéria na tabela pontuações_materias
    const { error: upsertError } = await supabase
      .from('pontuacoes_materias')
      .upsert(
        [{ id_crianca, materia, pontuacao }],
        { onConflict: ['id_crianca', 'materia'] } 
      );

    if (upsertError) throw upsertError;
    return res.status(201).json({ message: 'Pontuação registrada e histórico salvo' });

  } catch (error) {
    console.error('Erro ao registrar pontuação:', error.message);
    return res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
  }
});

export default router;