// importações necessárias
import { Router } from 'express';
import supabaseAdmin from '../db/supabaseAdmin.js'; // Seu cliente admin

const router = Router();

// Criação da rota POST /delete-user
router.post('/delete-user', async (req, res) => {
  const { user_id } = req.body;
  if (!user_id) {
    return res.status(400).json({ error: 'user_id obrigatório' });
  }

  console.log(`[Servidor] Iniciando exclusão completa para: ${user_id}`);

  try {
    // PASSO 1: Deleta os "netos" (ligados às crianças)
    // Primeiro, encontramos os IDs das crianças
    const { data: criancas, error: errCriancas } = await supabaseAdmin
      .from('Crianca') // Atenção: Pode precisar de aspas se o nome for "Crianca"
      .select('id')
      .eq('id_responsavel', user_id);

    if (errCriancas) throw errCriancas;

    const idsCriancas = (criancas || []).map(c => c.id);

    if (idsCriancas.length > 0) {
      // Apaga pontuações
      const { error: errPontuacoes } = await supabaseAdmin
        .from('pontuacoes_materias') // Atenção: Pode precisar de aspas
        .delete()
        .in('id_crianca', idsCriancas);
      if (errPontuacoes) throw errPontuacoes;

      // Apaga histórico
      const { error: errHistorico } = await supabaseAdmin
        .from('historico_tentativas') // Atenção: Pode precisar de aspas
        .delete()
        .in('id_crianca', idsCriancas);
      if (errHistorico) throw errHistorico;
    }

    // PASSO 2: Deleta os "filhos" (ligados ao usuário)
    
    // Apaga Crianças
    const { error: errDelCriancas } = await supabaseAdmin
      .from('Crianca') // Atenção: Pode precisar de aspas
      .delete()
      .eq('id_responsavel', user_id);
    if (errDelCriancas) throw errDelCriancas;

    // Apaga Infos
    const { error: errInfos } = await supabaseAdmin
      .from('Usuario_infos') // Atenção: Pode precisar de aspas
      .delete()
      .eq('id_auth', user_id);
    if (errInfos) throw errInfos;

    // PASSO 3: Deleta o "pai" (o próprio usuário)
    // Este é o comando que você já tinha
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