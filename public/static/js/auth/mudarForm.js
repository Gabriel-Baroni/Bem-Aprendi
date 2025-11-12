document.addEventListener('DOMContentLoaded', function () {
  const cadastroForm = document.getElementById('cadastro-form');
  const loginForm = document.getElementById('login-form');
  const cadastroTitle = document.querySelectorAll('.cadastro')[0];
  const loginTitle = document.querySelectorAll('.cadastro')[1];
  const showLoginBtn = document.getElementById('show-login');
  const showCadastroBtn = document.getElementById('show-cadastro');

  // Aplica o fundo inicial de cadastro
  document.body.classList.add('cadastro-bg');

  //Mostrar o formulário de LOGIN
  showLoginBtn.addEventListener('click', function () {
    cadastroForm.style.display = 'none';
    cadastroTitle.style.display = 'none';
    loginForm.style.display = 'flex';
    loginTitle.style.display = 'flex';

    // Muda o fundo para login
    document.body.classList.remove('cadastro-bg');
    document.body.classList.add('login-bg');
  });
  
  //Mostrar o formulário de CADASTRO
  showCadastroBtn.addEventListener('click', function () {
    loginForm.style.display = 'none';
    loginTitle.style.display = 'none';
    cadastroForm.style.display = 'flex';
    cadastroTitle.style.display = 'flex';

    // Muda o fundo para cadastro
    document.body.classList.remove('login-bg');
    document.body.classList.add('cadastro-bg');
  });
});
