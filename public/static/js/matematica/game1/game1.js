// Aguarda o carregamento da página
window.onload = function () {

  // COORDENADAS DE X CADA COLUNA E Y DE CADA LINHA
  const colXBase = [120, 320, 520, 720];
  const yBaseStart = 50;
  const yBaseStep = 100;

  // --------- ARRAY DE CADA COLUNA ------------
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

  // ------ VARIÁVEIS GLOBAIS ------
  const estadoJogo = {
    blocos: [],
    pontosSelecionados: [],
    linhasErradas: [],
    corIndex: 0,
    tempo: 0,
    faseAtual: 0,
    pontuacaoAcumulada: 0,
    pontuacao: 0,
    respostasCorretas: 0,
    totalRespostasPossiveis: 0, 
    vidas: 3,
  };

  const cores ={
    coresFase: ["#fffbcc", "#d4f1f9", "#e4ffd8", "#fce4ec", "#f0e0ff"],
    coresBlocosFase: ["#fff7db", "#d4f1f9", "#e4ffd8", "#fce4ec", "#f0e0ff"],
    coresLinhas: ["blue", "purple", "orange", "brown", "deeppink", "green", "teal"],
    corOriginal: "#fff7db",
    corSelecionado: "#a8d8ea",

  };
  
  const icones ={
    iconeCerto: new Image(),
    iconeErrado: new Image(),
  };
  const iconeCerto = new Image();
  iconeCerto.src = "https://img.icons8.com/emoji/48/000000/check-mark-emoji.png";
  const iconeErrado = new Image();
  iconeErrado.src = "https://img.icons8.com/emoji/48/000000/cross-mark-emoji.png";

  const sons = {
    acerto: "../static/sound/digital-beeping.mp3",
    erro: "../static/sound/error_008.ogg"
  };
  createjs.Sound.registerSound(sons.acerto, "acerto");
  createjs.Sound.registerSound(sons.erro, "erro");
  

  // Cria o stage ANTES de qualquer função que use ele!
  const stage = new createjs.Stage("gameCanvas");
  createjs.Ticker.framerate = 60;
  createjs.Ticker.addEventListener("tick", stage);
  const escala = Math.min(stage.scaleX, stage.scaleY);
  const fontSize_num = 40 * escala;
  const fontSize_text = 15 * escala;

  // Função para calcular X proporcional
  function getX(i) {
    return colXBase[i];
  }
  function getY(j) {
    return yBaseStart + j * yBaseStep;
  }

  // Função para reposicionar blocos ao redimensionar
  function reposicionarBlocos() {
      blocos.forEach((bloco) => {
      const tipo = bloco.tipo;
      const colunas = fases[faseAtual][tipo];
      const j = colunas.indexOf(bloco.valor);
      if (j !== -1) {
        bloco.x = getX(tipo);
        bloco.y = getY(j);
      }
    });
    stage.update();
  }

  // Função para redimensionar o canvas e escalar o stage
  function resizeCanvasStage() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    stage.scaleX = canvas.width / 1000;
    stage.scaleY = canvas.height / 500;
    reposicionarBlocos();
    stage.update();
  }

  window.addEventListener('resize', resizeCanvasStage);
  window.addEventListener('DOMContentLoaded', resizeCanvasStage);

  // Cria um texto para exibir o tempo na tela
  const textoTimer = new createjs.Text("Tempo: 0s", `${fontSize_text}px 'Press Start 2P'`,"#000");
  textoTimer.x = 10;
  textoTimer.y = 10;
  stage.addChild(textoTimer);

  // --- NOVO: texto para mostrar quantas combinações faltam ---
  const textoFaltam = new createjs.Text(`Faltam: 0`,  `${fontSize_text}px 'Press Start 2P'`,"#000");
  textoFaltam.x = 550;
  textoFaltam.y = 10;
  stage.addChild(textoFaltam);
  
  // Atualiza o tempo a cada segundo
  setInterval(() => {
    tempo++;
    textoTimer.text = "Tempo: " + tempo + "s";
  }, 1000);

  // Atualiza o texto que mostra quantas combinações faltam
  function atualizarTextoFaltam() {
    textoFaltam.text = `Faltam: ${totalRespostasPossiveis - respostasCorretas} contas para fazer!`;
  }
  function atualizarCorFase() {
    const cor = coresFase[faseAtual] || "#ffffff";
    document.body.style.backgroundColor = cor;
    const canvas = document.getElementById("gameCanvas");
    canvas.style.backgroundColor = cor;
  }
  function atualizarVidas() {
    const vidasDiv = document.getElementById("vidas");
    vidasDiv.textContent = "❤️".repeat(vidas);
  }

  // Função que cria cada bloco
  function criarBloco(texto, x, y, tipo) {
    const cont = new createjs.Container();
    const shape = new createjs.Shape();
    const corBloco = coresBlocosFase[faseAtual] || corOriginal;
    shape.graphics.beginFill(corBloco).setStrokeStyle(3).beginStroke("#ffa500").drawRoundRect(0, 0, 150, 80, 12);
    const label = new createjs.Text(texto, `${fontSize_num}px Comic Sans MS`, "#000");
    label.textAlign = "center";
    label.textBaseline = "middle";
    label.x = 75;
    label.y = 40;
    cont.addChild(shape, label);
    cont.x = x;
    cont.y = y;
    cont.valor = texto;
    cont.tipo = tipo;
    cont.shape = shape;
    cont.label = label;
    cont.linhasConectadas = [];
    blocos.push(cont);
    return cont;
  }

  // Função para criar as colunas (usando coordenadas proporcionais)
  function criarColunas() {
    blocos = [];
    const colunas = fases[faseAtual];
    for (let i = 0; i < colunas.length; i++) {
      for (let j = 0; j < colunas[i].length; j++) {
        const bloco = criarBloco(colunas[i][j], getX(i), getY(j), i);
        stage.addChild(bloco);
      }
    }
  }

  // Função para identificar qual bloco foi clicado
  function pegarBlocoEm(x, y) {
    return blocos.find(b => {
      const bx = b.x, by = b.y;
      return (
        x >= bx && x <= bx + 150 &&
        y >= by && y <= by + 80
      );
    });
  }

  // Função global que reseta todas as linhas vermelhas e blocos selecionados
  window.resetLinha = function () {
    for (let l of linhasErradas) {
      stage.removeChild(l);
    }
    blocos.forEach(b => {
      const corBloco = coresBlocosFase[faseAtual] || corOriginal;
      b.shape.graphics.beginFill(corBloco).setStrokeStyle(3).beginStroke("#ffa500").drawRoundRect(0, 0, 150, 80, 12);
    });
    linhasErradas = [];
    pontosSelecionados = [];
    stage.update();
  }

  // Função para resetar o jogo
  function resetJogo() {
    pontuacao = 0;
    respostasCorretas = 0;
    corIndex = 0;
    vidas = 3;
    tempo = 0;
    linhasErradas.forEach(l => stage.removeChild(l));
    linhasErradas = [];
    blocos.forEach(b => {
      b.linhasConectadas.forEach(linha => {
        stage.removeChild(linha);
      });
      b.linhasConectadas = [];
      const corBloco = coresBlocosFase[faseAtual] || corOriginal;
      b.shape.graphics.clear().beginFill(corBloco).setStrokeStyle(3).beginStroke("#ffa500").drawRoundRect(0, 0, 150, 80, 12);
    });
    pontosSelecionados = [];
    blocos.forEach(b => stage.removeChild(b));
    criarColunas();
    atualizarTextoFaltam();
    atualizarVidas();
    atualizarCorFase();
    stage.update();
  }

  // Função para enviar a pontuação acumulada para o endpoint pontuação.js
  function enviarPontuacaoParaServidor(pontuacao, materia) {
    const crianca_id = localStorage.getItem('crianca_id');
    if (!crianca_id) {
      console.error('Crianca não autenticada!');
      return;
    }
    fetch("/pontuacao", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        materia: materia, 
        id_crianca: crianca_id,        
        pontuacao: pontuacao
      })
    })
    .then(res => res.json())
    .then(data => console.log("Pontuação atualizada:", data))
    .catch(err => console.error("Erro ao enviar pontuação:", err));
  }

  // Função para criar o pop-up de fim de fase
  function criarPopupFinal() {
    pontuacaoAcumulada += pontuacao;
    const popup = document.getElementById("popupFimFase");
    const pontuacaoSpan = document.getElementById("pontuacaoFinal");
    pontuacaoSpan.textContent = pontuacao;
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
    popup.classList.add("mostrar");
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
    const clickX = evt.stageX / stage.scaleX;
    const clickY = evt.stageY / stage.scaleY;
    const bloco = pegarBlocoEm(clickX, clickY);
    if (!bloco) return;
    if (pontosSelecionados.includes(bloco)) return;
    const blocoMesmoTipo = pontosSelecionados.find(b => b.tipo === bloco.tipo);
    if (blocoMesmoTipo) {
      const corBloco = coresBlocosFase[faseAtual] || corOriginal;
      blocoMesmoTipo.shape.graphics.clear().beginFill(corBloco).setStrokeStyle(3).beginStroke("#ffa500").drawRoundRect(0, 0, 150, 80, 12);
      pontosSelecionados = pontosSelecionados.filter(b => b !== blocoMesmoTipo);
    }
    pontosSelecionados.push(bloco);
    bloco.shape.graphics.clear().beginFill(corSelecionado).setStrokeStyle(3).beginStroke("#ffa500").drawRoundRect(0, 0, 150, 80, 12);
    if (pontosSelecionados.length === 4) {
      verificarResposta();
    }
  });

  function mostrarIcone(resultado, x, y) {
    const bitmap = new createjs.Bitmap(resultado ? iconeCerto : iconeErrado);
    bitmap.x = x;
    bitmap.y = y;
    bitmap.scaleX = bitmap.scaleY = 0.6;
    createjs.Sound.play(resultado ? "acerto" : "erro");
    stage.addChild(bitmap);
    createjs.Tween.get(bitmap)
      .to({ alpha: 0, y: y - 20 }, 1500)
      .call(() => stage.removeChild(bitmap));
  }

  function verificarResposta() {
    const ordenados = [];
    for (let i = 0; i < 4; i++) {
      const bloco = pontosSelecionados.find(b => b.tipo === i);
      if (!bloco) return;
      ordenados.push(bloco);
    }
    const [b1, b2, b3, b4] = ordenados;
    const n1 = Number(b1.valor);
    const op = b2.valor;
    const n2 = Number(b3.valor);
    const resultado = Number(b4.valor);

    let calc = null;
    if (op === '+') calc = n1 + n2;
    else if (op === '-') calc = n1 - n2;
    else if (op === '×') calc = n1 * n2;
    else if (op === '÷') calc = n2 !== 0 ? n1 / n2 : NaN;

    const correta = calc === resultado;

    const line = new createjs.Shape();
    const corLinha = correta ? coresLinhas[corIndex % coresLinhas.length] : "red";
    corIndex++;
    const offset = corIndex * 2;
    line.graphics.setStrokeStyle(4).beginStroke(corLinha)
      .moveTo(b1.x + 30, b1.y + 25 + offset)
      .lineTo(b2.x + 30, b2.y + 25 + offset)
      .lineTo(b3.x + 30, b3.y + 25 + offset)
      .lineTo(b4.x + 30, b4.y + 25 + offset);
    stage.addChildAt(line, 0);

    if (!correta) {
      linhasErradas.push(line);
      vidas--;
      atualizarVidas();
      if (vidas <= 0) {
        criarPopupGameOver();
        return;
      }
    } else {
      [b1, b2, b3, b4].forEach(b => b.linhasConectadas.push(line));
      const tempoMaxPontos = 30;
      const tempoMinPontos = 120;
      const pontuacaoMax = 200;
      const pontuacaoMin = 50;
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
      atualizarTextoFaltam();
      if (respostasCorretas >= totalRespostasPossiveis) {
        criarPopupFinal();
      }
    }
    mostrarIcone(correta, b4.x + 70, b4.y);
    pontosSelecionados.forEach(b => {
      const corBloco = coresBlocosFase[faseAtual] || corOriginal;
      b.shape.graphics.clear().beginFill(corBloco).setStrokeStyle(3).beginStroke("#ffa500").drawRoundRect(0, 0, 150, 80, 12);
    });
    pontosSelecionados = [];
  }

  // Inicialização do jogo
  criarColunas();
  atualizarTextoFaltam();
  atualizarVidas();
  atualizarCorFase();
  resizeCanvasStage();
};