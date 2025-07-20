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
    contandoTempo: true,
    faseAtual: 0,
    pontuacaoAcumulada: 0,
    pontuacao: 0,
    respostasCorretas: 0,
    totalRespostasPossiveis: 5, 
    vidas: 3,
  };

  const cores ={
    coresFase: ["#fffbcc", "#d4f1f9", "#e4ffd8", "#fce4ec", "#f0e0ff"],
    coresBlocosFase: ["#f6f622ff", "#1520e9ff", "#54da1bff", "#d51455ff", "#7816d4ff"],
    coresLinhas: ["blue", "purple", "orange", "brown", "deeppink", "green", "teal"],
    corOriginal: "#fff7db",
    corSelecionado: "#a8d8ea",
  };
  
  const icones ={
    iconeCerto: new Image(),
    iconeErrado: new Image(),
  };
  icones.iconeCerto.src = "https://img.icons8.com/emoji/48/000000/check-mark-emoji.png";
  icones.iconeErrado.src = "https://img.icons8.com/emoji/48/000000/cross-mark-emoji.png";

  const sons = {
    acerto: "../static/sound/digital-beeping.mp3",
    erro: "../static/sound/error_008.ogg"
  };
  createjs.Sound.registerSound(sons.acerto, "acerto");
  createjs.Sound.registerSound(sons.erro, "erro");
  

  // ----- STAGE -----
  const stage = new createjs.Stage("gameCanvas");
  createjs.Ticker.framerate = 60;
  createjs.Ticker.addEventListener("tick", stage);
  const escala = Math.min(stage.scaleX, stage.scaleY);
  const fontSize_num = 40 * escala;
  const fontSize_text = 15 * escala;

  function getX(i) {
    return colXBase[i];
  }
  function getY(j) {
    return yBaseStart + j * yBaseStep;
  }

  window.addEventListener('resize', resizeCanvasStage);
  window.addEventListener('DOMContentLoaded', resizeCanvasStage);

  // ----- TEXTO TEMPO --------
  const textoTimer = new createjs.Text("Tempo: 0s", `${fontSize_text}px 'Press Start 2P'`,"#000");
  textoTimer.x = 10;
  textoTimer.y = 10;
  stage.addChild(textoTimer);

  // ----- COMBINAÇÕES RESTANTES ------
  const textoFaltam = new createjs.Text(`Faltam: 0`,  `${fontSize_text}px 'Press Start 2P'`,"#000");
  textoFaltam.x = 550;
  textoFaltam.y = 10;
  stage.addChild(textoFaltam);
  
  setInterval(() => {
    if(estadoJogo.contandoTempo){
       estadoJogo.tempo++;
      textoTimer.text = "Tempo: " + estadoJogo.tempo + "s";
    }
  }, 1000);


  // ----- FUNÇÕES ------
