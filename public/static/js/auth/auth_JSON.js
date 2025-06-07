document.addEventListener('DOMContentLoaded', function () {
  // Cadastro
  const cadastroForm = document.getElementById('cadastro-form');
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
        idade: cadastroForm.idaide.value 
      };

      try {
        const response = await fetch('/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        const result = await response.json();
        if (response.ok) {
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

  // Login
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      
      // Pega as informações do formulário
      const formData = {
        email: loginForm.email.value,
        senha: loginForm.senha.value,
      };

      try {
        const response = await fetch('/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        const result = await response.json();
        if (response.ok) {
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