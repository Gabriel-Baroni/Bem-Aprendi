import supabase from '../db/supabaseClient.js';

  const form = document.getElementById('form-crianca');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    //Pega os dados vindos do formulário
    const nome = document.getElementById('nome').value;
    const idade = parseInt(document.getElementById('idade').value);
    const id_responsavel = localStorage.getItem('user_id');

    if (!id_responsavel) {
      alert('Usuário não autenticado!');
      return;
    }
    //INsere os daddos na tabela Crianca
    const { data, error } = await supabase
      .from('Crianca')
      .insert([{ nome, idade, id_responsavel }]);

    const msg = document.getElementById('mensagem');
    if (error) {
      msg.textContent = 'Erro: ' + error.message;
      msg.style.color = 'red';
    } else {
        window.location.href = '/NavBar/perfis/perfil.html';
      form.reset();
    }
  });