function dialogoInstrucoes(callbackFimDialogo) {
  document.getElementById("overlay-dialogo").style.display = "block";
  estadoJogo.contandoTempo = false;
  const nomePersonagem = "Prof. Leo";
  const imagemPersonagem = "/static/img/matematica/prof.png";
  const falas = [
    "Seja bem-vindo ao Desafio dos sinais!",
    "Nesse desafio você pode ver 4 colunas: primeiro número, sinal, segundo número e resultado.",
    "Clique em um de cada coluna para formar uma conta!.",
    "Exemplo: 3 + 4 = 7.",
    "Se estiver certo, você ganha pontos. Se errar, perde uma vida!",
    "Acerte todas as contas da fase para avançar.",
    "Ahh, e não se esqueça! QUANTO MAIS RÁPIDO MELHOR!",
    "Boa sorte! E que a matemática esteja com você!"
  ];

  let falaIndex = 0;
  mostrarDialogo(nomePersonagem, imagemPersonagem, falas[falaIndex], () => {
    document.getElementById("caixa-dialogo").onclick = () => {
      if (!textoEmDigitacao) {
        falaIndex++;
        if (falaIndex < falas.length) {
          mostrarDialogo(nomePersonagem, imagemPersonagem, falas[falaIndex]);
        } else {
          document.getElementById("caixa-dialogo").onclick = null;
          document.getElementById("caixa-dialogo").style.display = "none";
          document.getElementById("overlay-dialogo").style.display = "none";
          estadoJogo.contandoTempo = true;
          if (typeof callbackFimDialogo === "function") {
            callbackFimDialogo(); // Chama o callback para iniciar o jogo
          }
        }
      }
    };
  });
}

  function reposicionarBlocos() {
      estadoJogo.blocos.forEach((bloco) => {
      const tipo = bloco.tipo;
      const colunas = fases[estadoJogo.faseAtual][tipo];
      const j = colunas.indexOf(bloco.valor);
      if (j !== -1) {
        bloco.x = getX(tipo);
        bloco.y = getY(j);
      }
    });
    stage.update();
  }
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
  function atualizarTextoFaltam() {
    textoFaltam.text = `Faltam: ${estadoJogo.totalRespostasPossiveis - estadoJogo.respostasCorretas} contas para fazer!`;
  }

  function atualizarCorFase() {
    const cor = cores.coresFase[estadoJogo.faseAtual] || "#ffffff";
    document.body.style.backgroundColor = cor;
    const canvas = document.getElementById("gameCanvas");
    canvas.style.backgroundColor = cor;
  }

  function atualizarVidas() {
    const vidasDiv = document.getElementById("vidas");
    vidasDiv.textContent = "❤️".repeat(estadoJogo.vidas);
  }

  function criarBloco(texto, x, y, tipo) {
    const cont = new createjs.Container();
    const shape = new createjs.Shape();
    const corBloco = cores.coresBlocosFase[estadoJogo.faseAtual] || cores.corOriginal;
    shape.graphics.beginFill(corBloco).setStrokeStyle(3).beginStroke("#080808ff").drawRoundRect(0, 0, 150, 80, 12);
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
    estadoJogo.blocos.push(cont);
    return cont;
  }

  function criarColunas() {
    estadoJogo.blocos = [];
    const colunas = fases[estadoJogo.faseAtual];
    for (let i = 0; i < colunas.length; i++) {
      for (let j = 0; j < colunas[i].length; j++) {
        const bloco = criarBloco(colunas[i][j], getX(i), getY(j), i);
        estadoJogo.blocos.push(bloco);
        stage.addChild(bloco);
      }
    }
  }

  function pegarBlocoEm(x, y) {
    return estadoJogo.blocos.find(b => {
      const bx = b.x, by = b.y;
      return (
        x >= bx && x <= bx + 150 &&
        y >= by && y <= by + 80
      );
    });
  }

  window.resetLinha = function () {
    for (let l of estadoJogo.linhasErradas) {
      stage.removeChild(l);
    }
    estadoJogo.blocos.forEach(b => {
      const corBloco = cores.coresBlocosFase[estadoJogo.faseAtual] || cores.corOriginal;
      b.shape.graphics.beginFill(corBloco).setStrokeStyle(3).beginStroke("#070707ff").drawRoundRect(0, 0, 150, 80, 12);
    });
    estadoJogo.linhasErradas = [];
    estadoJogo.pontosSelecionados = [];
    stage.update();
  }

  function resetJogo() {
    estadoJogo.pontuacao = 0;
    estadoJogo.respostasCorretas = 0;
    estadoJogo.corIndex = 0;
    estadoJogo.vidas = 3;
    estadoJogo.tempo = 0;
    estadoJogo.linhasErradas.forEach(l => stage.removeChild(l));
    estadoJogo.linhasErradas = [];
    estadoJogo.blocos.forEach(b => {
      b.linhasConectadas.forEach(linha => {
        stage.removeChild(linha);
      });
      b.linhasConectadas = [];
      const corBloco = cores.coresBlocosFase[estadoJogo.faseAtual] || cores.corOriginal;
      b.shape.graphics.clear().beginFill(corBloco).setStrokeStyle(3).beginStroke("#0a0a0aff").drawRoundRect(0, 0, 150, 80, 12);
    });
    estadoJogo.pontosSelecionados = [];
    estadoJogo.blocos.forEach(b => stage.removeChild(b));
    criarColunas();
    atualizarTextoFaltam();
    atualizarVidas();
    atualizarCorFase();
    stage.update();
  }

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


  function criarPopupFIM() { // ÚLTIMO POP-UP 
    const popup = document.getElementById("popupFim");
    popup.classList.add("mostrar");
    const pontuacao = document.getElementById("pontuacaoAcumulada");
    pontuacao.textContent = estadoJogo.pontuacaoAcumulada;
    document.getElementById("btnFIM").onclick = () => {
      window.location.href = "/index.html";
    };
  }


  function criarPopupFinal() { // POP-UP DO FINAL DE CADA FASE
    estadoJogo.pontuacaoAcumulada += estadoJogo.pontuacao;
    const popup = document.getElementById("popupFimFase");
    const pontuacaoSpan = document.getElementById("pontuacaoFinal");
    pontuacaoSpan.textContent = estadoJogo.pontuacao;
    popup.classList.add("mostrar");
    const btnProximo = document.getElementById("btnProximo");
    const btnJogarDeNovo = document.getElementById("btnJogarDeNovo");
    if (estadoJogo.faseAtual < fases.length - 1) {
      btnProximo.textContent = "Próxima Fase";
      btnProximo.style.display = "inline-block";
      btnProximo.onclick = () => {
        estadoJogo.faseAtual++;
        popup.classList.remove("mostrar");
        resetJogo();
      };
    } else {
      btnProximo.textContent = "Finalizar";
      btnProximo.style.display = "inline-block";
      btnProximo.onclick = () => {
        popup.classList.remove("mostrar");
        enviarPontuacaoParaServidor(estadoJogo.pontuacaoAcumulada, "matematica");
        criarPopupFIM()
      };
    }
    btnJogarDeNovo.onclick = () => {
      popup.classList.remove("mostrar");
      resetJogo();
    };
  }

  function criarPopupGameOver() {
    const popup = document.getElementById("popupGameOver");
    popup.classList.add("mostrar");
    document.getElementById("btnGameOverJogarDeNovo").onclick = () => {
      popup.classList.remove("mostrar"); 
      resetJogo(); 
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
    if (estadoJogo.pontosSelecionados.includes(bloco)) return;
    const blocoMesmoTipo = estadoJogo.pontosSelecionados.find(b => b.tipo === bloco.tipo);
    if (blocoMesmoTipo) {
      const corBloco = cores.coresBlocosFase[estadoJogo.faseAtual] || cores.corOriginal;
      blocoMesmoTipo.shape.graphics.clear().beginFill(corBloco).setStrokeStyle(3).beginStroke("#0b0b0bff").drawRoundRect(0, 0, 150, 80, 12);
      estadoJogo.pontosSelecionados = estadoJogo.pontosSelecionados.filter(b => b !== blocoMesmoTipo);
    }
    estadoJogo.pontosSelecionados.push(bloco);
    bloco.shape.graphics.clear().beginFill(cores.corSelecionado).setStrokeStyle(3).beginStroke("#ffffffff").drawRoundRect(0, 0, 150, 80, 12);
    if (estadoJogo.pontosSelecionados.length === 4) {
      verificarResposta();
    }
  });

  function mostrarIcone(resultado, x, y) {
    const bitmap = new createjs.Bitmap(resultado ? icones.iconeCerto : icones.iconeErrado);
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
      const bloco = estadoJogo.pontosSelecionados.find(b => b.tipo === i);
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
    const corLinha = correta ? cores.coresLinhas[estadoJogo.corIndex % cores.coresLinhas.length] : "red";
    estadoJogo.corIndex++;
    const offset = estadoJogo.corIndex * 2;
    line.graphics.setStrokeStyle(4).beginStroke(corLinha)
      .moveTo(b1.x + 30, b1.y + 25 + offset)
      .lineTo(b2.x + 30, b2.y + 25 + offset)
      .lineTo(b3.x + 30, b3.y + 25 + offset)
      .lineTo(b4.x + 30, b4.y + 25 + offset);
    stage.addChildAt(line, 0);

    if (!correta) {
      estadoJogo.linhasErradas.push(line);
      estadoJogo.vidas--;
      atualizarVidas();
      if (estadoJogo.vidas <= 0) {
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
      if (estadoJogo.tempo <= tempoMaxPontos) {
        pontosResposta = pontuacaoMax / estadoJogo.totalRespostasPossiveis;
      } else if (estadoJogo.tempo >= tempoMinPontos) {
        pontosResposta = pontuacaoMin / estadoJogo.totalRespostasPossiveis;
      } else {
        const fator = (estadoJogo.tempo - tempoMaxPontos) / (tempoMinPontos - tempoMaxPontos);
        pontosResposta = ((1 - fator) * pontuacaoMax + fator * pontuacaoMin) / estadoJogo.totalRespostasPossiveis;
      }
      estadoJogo.pontuacao += Math.floor(pontosResposta);
      estadoJogo.respostasCorretas++;
      atualizarTextoFaltam();
      if (estadoJogo.respostasCorretas >= estadoJogo.totalRespostasPossiveis) {
        criarPopupFinal();
      }
    }
    mostrarIcone(correta, b4.x + 70, b4.y);
    estadoJogo.pontosSelecionados.forEach(b => {
      const corBloco = cores.coresBlocosFase[estadoJogo.faseAtual] || cores.corOriginal;
      b.shape.graphics.clear().beginFill(corBloco).setStrokeStyle(3).beginStroke("#060606ff").drawRoundRect(0, 0, 150, 80, 12);
    });
    estadoJogo.pontosSelecionados = [];
  }

  // ------ INICIANDO O JOGO --------
  requestAnimationFrame(() => {
    criarColunas();
    atualizarTextoFaltam();
    atualizarVidas();
    atualizarCorFase();
    resizeCanvasStage();
});

 requestAnimationFrame(() => {
  dialogoInstrucoes(() => {
    criarColunas();
    atualizarTextoFaltam();
    atualizarVidas();
    atualizarCorFase();
    resizeCanvasStage();
  });
 });

};