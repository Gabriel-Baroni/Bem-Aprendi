document.addEventListener('DOMContentLoaded', function () {
  const cadastroForm = document.getElementById('cadastro-form');
  const loginForm = document.getElementById('login-form');
  const cadastroTitle = document.querySelectorAll('.cadastro')[0];
  const loginTitle = document.querySelectorAll('.cadastro')[1];
  const showLoginBtn = document.getElementById('show-login');
  const showCadastroBtn = document.getElementById('show-cadastro');

  showLoginBtn.addEventListener('click', function () {
    cadastroForm.style.display = 'none';
    cadastroTitle.style.display = 'none';
    loginForm.style.display = 'flex';
    loginTitle.style.display = 'flex';
  });

  showCadastroBtn.addEventListener('click', function () {
    loginForm.style.display = 'none';
    loginTitle.style.display = 'none';
    cadastroForm.style.display = 'flex';
    cadastroTitle.style.display = 'flex';
  });
});