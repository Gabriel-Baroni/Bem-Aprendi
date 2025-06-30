document.addEventListener('DOMContentLoaded', () => {
  const nomeresponsavel = localStorage.getItem('user_nome');
  const tipoUsuario = localStorage.getItem('tipo_usuario');


  if (nomeresponsavel) {
    document.getElementById('nome-responsavel').textContent = `Olá, ${nomeresponsavel}!`;
  }

  // Oculta o link de perfis se o usuário for criança
  if (tipoUsuario === 'crianca') {
    const linkPerfis = document.getElementById('link-perfis');
    if (linkPerfis) {
      linkPerfis.style.display = 'none';
    }
  }
});