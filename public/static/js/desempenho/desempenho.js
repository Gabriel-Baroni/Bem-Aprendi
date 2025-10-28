/*
* ARQUIVO: desempenho.js
* Busca dados da API backend e desenha gráficos.
*/

// ---- 1. CONFIGURE O SUPABASE CLIENT ----
// (Necessário apenas se você fosse usar o Supabase diretamente no frontend)
// const SUPABASE_URL = 'https://SEU_PROJETO.supabase.co';
// const SUPABASE_KEY = 'SUA_CHAVE_PUBLICA_ANON';
// const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


// ---- 2. FUNÇÃO PRINCIPAL ----
async function carregarDesempenho() {
    
    // Pega o ID e o Nome da criança do localStorage
    const criancaId = localStorage.getItem('crianca_id');
    const criancaNome = localStorage.getItem('crianca_nome');

    // Atualiza o título da página com o nome da criança
    if (criancaNome) {
        document.getElementById('titulo-desempenho').textContent = `Desempenho de ${criancaNome}`;
    }

    if (!criancaId) {
        alert("Nenhuma criança selecionada!");
        window.location.href = 'perfil.html'; // Ajuste este caminho se necessário
        return;
    }

    // ---- 3. BUSCA OS DADOS (AGORA DO NOSSO BACKEND) ----
    try {
        const response = await fetch(`/api/desempenho/${criancaId}`); 
        
        if (!response.ok) {
            const erroTexto = await response.text(); 
            throw new Error(`Erro na API: ${response.statusText}. Resposta: ${erroTexto}`);
        }
        
        const data = await response.json(); 

        if (data.length === 0) {
            // Poderia exibir uma mensagem na tela aqui, se desejado
            return; 
        }

        // ---- 4. PROCESSA E AGRUPA OS DADOS ----
        const dadosAgrupados = {};

        data.forEach(tentativa => {
            const { materia, pontuacao, created_at } = tentativa;
            // Validação simples
            if (!materia || typeof pontuacao !== 'number' || !created_at) {
                return; // Pula esta tentativa se faltar algo
            }

            if (!dadosAgrupados[materia]) {
                dadosAgrupados[materia] = { labels: [], scores: [] };
            }
            const dataFormatada = new Date(created_at).toLocaleDateString('pt-BR', {
                day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
            });
            dadosAgrupados[materia].labels.push(dataFormatada);
            dadosAgrupados[materia].scores.push(pontuacao);
        });
        
        // ---- 5. DESENHA OS GRÁFICOS ----
        for (const materia in dadosAgrupados) {
            const canvasId = `chart-${materia}`;
            const canvasElement = document.getElementById(canvasId);

            if (canvasElement) {
                try {
                    const ctx = canvasElement.getContext('2d');
                    new Chart(ctx, { 
                        type: 'line', 
                        data: {
                            labels: dadosAgrupados[materia].labels, 
                            datasets: [{
                                label: 'Pontuação',
                                data: dadosAgrupados[materia].scores, 
                                borderColor: 'rgb(75, 192, 192)',
                                borderWidth: 3,
                                fill: false,
                                tension: 0.1 
                            }]
                        },
                        options: { 
                            responsive: true,
                            maintainAspectRatio: false, 
                            scales: {
                                y: { beginAtZero: true, title: { display: true, text: 'Pontuação' } },
                                x: { title: { display: true, text: 'Data da Tentativa' } }
                            },
                            plugins: { legend: { display: false } }
                         }
                    });
                } catch (errorChart) {
                   console.error(`Erro ao criar gráfico para ${materia}:`, errorChart); 
                }
            } else {
                 console.warn(`Canvas #${canvasId} NÃO encontrado no HTML! Verifique o ID.`); 
            }
        }
        
    } catch (error) {
        console.error("ERRO GERAL em carregarDesempenho:", error); 
        alert("Não foi possível carregar o histórico: " + error.message);
    }
}

// Inicia o processo quando a página terminar de carregar
document.addEventListener('DOMContentLoaded', carregarDesempenho);