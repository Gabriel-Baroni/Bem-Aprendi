document.addEventListener('DOMContentLoaded', () => {
  const toggleThemeBtn = document.getElementById('toggle-theme');
  const body = document.body;

  function setTheme(mode) {
    body.setAttribute('data-bs-theme', mode);
    localStorage.setItem('tema-bootstrap', mode);
    if (toggleThemeBtn) {
      toggleThemeBtn.innerText = mode === 'dark' ? '☀️ Modo Claro' : '🌙 Modo Escuro';
    }
  }

  if (toggleThemeBtn) {
    toggleThemeBtn.addEventListener('click', () => {
      const atual = body.getAttribute('data-bs-theme');
      const novoTema = atual === 'light' ? 'dark' : 'light';
      setTheme(novoTema);
    });
  }

  const temaSalvo = localStorage.getItem('tema-bootstrap') || 'light';
  setTheme(temaSalvo);
});
