/*
* ARQUIVO: desempenho.js
*/

// ---- 1. CONFIGURE O SUPABASE CLIENT ----
// (Use as chaves PÚBLICAS 'anon key', não a 'service_role')
const SUPABASE_URL = 'https://SEU_PROJETO.supabase.co';
const SUPABASE_KEY = 'SUA_CHAVE_PUBLICA_ANON'; 
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


// ---- 2. FUNÇÃO PRINCIPAL ----
async function carregarDesempenho() {
    
    // Pega o ID e o Nome da criança do localStorage
    const criancaId = localStorage.getItem('crianca_id');
    const criancaNome = localStorage.getItem('crianca_nome');

    // Atualiza o título da página com o nome da criança
    if (criancaNome) {
        document.getElementById('titulo-desempenho').textContent = `Desempenho de ${criancaNome}`;
    }

    // Se não houver criança logada, interrompe e volta
    if (!criancaId) {
        alert("Nenhuma criança selecionada!");
        // Redireciona de volta para a tela de perfis
        // Ajuste este caminho se o seu perfil.html estiver em outra pasta
        window.location.href = 'perfil.html'; 
        return;
    }

    // ---- 3. BUSCA OS DADOS NO SUPABASE ----
    // Busca todas as tentativas da criança, ordenadas por data
    const { data, error } = await supabase
        .from('historico_tentativas')
        .select('materia, pontuacao, created_at')
        .eq('id_crianca', criancaId)
        .order('created_at', { ascending: true }); // Ordena da mais antiga para a mais nova

    if (error) {
        console.error("Erro ao buscar dados:", error);
        alert("Não foi possível carregar o histórico.");
        return;
    }

    // ---- 4. PROCESSA E AGRUPA OS DADOS ----
    // Transforma o array de dados [ {materia: 'x'}, {materia: 'y'} ]
    // em um objeto agrupado: { 'x': [...], 'y': [...] }
    const dadosAgrupados = {};

    data.forEach(tentativa => {
        const { materia, pontuacao, created_at } = tentativa;

        // Se for a primeira vez que vemos essa matéria, cria um array para ela
        if (!dadosAgrupados[materia]) {
            dadosAgrupados[materia] = {
                labels: [], // Onde vão as datas (eixo X)
                scores: []  // Onde vão as pontuações (eixo Y)
            };
        }

        // Formata a data para ficar legível (ex: "27/10/2025")
        const dataFormatada = new Date(created_at).toLocaleDateString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        });

        // Adiciona os dados nos arrays da matéria correspondente
        dadosAgrupados[materia].labels.push(dataFormatada);
        dadosAgrupados[materia].scores.push(pontuacao);
    });
    

    // ---- 5. DESENHA OS GRÁFICOS ----
    // Passa por cada matéria que encontramos (ex: 'Matemática', 'Lógica', etc.)
    for (const materia in dadosAgrupados) {
        
        // Pega o <canvas> correspondente no HTML
        // O ID do canvas DEVE ser 'chart-' + o nome da matéria
        const canvasElement = document.getElementById(`chart-${materia}`);
        
        // Se encontramos o canvas, desenha o gráfico
        if (canvasElement) {
            const ctx = canvasElement.getContext('2d');
            
            new Chart(ctx, {
                type: 'line', // Tipo de gráfico: linha
                data: {
                    labels: dadosAgrupados[materia].labels, // Datas no eixo X
                    datasets: [{
                        label: 'Pontuação',
                        data: dadosAgrupados[materia].scores, // Pontos no eixo Y
                        borderColor: 'rgb(75, 192, 192)',
                        borderWidth: 3,
                        fill: false,
                        tension: 0.1 // Deixa a linha levemente curvada
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false, // Permite que o gráfico preencha o .chart-container
                    scales: {
                        y: {
                            beginAtZero: true, // Começa o eixo Y do zero
                            title: {
                                display: true,
                                text: 'Pontuação'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Data da Tentativa'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false // Esconde a legenda "Pontuação" (opcional)
                        }
                    }
                }
            });
        } else {
            // Aviso caso o HTML não tenha um canvas para a matéria (ex: 'chart-Geografia')
            console.warn(`Elemento <canvas id="chart-${materia}"> não encontrado no HTML.`);
        }
    }
}

// Inicia o processo quando a página terminar de carregar
document.addEventListener('DOMContentLoaded', carregarDesempenho);