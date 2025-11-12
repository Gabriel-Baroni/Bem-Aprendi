//Importações necessárias
import express from 'express';
import supabase from '../db/supabaseAdmin.js'; 

const router = express.Router();

// Define a rota GET com parâmetro dinâmico
router.get('/:idCrianca', async (req, res) => {
    const { idCrianca } = req.params;
    
    if (!idCrianca) {
        return res.status(400).json({ message: 'ID da criança é obrigatório' });
    }

    try {
        // Consulta a tabela historico_tentativas e ordena as pontuações da crianca por data
        const { data, error } = await supabase
            .from('historico_tentativas')
            .select('materia, pontuacao, created_at')
            .eq('id_crianca', idCrianca)
            .order('created_at', { ascending: true }); 

        if (error) {
            throw error; 
        }
        // Se for uma busca bem sucedidam retorna as pontuações
        res.json(data || []);

    } catch (error) {
        console.error('Erro ao buscar desempenho:', error.message);
        res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
});

export default router;