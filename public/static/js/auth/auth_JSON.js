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
       
      //Agrupa os dados do formulário em um objeto
      const formData = {
        nome: cadastroForm.nome.value,
        email: cadastroForm.email.value,
        senha: cadastroForm.senha.value,
        idade: cadastroForm.idade.value
      };

      try {
        //Envio dos dados para a rota auth/register
        const response = await fetch('/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        //Converte a reposta em um objeto JSON
        const result = await response.json();
        
        //Verifica se o cadastro foi bem-sucedido
        if (response.ok) {
          // Salvar dados no localStorage
          localStorage.setItem('access_token', result.session.access_token);
          localStorage.setItem('refresh_token', result.session.refresh_token);
          localStorage.setItem('user_id', result.user_id);
          localStorage.setItem('user_nome', result.usuario.nome);
          localStorage.setItem('tipo_usuario', result.usuario.tipo);

          //Redireciona para a página de perfil após o cadastro
          window.location.href = '../../../NavBar/perfis/perfil.html';
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
      
      //Agrupa os dados do formulário em um objeto
      const formData = {
        email: loginForm.email.value,
        senha: loginForm.senha.value,
      };

      try {
        //Envio dos dados para a rota auth/login
        const response = await fetch('/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        //Converte a reposta em um objeto JSON
        const result = await response.json();

        //Verifica se o login foi bem-sucedido
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
            window.location.href = '../../../NavBar/perfis/perfil.html';
          } else {

            // Usuário é criança, usa seu próprio ID como crianca_id
            localStorage.setItem('crianca_id', result.user_id);
            localStorage.setItem('crianca_nome', result.usuario.nome);
          
            //Redireciona para a página de perfil após o login
            window.location.href = '../../../NavBar/perfis/perfil.html';
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
