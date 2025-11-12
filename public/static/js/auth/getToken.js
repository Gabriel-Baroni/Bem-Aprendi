// getToken.js
import supabase from '../db/supabaseClient.js';

async function handleRedirect() {
  const hash = window.location.hash;

  if (hash.includes('access_token')) {
    const params = new URLSearchParams(hash.substring(1));
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');

    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });

    if (error) {
      console.error('Erro ao configurar sessão:', error.message);
    } else {

      // Remove o hash da URL
      history.replaceState(null, '', window.location.pathname);
      // Redireciona para a mesma página limpa ou outra, se quiser
      window.location.href = '/auth.html';
    }
  }
}

handleRedirect();
