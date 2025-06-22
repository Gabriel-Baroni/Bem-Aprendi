// Aguarda o carregamento da página
window.onload = function () {
  // Cria um novo palco no CreateJS e delimita o framerate em 60 fps
  const stage = new createjs.Stage("gameCanvas");
  createjs.Ticker.framerate = 60;
  createjs.Ticker.addEventListener("tick", stage);

  // Variável para armazenar o tempo em segundos
  let tempo = 0;
  const coresFase = ["#fffbcc", "#d4f1f9", "#e4ffd8", "#fce4ec", "#f0e0ff"];
  const coresBlocosFase = ["#fff7db", "#d4f1f9", "#e4ffd8", "#fce4ec", "#f0e0ff"];
    // Variável para armazenar a fase atual
  let faseAtual = 0; 
  atualizarCorFase();

  // Cria um texto para exibir o tempo na tela
  const textoTimer = new createjs.Text("Tempo: 0s", "12px 'Press Start 2P'", "#000");
  textoTimer.x = 10;
  textoTimer.y = 10;
  stage.addChild(textoTimer);

  // --- NOVO: texto para mostrar quantas combinações faltam ---
  const textoFaltam = new createjs.Text(`Faltam: 0`, "12px 'Press Start 2P'", "#000");
  textoFaltam.x = 650;
  textoFaltam.y = 10;
  stage.addChild(textoFaltam);

  // Atualiza o tempo a cada segundo
  setInterval(() => {
    tempo++;
    textoTimer.text = "Tempo: " + tempo + "s";
  }, 1000);

  // Array com a coordenada X de cada coluna
  let colX = [150, 350, 550, 750];
  // Array de arrays com o conteúdo de cada coluna
  const fases = [
    [
      [38, 14, 21, 7],
      ['+', '-', '×', '÷'],
      [9, 2, 17, 3],
      [45, 29, 7, 38]
    ],
    [
      [18, 9, 72, 61],
      ['+', '-', '×', '÷'],
      [25, 4, 8, 19],
      [2, 43, 36, 41]
    ],
    [
      [33, 12, 54, 8],
      ['+', '-', '×', '÷'],
      [15, 11, 9, 7],
      [4, 18, 21, 27]
    ],
    [
      [80, 47, 19, 5],
      ['+', '-', '×', '÷'],
      [10, 23, 16, 6],
      [17, 24, 56, 35]
    ],
    [
      [13, 29, 36, 25],
      ['+', '-', '×', '÷'],
      [2, 12, 6, 18],
      [14, 41 , 26, 42]
    ]
  ];
  // Variável para armazenar a pontuação acumulada
  let pontuacaoAcumulada = 0; 
  // Array para armazenar todos os blocos (caixas com os números)
  let blocos = [];
  // Array para armazenar todos os blocos selecionados 
  let pontosSelecionados = [];
  // Array para armazenar todos as linhas de respostas erradas
  let linhasErradas = [];
  // Índice para pegar um cor diferente a cada resposta correta
  let corIndex = 0;
  // Array com possíveis cores para linhas de respostas corretas
  const coresLinhas = ["blue", "purple", "orange", "brown", "deeppink", "green", "teal"];
  // Cor original dos blocos 
  const corOriginal = "#fff7db";
  // Cor dos blocos selecionados
  const corSelecionado = "#a8d8ea";
  // Imagens dos ícones de certo ou errado
  const iconeCerto = new Image();
  iconeCerto.src = "https://img.icons8.com/emoji/48/000000/check-mark-emoji.png";
  const iconeErrado = new Image();
  iconeErrado.src = "https://img.icons8.com/emoji/48/000000/cross-mark-emoji.png";
  createjs.Sound.registerSound("../static/sound/digital-beeping.mp3", "acerto");
  createjs.Sound.registerSound("../static/sound/error_008.ogg", "erro");
  // Variável para pontuação do usuário, começa em 0
  let pontuacao = 0;
  // Contador de respostas corretas para controlar quando acabar as possibilidades
  let respostasCorretas = 0;
  // Total de respostas possíveis (exemplo, pode ser ajustado conforme o jogo)
  const totalRespostasPossiveis = 5; // Ajuste esse número de acordo com as combinações corretas possíveis no seu jogo
  // Variável para armazenar as vidas
  let vidas = 3; 

  // Atualiza o texto que mostra quantas combinações faltam
  function atualizarTextoFaltam() {
    textoFaltam.text = `Faltam: ${totalRespostasPossiveis - respostasCorretas} contas para fazer!`;
  }
  function atualizarCorFase() {
  const cor = coresFase[faseAtual] || "#ffffff";
  document.body.style.backgroundColor = cor;
  const canvas = document.getElementById("gameCanvas");
  canvas.style.backgroundColor = cor; // muda fundo do canvas também
}
  // Função para atualizar o número de vidas exibido na tela
  function atualizarVidas() {
      const vidasDiv = document.getElementById("vidas");
      vidasDiv.textContent = "❤️".repeat(vidas);
    }

  // Função que cria cada bloco, tem como parâmetros um texto para o bloco, suas coordenadas e o tipo 
  function criarBloco(texto, x, y, tipo) {
    const cont = new createjs.Container(); //Cria um container 
    const shape = new createjs.Shape(); 
    const corBloco = coresBlocosFase[faseAtual] || corOriginal; // Dentro do container, cria uma forma
    shape.graphics.beginFill(corBloco).setStrokeStyle(3).beginStroke("#ffa500").drawRoundRect(0, 0, 90, 80, 12); // Define a forma como um retângulo e atribui suas características 

    const label = new createjs.Text(texto, "30px Comic Sans MS", "#000"); //Cria um texto com o texto passado pelo parâmetro
    // Define a posição do texto dentro do container
    label.textAlign = "center";
    label.textBaseline = "middle";
    label.x = 45;
    label.y = 40;
    cont.addChild(shape, label);  // Adiciona o retângulo e o texto como filhos do container
    // Define as coordenadas do container a partir das passadas por parâmetro
    cont.x = x;
    cont.y = y;
    cont.valor = texto;// Cria uma nova propriedade do container e armazena o valor do texto passado (String ou número)
    cont.tipo = tipo;  // Cria uma propriedade, que recebe o valor passado pelo parâmetro, ajuda na classificação do bloco entre as colunas (String)
    // Cria propriedades que referenciam o retângulo e o texto (Objeto do CreateJS)
    cont.shape = shape; 
    cont.label = label;
    cont.linhasConectadas = []; // Inicializa uma propriedade para armazenar as linhas conectadas no bloco 
    blocos.push(cont);  // Adiciona o container criado à lista de blocos
    return cont; // Retorna o bloco criado
  }

  // Função para criar as colunas 
function criarColunas() {
  blocos = []; // Limpa os blocos antigos
  const colunas = fases[faseAtual]; // Usa as colunas da fase atual
  for (let i = 0; i < colunas.length; i++) { // Laço for externo, que percorre cada coluna
    for (let j = 0; j < colunas[i].length; j++) { // Laço for interno, que percorre cada elemento da coluna
      const bloco = criarBloco(colunas[i][j], colX[i], 50 + j * 100, i); // Chama a função criarBloco
      stage.addChild(bloco); // Adiciona esse novo bloco ao palco 
    }
  }
}

  // Função para identificar qual bloco foi clicado, tem como parâmetro a coordenada do clique
  function pegarBlocoEm(x, y) {
    return blocos.find(b => { //Usa o método find() para procurar dentro do array blocos
      const bx = b.x, by = b.y; //Cria variáveis com as coordenadas x e y do bloco
      return x >= bx && x <= bx + 90 && y >= by && y <= by + 80; //Vai retornar blocos que estiverem dentro da coordenada do clique. 
    });
  }

  // Função global que reseta todas as linhas vermelhas e blocos selecionados
  window.resetLinha = function () {
    // Perocorre o array de linhas erradas e remove elas do palco
    for (let l of linhasErradas) {
      stage.removeChild(l);
    }
    // Retorna a os atributos originais em cada bloco em todos os blocos
    blocos.forEach(b => {
       const corBloco = coresBlocosFase[faseAtual] || corOriginal; // Dentro do container, cria uma forma
       b.shape.graphics.beginFill(corBloco).setStrokeStyle(3).beginStroke("#ffa500").drawRoundRect(0, 0, 90, 80, 12);
    });
    // Limpa os arrays de linhasErradas e pontosSelecionados
    linhasErradas = [];
    pontosSelecionados = [];
    stage.update(); //Força a atualização da tela
  }

  // Função para resetar o jogo (resetar variáveis, limpar linhas, etc)
function resetJogo() {
  pontuacao = 0;
  respostasCorretas = 0;
  corIndex = 0;
  vidas = 3; // Resetar vidas também
  tempo=0

  // Remove todas as linhas erradas do palco
  linhasErradas.forEach(l => stage.removeChild(l));
  linhasErradas = [];

  // Remove todas as linhas corretas conectadas de cada bloco
  blocos.forEach(b => {
    b.linhasConectadas.forEach(linha => {
      stage.removeChild(linha);
    });
    b.linhasConectadas = []; // limpa o array do bloco

    // Restaura o visual original do bloco
    const corBloco = coresBlocosFase[faseAtual] || corOriginal; // Dentro do container, cria uma forma
    b.shape.graphics.clear().beginFill(corBloco).setStrokeStyle(3).beginStroke("#ffa500").drawRoundRect(0, 0, 90, 80, 12);
  });

  // Limpa os blocos selecionados
  pontosSelecionados = [];

    blocos.forEach(b => stage.removeChild(b));
  criarColunas(); // Recria blocos com base na nova fase

  atualizarTextoFaltam(); // Atualiza o texto das combinações faltando
  atualizarVidas(); // Atualiza o texto das vidas
  atualizarCorFase(); 
  stage.update();
}

// Função para enviar a pontuação acumulada para o endpoint pontuação.js
function enviarPontuacaoParaServidor(pontuacao, materia) {
  const userId = localStorage.getItem('user_id');
  
  if (!userId) {
    console.error('Usuário não autenticado!');
    return;
  }

  fetch("/pontuacao", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      materia: materia,         
      pontuacao: pontuacao
    })
  })
  .then(res => res.json())
  .then(data => console.log("Pontuação atualizada:", data))
  .catch(err => console.error("Erro ao enviar pontuação:", err));
}

