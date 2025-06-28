document.addEventListener('DOMContentLoaded', () => {
  const tipoUsuario = localStorage.getItem('tipo_usuario');

  // Oculta o link de perfis se o usuário for criança
  if (tipoUsuario === 'crianca') {
    const linkPerfis = document.getElementById('link-perfis');
    if (linkPerfis) {
      linkPerfis.style.display = 'none';
    }
  }
});