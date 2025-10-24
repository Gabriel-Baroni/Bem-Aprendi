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
      window.location.href = "NavBar/perfis/perfil.html";
    } else {
      // Se for criança, vai direto pro jogo
      window.location.href = "/index.html";
    }
  });
  const musica = document.getElementById('musica-fundo');
  // Função para rodar no primeiro clique
  function liberarMusica() {
    musica.muted = false; // Tira o mudo
    musica.play();        // Garante o play
  
    // Remove o "ouvinte" para não rodar de novo
    document.removeEventListener('click', liberarMusica);
  }

  // Fica esperando o primeiro clique do usuário na página
  document.addEventListener('click', liberarMusica);

  
});