// Função para criar o pop-up de fim de fase
function criarPopupFinal() {
  pontuacaoAcumulada += pontuacao;  // soma a pontuação da fase atual

  const popup = document.getElementById("popupFimFase");
  const pontuacaoSpan = document.getElementById("pontuacaoFinal");
  pontuacaoSpan.textContent = pontuacao; // Pontuação da fase atual
  popup.classList.add("mostrar");

  const btnProximo = document.getElementById("btnProximo");
  const btnJogarDeNovo = document.getElementById("btnJogarDeNovo");

  if (faseAtual < fases.length - 1) {
    btnProximo.textContent = "Próxima Fase";
    btnProximo.style.display = "inline-block";
    btnProximo.onclick = () => {
      faseAtual++;
      popup.classList.remove("mostrar");
      resetJogo();
    };
  } else {
    btnProximo.textContent = "Finalizar";
    btnProximo.style.display = "inline-block";
    btnProximo.onclick = () => {
      popup.classList.remove("mostrar");

      // Enviar pontuação acumulada para o servidor
      enviarPontuacaoParaServidor(pontuacaoAcumulada, "matematica");

      alert("🎉 Parabéns! Você completou todas as fases! Sua pontuação total foi: " + pontuacaoAcumulada);
      window.location.href = "/index.html";
    };
  }

  btnJogarDeNovo.onclick = () => {
    popup.classList.remove("mostrar");
    resetJogo();
  };
}

