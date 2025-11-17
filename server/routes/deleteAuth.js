// importações necessárias
import { Router } from 'express';
import supabaseAdmin from '../db/supabaseAdmin.js'; 

const router = Router();

// Criação da rota POST /delete-user
router.post('/delete-user', async (req, res) => {
  const { user_id } = req.body;
  if (!user_id) {
    return res.status(400).json({ error: 'user_id obrigatório' });
  }

  console.log(`[Servidor] Iniciando exclusão completa para: ${user_id}`);

  try {
    // Seleciona os ids de todas as criancas ligasdas ao usuário na tabela Crianca
    const { data: criancas, error: errCriancas } = await supabaseAdmin
      .from('Crianca') 
      .select('id')
      .eq('id_responsavel', user_id);

    if (errCriancas) throw errCriancas;
    //Guarda todos os ids das crianças em um array
    const idsCriancas = (criancas || []).map(c => c.id);
    
    if (idsCriancas.length > 0) {
      //Apaga as pontuções relacionadas as crianças na tabela pontuacoes_materias
      const { error: errPontuacoes } = await supabaseAdmin
        .from('pontuacoes_materias') 
        .delete()
        .in('id_crianca', idsCriancas);
      if (errPontuacoes) throw errPontuacoes;

      // Apaga as tentativas relacionadas as crianças na tabela historico_tentativas
      const { error: errHistorico } = await supabaseAdmin
        .from('historico_tentativas') 
        .delete()
        .in('id_crianca', idsCriancas);
      if (errHistorico) throw errHistorico;
    }
    
    // Apaga as creianças da tabela Crianca
    const { error: errDelCriancas } = await supabaseAdmin
      .from('Crianca') 
      .delete()
      .eq('id_responsavel', user_id);
    if (errDelCriancas) throw errDelCriancas;

    // Apaga as informações adicionais do usuário na tabela Usuario_infos
    const { error: errInfos } = await supabaseAdmin
      .from('Usuario_infos') 
      .delete()
      .eq('id_auth', user_id);
    if (errInfos) throw errInfos;

    // Apaga o usuário no Auth do Supabase
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.deleteUser(user_id);
    if (authError) throw authError;

    console.log(`[Servidor] Usuário ${user_id} excluído com sucesso.`);
    return res.json({ ok: true, data: authData });

  } catch (err) {
    console.error('[Servidor] Erro inesperado na rota delete-user:', err);
    // Retorna o erro real para o cliente
    return res.status(500).json({ 
      error: err.message, 
      details: (err.code || 'Sem código') 
    });
  }
});

export default router;