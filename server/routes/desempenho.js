import express from 'express';
import supabase from '../db/supabaseAdmin.js'; // Use o cliente Admin do Supabase

const router = express.Router();

/*
 * ROTA: GET /api/desempenho/:idCrianca
 * Busca todo o histórico de tentativas de uma criança específica.
 * O ID da criança é passado pela URL.
 */
router.get('/:idCrianca', async (req, res) => {
    const { idCrianca } = req.params;

    if (!idCrianca) {
        return res.status(400).json({ message: 'ID da criança é obrigatório' });
    }

    try {
        // Busca todas as tentativas da criança, ordenadas por data
        const { data, error } = await supabase
            .from('historico_tentativas')
            .select('materia, pontuacao, created_at')
            .eq('id_crianca', idCrianca)
            .order('created_at', { ascending: true }); // Ordena da mais antiga para a mais nova

        if (error) {
            throw error; // Deixa o catch lidar com o erro
        }

        // Se 'data' for nulo (criança não existe ou não tem tentativas), 
        // apenas retorna um array vazio.
        res.json(data || []);

    } catch (error) {
        console.error('Erro ao buscar desempenho:', error.message);
        res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
});

export default router;