// Função para criar o pop-up de game over
function criarPopupGameOver() {
  const popup = document.getElementById("popupGameOver");

  // Exibe o popup
  popup.classList.add("mostrar");

  // Configura o botão "Jogar de Novo"
  document.getElementById("btnGameOverJogarDeNovo").onclick = () => {
    popup.classList.remove("mostrar"); 
    resetJogo(); 
  };
  const btnFechar = popup.querySelector(".close-btn");
  if (btnFechar) {
    btnFechar.onclick = () => popup.classList.remove("mostrar");
  };

   document.getElementById("btnGameOverMenu").onclick = () => {
    window.location.href = "/index.html";

  };
}

 stage.on("stagemousedown", (evt) => {
  const bloco = pegarBlocoEm(evt.stageX, evt.stageY);
  if (!bloco) return;

  // Se o bloco já está selecionado, não faz nada (evita seleção dupla)
  if (pontosSelecionados.includes(bloco)) return;

  // Verifica se já tem um bloco selecionado na mesma coluna (tipo)
  const blocoMesmoTipo = pontosSelecionados.find(b => b.tipo === bloco.tipo);

  if (blocoMesmoTipo) {
    // Desmarcar o bloco anterior da mesma coluna
    const corBloco = coresBlocosFase[faseAtual] || corOriginal; // Dentro do container, cria uma forma
    blocoMesmoTipo.shape.graphics.clear().beginFill(corBloco).setStrokeStyle(3).beginStroke("#ffa500").drawRoundRect(0, 0, 90, 80, 12);

    // Remove ele do array de selecionados
    pontosSelecionados = pontosSelecionados.filter(b => b !== blocoMesmoTipo);
  }

  // Marca o novo bloco selecionado
  pontosSelecionados.push(bloco);
  bloco.shape.graphics.clear().beginFill(corSelecionado).setStrokeStyle(3).beginStroke("#ffa500").drawRoundRect(0, 0, 90, 80, 12);

  // Verifica se já selecionou 4 blocos (1 por coluna)
  if (pontosSelecionados.length === 4) {
    verificarResposta();
  }
});

  // Cria uma função para mostrar o icone de certo ou errado 
  function mostrarIcone(resultado, x, y) {
    const bitmap = new createjs.Bitmap(resultado ? iconeCerto : iconeErrado); //Cria uma nova imagem que vai variar de valor dependendo se resultado for TRUE ou FALSE 
    bitmap.x = x;
    bitmap.y = y;
    bitmap.scaleX = bitmap.scaleY = 0.6;
    createjs.Sound.play(resultado ? "acerto" : "erro");
    stage.addChild(bitmap);
    createjs.Tween.get(bitmap) // Animação para retirar o ícone da tela
      .to({ alpha: 0, y: y - 20 }, 1500)
      .call(() => stage.removeChild(bitmap));
  }

 // Cria a função que verifica se a operação matemática feita está correta
