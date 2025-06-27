document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("start-btn").addEventListener("click", () => {
    const userId = localStorage.getItem('user_id');

    if (!userId) {
      // Se não tiver user_id, redireciona para login e para a função aqui
      window.location.href = '/auth.html';
      return;  // para não executar o próximo redirecionamento
    }

    // Se tiver user_id, vai para a página principal
    window.location.href = "/index.html";
  });
});
