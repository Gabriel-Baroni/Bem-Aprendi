import supabase from '../db/supabaseClient.js';

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
    const { error: erroPontuacoes } = await supabase
      .from('pontuacoes_materias')
      .delete()
      .eq('id_crianca', id);
    if (erroPontuacoes) throw erroPontuacoes;

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
    const { data: criancas, error: errBuscar } = await supabase
      .from('Crianca')
      .select('id')
      .eq('id_responsavel', responsavel_id);
    if (errBuscar) throw errBuscar;

    const ids = (criancas || []).map(c => c.id);
    if (ids.length > 0) {
      const { error: erroPontuacoes } = await supabase
        .from('pontuacoes_materias')
        .delete()
        .in('id_crianca', ids);
      if (erroPontuacoes) throw erroPontuacoes;
    }

    const { error: erroCriancas } = await supabase
      .from('Crianca')
      .delete()
      .eq('id_responsavel', responsavel_id);
    if (erroCriancas) throw erroCriancas;

    const { error: erroResponsavel } = await supabase
      .from('Usuario_infos')
      .delete()
      .eq('id_auth', responsavel_id);
    if (erroResponsavel) throw erroResponsavel;

    // chama rota server-side que usa service_role para apagar do Auth
    const resp = await fetch('/auth/delete-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: responsavel_id })
    });
    const resultado = await resp.json();
    if (!resp.ok) throw new Error(resultado.error || 'Falha ao remover usuário do Auth');

    await supabase.auth.signOut();
    localStorage.clear();
    window.location.href = '/auth.html';
  } catch (err) {
    console.error('Erro ao excluir conta:', err);
    alert('Erro ao excluir a conta. Veja console para detalhes.');
  }
}

    

// Carrega perfis das crianças
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
      idParaExcluir = botao.getAttribute('data-id');
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
