document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("start-btn").addEventListener("click", () => {
    const userId = localStorage.getItem('user_id');
    const tipoUsuario = localStorage.getItem('tipo_usuario');

    if (!userId || !tipoUsuario) {
      // Se não estiver logado, volta pro login
      window.location.href = '/auth.html';
      return;
    }

    if (tipoUsuario === 'responsavel') {
      // Se for responsável, vai para a seleção de perfis
      window.location.href = "/perfis/perfil.html";
    } else {
      // Se for criança, vai direto pro jogo
      window.location.href = "/index.html";
    }
  });
});
