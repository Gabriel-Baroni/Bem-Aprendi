import supabase from '../db/supabaseClient.js';// ajuste o caminho conforme seu projeto

    const responsavel_id = localStorage.getItem('user_id');
    const listaPerfis = document.getElementById('lista-perfis');
    const btnCadastrar = document.getElementById('btn-cadastrar');

    if (!responsavel_id) {
      alert('Usuário não autenticado. Faça login!');
      window.location.href = '/login.html'; // ajuste a rota do login
    }

    // Carregar perfis da criança
    async function carregarPerfis() {
      const { data: criancas, error } = await supabase
        .from('Crianca')
        .select('id, nome, idade')
        .eq('id_responsavel', responsavel_id);

      if (error) {
        alert('Erro ao carregar perfis: ' + error.message);
        return;
      }

      if (criancas.length === 0) {
        listaPerfis.innerHTML = '<p>Você não tem perfis cadastrados ainda.</p>';
        return;
      }

      listaPerfis.innerHTML = ''; // limpa

      criancas.forEach(crianca => {
        const card = document.createElement('div');
        card.className = 'perfil-card';
        card.innerHTML = `
          <h3>${crianca.nome}</h3>
          <p>Idade: ${crianca.idade}</p>
          <button data-id="${crianca.id}">Entrar no Perfil</button>
        `;
        listaPerfis.appendChild(card);

        card.querySelector('button').addEventListener('click', () => {
          localStorage.setItem('crianca_id', crianca.id);
          localStorage.setItem('crianca_nome', crianca.nome);
          // redirecionar para o jogo ou área da criança
          window.location.href = '../../index.html'; // ajuste a rota
        });
      });
    }

    btnCadastrar.addEventListener('click', () => {
      window.location.href = 'cadastrar_crianca.html';
    });

    carregarPerfis();