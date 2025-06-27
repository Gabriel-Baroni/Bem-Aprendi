document.addEventListener('DOMContentLoaded', function () {
  // ---------------CADASTRO---------------
  const cadastroForm = document.getElementById('cadastro-form'); // Garante que o scrpit só seja executado após o carregamento completo do DOM 
  if (cadastroForm) {
    cadastroForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Atribui os campos das senhas a variáveis
      const senha = cadastroForm.senha.value;
      const confirSenha = cadastroForm.confir_senha.value;

      // Verificar se as senhas são iguais
      if (senha !== confirSenha) {
        alert('As senhas não coincidem!');
        return;
      }
      // Pega as informações do formulário 
      const formData = {
        nome: cadastroForm.nome.value,
        email: cadastroForm.email.value,
        senha: cadastroForm.senha.value,
        idade: cadastroForm.idade.value 
      };

      try {
        //Faz um requisição tipo POST ao endpoint do CADASTRO, enviando dados em JSON
        const response = await fetch('/auth/register', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        //Confirma se a resposta esta ok
        const result = await response.json();
        if (response.ok) {
          // localStorage.setItem('user_id', result.usuario.id);
          window.location.href = '/start.html';
          cadastroForm.reset();
        } else {
          alert(result.error || 'Erro ao cadastrar.');
        }
      } catch (error) {
        alert('Erro de conexão com o servidor.');
      }
    });
  }

  // -------------------LOGIN--------------------
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      
      // Pega as informações do formulário e atribui a variáveis
      const formData = {
        email: loginForm.email.value,
        senha: loginForm.senha.value,
      };

      try {
        //Faz uma requisição tipo POST ao endpoint do LOGIN, enviando dados em JSON
        const response = await fetch('/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        //Verifica se a resposta esta ok
        const result = await response.json();
        if (response.ok) {
          // Salvar tokens no localStorage
          localStorage.setItem('access_token', result.session.access_token);
          localStorage.setItem('refresh_token', result.session.refresh_token);
          localStorage.setItem('user_id', result.user_id);
          window.location.href = '/start.html';
          loginForm.reset();
        } else {
          alert(result.error || 'Erro ao fazer Login.');
        }
      } catch (error) {
        alert('Erro de conexão com o servidor.');
      }
    });
  }
});