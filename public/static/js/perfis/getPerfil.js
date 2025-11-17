import supabase from '../db/supabaseClient.js';

//Pega os itens do localStorage
const responsavel_id = localStorage.getItem('user_id');
const listaPerfis = document.getElementById('lista-perfis');
const btnCadastrar = document.getElementById('btn-cadastrar');

if (!responsavel_id) {
  alert('Usuário não autenticado. Faça login!');
  window.location.href = '/auth.html';
}

let idParaExcluir = null;
const btnConfirmar = document.getElementById('btnConfirmarExclusao');
const modalElement = document.getElementById('modalConfirmarExclusao');
const modal = new bootstrap.Modal(modalElement);

// Confirma exclusão
btnConfirmar.addEventListener('click', async () => {
  if (idParaExcluir) {
    await excluirPerfil(idParaExcluir);
    modal.hide();
    idParaExcluir = null;
    carregarPerfis();
  }
  else {
    await deletarContaResponsavel();
    modal.hide();
  }
});

// Função de excluir perfil criança
async function excluirPerfil(id) {
  try {
    //Deleta as pontuações da crinaça
    const { error: erroPontuacoes } = await supabase
      .from('pontuacoes_materias')
      .delete()
      .eq('id_crianca', id);
    if (erroPontuacoes) throw erroPontuacoes;
    //Deleta o progresso da criança
    const { error: erroProgresso } = await supabase
      .from("historico_tentativas")
      .delete()
      .eq("id_crianca", id);
    if (erroProgresso) throw erroProgresso;

    //Deleta o perfil da criança
    const { error: erroCrianca } = await supabase
      .from('Crianca')
      .delete()
      .eq('id', id);
    if (erroCrianca) throw erroCrianca;

  } catch (err) {
    console.error("Erro ao excluir perfil:", err);
    alert("Erro ao excluir o perfil. Verifique se há dados vinculados.");
  }
}

async function deletarContaResponsavel() {
  try {
    // CHAMA A ROTA DO SERVIDOR /delete-user
    const resp = await fetch('/auth/delete-user', { // Ajuste o caminho se necessário
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Envia o ID do responsável que está na variável global
      body: JSON.stringify({ user_id: responsavel_id })
    });

    // Verifica se a rota falhou
    if (!resp.ok) {
      const errorData = await resp.json();
      throw new Error(errorData.error || `Falha no servidor: ${resp.status}`);
    }
    

    console.log('Usuário excluído com sucesso pela rota.');
    await supabase.auth.signOut();
    localStorage.clear();
    window.location.href = '/auth.html';

  } catch (err) {
    console.error('Erro detalhado ao excluir conta:', err.message);
    alert('Erro ao excluir a conta. Veja o console para detalhes.');
  }
}

    

// Carrega perfis das crianças
async function carregarPerfis() {
  //Seleciona as crianças do responsável logado
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
      <button class="botao-entrar-perfil" data-id="${crianca.id}">Entrar no Perfil</button>
      <button class="botao-excluir-perfil" data-id="${crianca.id}">Excluir 🗑️</button>
    `;
    listaPerfis.appendChild(card);
  });

  // Só adiciona os eventos DEPOIS que os cards estão criados
  document.querySelectorAll('.botao-entrar-perfil').forEach(botao => {
    botao.addEventListener('click', () => {
      const id = botao.getAttribute('data-id');
      const nome = botao.parentElement.querySelector('h3').textContent;
      localStorage.setItem('crianca_id', id);
      localStorage.setItem('crianca_nome', nome);
      window.location.href = '../../index.html';
    });
  });

  document.querySelectorAll('.botao-excluir-perfil').forEach(botao => {
    botao.addEventListener('click', () => {
      idParaExcluir = botao.getAttribute('data-id'); //atribui o id para exclusão
      modal.show();
    });
  });
}

document.getElementById('excluir_responsável').addEventListener('click', () => {
  modal.show()
});
btnCadastrar.addEventListener('click', () => {
  window.location.href = '/NavBar/perfis/cadastrar_crianca.html';
});

carregarPerfis();
