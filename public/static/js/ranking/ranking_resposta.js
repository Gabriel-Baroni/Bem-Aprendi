async function carregarRanking(materia) {
  //Busca as pontuações na rota /ranking/:materia
    const res = await fetch(`/ranking/${encodeURIComponent(materia)}`);
    const ranking = await res.json();
    const lista = document.getElementById('ranking-list');
    lista.innerHTML = '';
    if (!Array.isArray(ranking) || ranking.length === 0) {
      lista.innerHTML = '<li>Nenhuma pontuação encontrada.</li>';
      return;
    }
    //Cria um item de lista para cada entrada no ranking
    ranking.forEach((item, i) => {
      lista.innerHTML += `<li>${i+1}. ${item.nome} - ${item.pontuacao} pontos</li>`;
    });
  }

  const select = document.getElementById('materia-select');
  select.addEventListener('change', () => {
    carregarRanking(select.value);
  });

  carregarRanking(select.value);
  