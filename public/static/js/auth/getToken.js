// getToken.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://cpfehiufjitmzyrjiopc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwZmVoaXVmaml0bXp5cmppb3BjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNzE0NzYsImV4cCI6MjA2Mjc0NzQ3Nn0.JLs1f9S1qnkOyIw6b7CoKos_el8pHXIKi92WnK7-hd0';

const supabase = createClient(supabaseUrl, supabaseKey);

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
      console.error('❌ Erro ao configurar sessão:', error.message);
    } else {
      console.log('✅ Sessão iniciada:', data);
      // Remove o hash da URL
      history.replaceState(null, '', window.location.pathname);
      // Redireciona para a mesma página limpa ou outra, se quiser
      window.location.href = '/auth.html';
    }
  }
}

handleRedirect();
