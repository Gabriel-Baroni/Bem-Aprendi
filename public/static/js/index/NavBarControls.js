document.addEventListener('DOMContentLoaded', () => {
  const nomecrianca = localStorage.getItem('crianca_nome');
  const tipoUsuario = localStorage.getItem('tipo_usuario');


  if (nomecrianca) {
    document.getElementById('nome-crianca').textContent = `Olá, ${nomecrianca}!`;
  }

  // Oculta o link de perfis se o usuário for criança
  if (tipoUsuario === 'crianca') {
    const linkPerfis = document.getElementById('link-perfis');
    if (linkPerfis) {
      linkPerfis.style.display = 'none';
    }
  }
});