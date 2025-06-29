document.addEventListener('DOMContentLoaded', function () {
  // ---------------CADASTRO---------------
  const cadastroForm = document.getElementById('cadastro-form');
  if (cadastroForm) {
    cadastroForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const senha = cadastroForm.senha.value;
      const confirSenha = cadastroForm.confir_senha.value;

      if (senha !== confirSenha) {
        alert('As senhas não coincidem!');
        return;
      }

      const formData = {
        nome: cadastroForm.nome.value,
        email: cadastroForm.email.value,
        senha: cadastroForm.senha.value,
        idade: cadastroForm.idade.value
      };

      try {
        const response = await fetch('/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
          alert('Cadastro realizado com sucesso! Faça o login.');
          window.location.href = '/auth.html';
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

      const formData = {
        email: loginForm.email.value,
        senha: loginForm.senha.value,
      };

      try {
        const response = await fetch('/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
          // Salvar dados no localStorage
          localStorage.setItem('access_token', result.session.access_token);
          localStorage.setItem('refresh_token', result.session.refresh_token);
          localStorage.setItem('user_id', result.user_id);
          localStorage.setItem('user_nome', result.usuario.nome);
          localStorage.setItem('tipo_usuario', result.usuario.tipo);

          // Definir crianca_id dependendo do tipo de usuário
          if (result.usuario.tipo === 'responsavel') {
            // Limpa crianca_id para que o responsável escolha depois
            localStorage.removeItem('crianca_id');
            window.location.href = 'NavBar/perfis/perfil.html';
          } else {
            // Usuário é criança, usa seu próprio ID como crianca_id
            localStorage.setItem('crianca_id', result.user_id);
            localStorage.setItem('crianca_nome', result.usuario.nome);
            window.location.href = '/index.html';
          }

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