function verificarResposta() {
  // --- MODIFICAÇÃO: organiza os blocos por tipo antes de verificar ---
  const ordenados = [];
  for (let i = 0; i < 4; i++) {
    const bloco = pontosSelecionados.find(b => b.tipo === i);
    if (!bloco) return; // caso falte algum, evita erro
    ordenados.push(bloco);
  }

  const [b1, b2, b3, b4] = ordenados; //Armazenas os blocos selecionados em 4 variáveis 
  //Converte os valores numéricos em numeros e armazena o operador 
  const n1 = Number(b1.valor);
  const op = b2.valor;
  const n2 = Number(b3.valor);
  const resultado = Number(b4.valor);

  let calc = null; // Variável que vai armazenar o resultado da conta
  if (op === '+') calc = n1 + n2;
  else if (op === '-') calc = n1 - n2;
  else if (op === '×') calc = n1 * n2;
  else if (op === '÷') calc = n2 !== 0 ? n1 / n2 : NaN;

  const correta = calc === resultado; //Verifica se o resultado é o esperado

  const line = new createjs.Shape(); //Cria a linha que vai ligar os blocos
  const corLinha = correta ? coresLinhas[corIndex % coresLinhas.length] : "red"; // Se for correta, uma das cores do arry coresLinhas, se não é vermelho
  corIndex++;

  const offset = corIndex * 2; //Deslocamento verticall da linha para não ficar uma sobre a outra

  //Desenha a linha pasando pelo o caminho certo
  line.graphics.setStrokeStyle(4).beginStroke(corLinha)
    .moveTo(b1.x + 30, b1.y + 25 + offset)
    .lineTo(b2.x + 30, b2.y + 25 + offset)
    .lineTo(b3.x + 30, b3.y + 25 + offset)
    .lineTo(b4.x + 30, b4.y + 25 + offset);

  stage.addChildAt(line, 0); //Adiciona a linha atrás de todos os outros elementos 

  if (!correta) {
    linhasErradas.push(line);

    // --- NOVO: perde uma vida ao errar ---
    vidas--;
    atualizarVidas();

    // Verifica se acabou as vidas, exibe popup game over
    if (vidas <= 0) {
      criarPopupGameOver();
      return; // Para o fluxo para evitar continuar no jogo
    }

  } else {
    [b1, b2, b3, b4].forEach(b => b.linhasConectadas.push(line));

    // Definir tempos em segundos para os limites da pontuação
    const tempoMaxPontos = 30;   // Até 30s => pontuação máxima
    const tempoMinPontos = 120;  // A partir de 120s => pontuação mínima
    const pontuacaoMax = 200;    // Pontuação máxima total
    const pontuacaoMin = 50;     // Pontuação mínima total

    // Calcular pontos proporcionais para essa resposta baseado no tempo (supondo que 'tempo' esteja disponível)
    let pontosResposta = 0;
    if (tempo <= tempoMaxPontos) {
      pontosResposta = pontuacaoMax / totalRespostasPossiveis;
    } else if (tempo >= tempoMinPontos) {
      pontosResposta = pontuacaoMin / totalRespostasPossiveis;
    } else {
      const fator = (tempo - tempoMaxPontos) / (tempoMinPontos - tempoMaxPontos);
      pontosResposta = ((1 - fator) * pontuacaoMax + fator * pontuacaoMin) / totalRespostasPossiveis;
    }

    pontuacao += Math.floor(pontosResposta);
    respostasCorretas++;

    atualizarTextoFaltam(); // Atualiza o contador das combinações restantes

    if (respostasCorretas >= totalRespostasPossiveis) {
      criarPopupFinal();
    }
  }

  mostrarIcone(correta, b4.x + 70, b4.y);

  pontosSelecionados.forEach(b => { 
    //Limpa o visual dos blocos selecionados
    const corBloco = coresBlocosFase[faseAtual] || corOriginal; // Dentro do container, cria uma forma
    b.shape.graphics.clear().beginFill(corBloco).setStrokeStyle(3).beginStroke("#ffa500").drawRoundRect(0, 0, 90, 80, 12);
  });

  pontosSelecionados = []; 
}

  // Chama a função para desenhar as colunas e blocos
  criarColunas();

  // Atualiza o contador no início do jogo
  atualizarTextoFaltam();
  atualizarVidas();
  atualizarCorFase();
};