window.onload = function () {
  const imagensFase = [
    { imagem: "../static/img/portugues/Vasspritesheet.png", larguraFrame: 193, alturaFrame: 112, count: 6, escala: 1, silabas: ["vas", "sou", "ra"] },
    { imagem: "../static/img/portugues/Carspritesheet.png", larguraFrame: 480, alturaFrame: 488, count: 6, escala: 0.5, silabas: ["car", "ro"] },
    { imagem: "../static/img/portugues/Busspritesheet.png", larguraFrame: 91, alturaFrame: 91, count: 6, escala: 1, silabas: ["bús", "so", "la"] },
    {imagem: "../static/img/portugues/Dogspritesheet.png", larguraFrame: 144, alturaFrame: 144, count: 12, escala: 1, silabas: ["ca", "chor", "ro"] },
    { imagem: "../static/img/portugues/Dinospritesheet.png", larguraFrame: 166, alturaFrame: 166, count: 8, escala: 1, silabas: ["di", "nos", "sa", "u", "ro"] }
  ];

  const cores = ["#58cae9ff", "#6ae870ff", "#dc5d44ff", "#d953acff", "#ee2f1eff"];

  const estadoJogo = {
    faseAtual: 0,
    vidas: 3,
    tempo: 0,
    contandoTempo: true,
    letras: [],
    silabasCaixas: [],
    letrasUsadas: [],
    pontuacaoAcumulada: 0,
    pontuacao: 0,
    cor:0,
  };

  const sons = {
    erro: "../static/sound/error_008.ogg"
  };
  createjs.Sound.registerSound(sons.erro, "erro");

  const stage = new createjs.Stage("gameCanvas");
  createjs.Ticker.framerate = 60;
  createjs.Ticker.addEventListener("tick", stage);

  const textoTimer = new createjs.Text("Tempo: 0s", "15px 'Press Start 2P'", "#000");
  textoTimer.x = 10;
  textoTimer.y = 10;
  stage.addChild(textoTimer);

  setInterval(() => {
    if (estadoJogo.contandoTempo) {
      estadoJogo.tempo++;
      textoTimer.text = "Tempo: " + estadoJogo.tempo + "s";
    }
  }, 1000);

  const textoOque = new createjs.Text("O que é isso ?", "15px 'Press Start 2P'", "#000");
  textoOque.x = 400;
  textoOque.y = 20;
  stage.addChild(textoOque);
  
function dialogoInstrucoes(callbackFimDialogo) {
  document.getElementById("overlay-dialogo").style.display = "block";
  estadoJogo.contandoTempo = false;
  const nomePersonagem = "Prof. João";
  const imagemPersonagem = "/static/img/portugues/prof.png";
  const falas = [
    "Seja bem-vindo ao Desafio das Sílabas!",
    "Boa sorte!"
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
  function atualizarVidas() {
    document.getElementById("vidas").textContent = "❤️".repeat(estadoJogo.vidas);
  }

function criarImagemFase() {
  const fase = imagensFase[estadoJogo.faseAtual];
  const spriteSheet = new createjs.SpriteSheet({
    images: [fase.imagem],
    frames: { width: fase.larguraFrame, height: fase.alturaFrame, count: fase.count },
    animations: {
      rodar: [0, fase.count - 1, "rodar", 0.15]
    }
  });
  const gifAnimado = new createjs.Sprite(spriteSheet, "rodar");
  gifAnimado.x = 500;
  gifAnimado.y = 150;
  gifAnimado.regX = fase.larguraFrame / 2;
  gifAnimado.regY = fase.alturaFrame / 2;
  gifAnimado.scaleX = gifAnimado.scaleY = imagensFase[estadoJogo.faseAtual].escala;
  stage.addChild(gifAnimado);
  estadoJogo.imagemFaseAtual = gifAnimado;
}
  
 
function embaralhar(letras) {
    for (let i = letras.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letras[i], letras[j]] = [letras[j], letras[i]];
    }
    return letras;
  }

 function criarLetras() {
  const silabas = imagensFase[estadoJogo.faseAtual].silabas;
  const letrasSeparadas = silabas.join("").split("");
  const letras = embaralhar(letrasSeparadas);

  const blocoLargura = 50;
  const espacamento = 10; // espaçamento entre letras
  const totalLargura = letras.length * blocoLargura + (letras.length - 1) * espacamento;
  const canvasWidth = stage.canvas.width;

  // Posição inicial centralizada
  let posX = (canvasWidth - totalLargura) / 2;

  letras.forEach((letra, i) => {
    const bloco = new createjs.Shape();
    bloco.graphics.beginFill(cores[estadoJogo.cor]).drawRoundRect(0, 0, blocoLargura, 50, 8);

    const txt = new createjs.Text(letra.toUpperCase(), "24px 'Press Start 2P'", "#000");
    txt.textAlign = "center";
    txt.textBaseline = "middle";
    txt.x = blocoLargura / 2;
    txt.y = 25;

    const container = new createjs.Container();
    container.x = posX + i * (blocoLargura + espacamento);
    container.y = 400;
    container.letra = letra;
    container.addChild(bloco, txt);

    container.originalX = container.x;
    container.originalY = container.y;

    enableDrag(container);
    stage.addChild(container);
    estadoJogo.letras.push(container);
  });
}

function enableDrag(item) {
  item.on("mousedown", function (evt) {
    // Ao iniciar o arrasto, remova a letra da caixa onde ela estiver
    estadoJogo.silabasCaixas.forEach(caixa => {
      const idx = caixa.letras.findIndex(letra => letra === this.getChildAt(1));
      if (idx !== -1) {
        caixa.letras[idx] = null;  // Libera o espaço na posição correta
      }
    });

    this.offset = { x: evt.stageX - this.x, y: evt.stageY - this.y };
  });

  item.on("pressmove", function (evt) {
    this.x = evt.stageX - this.offset.x;
    this.y = evt.stageY - this.offset.y;
    stage.update();
  });

item.on("pressup", function (evt) {
  const alvo = estadoJogo.silabasCaixas.find(caixa =>
    evt.stageX > caixa.x && evt.stageX < caixa.x + caixa.largura &&
    evt.stageY > caixa.y && evt.stageY < caixa.y + 60 &&
    caixa.letras.filter(l => l !== null).length < caixa.maxLetras
  );

  if (alvo) {
    const letraShape = this.getChildAt(1);
    const posicaoLivre = alvo.letras.findIndex(l => l === null);
    let indicePosicao = posicaoLivre;

    if (posicaoLivre !== -1) {
      alvo.letras[posicaoLivre] = letraShape;
    } else {
      alvo.letras.push(letraShape);
      indicePosicao = alvo.letras.length - 1;
    }

    this.x = alvo.x + 10 + indicePosicao * 55;
    this.y = alvo.y + 10;
  } else {
    this.x = this.originalX;
    this.y = this.originalY;
  }
});
}

function criarCaixasSilabas() {
  const silabas = imagensFase[estadoJogo.faseAtual].silabas;
  const espacamento = 30;
  const canvasWidth = stage.canvas.width;

  // Calcula a largura de cada caixa e guarda numa array
  const largurasCaixas = silabas.map(silaba => silaba.length * 55 + 20);

  // Soma todas as larguras das caixas e os espaços entre elas
  const larguraTotal = largurasCaixas.reduce((acc, val) => acc + val, 0) + espacamento * (silabas.length - 1);

  // Define posX inicial para centralizar o conjunto
  let posX = (canvasWidth - larguraTotal) / 2;

  estadoJogo.silabasCaixas = [];

  silabas.forEach((silaba, i) => {
    const larguraCaixa = largurasCaixas[i];
    const caixa = new createjs.Shape();
    caixa.graphics.setStrokeStyle(2).beginStroke("#000").drawRoundRect(0, 0, larguraCaixa, 60, 20);
    caixa.x = posX;
    caixa.y = 300;
    stage.addChild(caixa);

    estadoJogo.silabasCaixas.push({
      x: caixa.x,
      y: caixa.y,
      largura: larguraCaixa,
      maxLetras: silaba.length,
      letras: [],
      shape: caixa
    });

    posX += larguraCaixa + espacamento;
  });
}


function verificarResposta() {
  if (estadoJogo.faseAtual >= imagensFase.length) return;

  const silabasCorretas = imagensFase[estadoJogo.faseAtual].silabas;
  const silabasJogador = [];

  for (const caixa of estadoJogo.silabasCaixas) {
    // Verifica se a caixa está vazia
    if (!caixa.letras || caixa.letras.length === 0) {
      criarPopupAlerta();
      return;
    }

    // Verifica se há letras inválidas (vazias ou sem texto)
    if (caixa.letras.some(l => !l || !l.text || l.text.trim() === "")) {
      criarPopupAlerta();
      return;
    }
    const silabaFormada = caixa.letras.map(l => l.text.toLowerCase()).join("");
    silabasJogador.push(silabaFormada);
  }

  const acerto = silabasJogador.every((silaba, i) => silaba === silabasCorretas[i]);

  if (acerto) {
    calcularPontuacaoSilabas();
    estadoJogo.cor++;
    criarPopupFinal();
  } else {
    estadoJogo.vidas--;
    atualizarVidas();
    if (estadoJogo.vidas <= 0) {
      criarPopupGameOver();
    } else {
      createjs.Sound.play("erro");
          stage.removeAllChildren();
      estadoJogo.letras = [];
      estadoJogo.silabasCaixas = [];
      estadoJogo.letrasUsadas = [];
      criarImagemFase();
      criarCaixasSilabas();
      criarLetras();
      stage.addChild(textoTimer);
      atualizarVidas();
      caixaObj = {
        x: caixa.x,
        y: caixa.y,
        largura: larguraCaixa,
        maxLetras: silaba.length,
        letras: Array(silaba.length).fill(null),  // <-- importante!
        shape: caixa
      };
    }
  }
}

  function calcularPontuacaoSilabas() {
    const tempoMaxPontos = 30;
    const tempoMinPontos = 120;
    const pontuacaoMax = 200;
    const pontuacaoMin = 50;
    let pontosPalavra = 0;

    if (estadoJogo.tempo <= tempoMaxPontos) {
      pontosPalavra = pontuacaoMax;
    } else if (estadoJogo.tempo >= tempoMinPontos) {
      pontosPalavra = pontuacaoMin;
    } else {
      const fator = (estadoJogo.tempo - tempoMaxPontos) / (tempoMinPontos - tempoMaxPontos);
      pontosPalavra = (1 - fator) * pontuacaoMax + fator * pontuacaoMin;
    }

    estadoJogo.pontuacao += Math.floor(pontosPalavra);
  }

  function resetarFase() {
    stage.removeAllChildren();
    estadoJogo.letras = [];
    estadoJogo.silabasCaixas = [];
    estadoJogo.letrasUsadas = [];
    criarImagemFase();
    criarCaixasSilabas();
    criarLetras();
    stage.addChild(textoTimer);
    stage.addChild(textoOque);
    atualizarVidas();
    estadoJogo.pontuacao = 0;
    estadoJogo.tempo = 0;
    caixaObj = {
      x: caixa.x,
      y: caixa.y,
      largura: larguraCaixa,
      maxLetras: silaba.length,
      letras: Array(silaba.length).fill(null),  // <-- importante!
      shape: caixa
    };
  }
// ------------ FUNÇÕES DE POPUP --------------
  function criarPopupFinal() {
    estadoJogo.pontuacaoAcumulada += estadoJogo.pontuacao;
    const popup = document.getElementById("popupFimFase");
    const pontuacaoSpan = document.getElementById("pontuacaoFinal");
    pontuacaoSpan.textContent = estadoJogo.pontuacao;
    popup.classList.add("mostrar");

    const btnProximo = document.getElementById("btnProximo");
    const btnJogarDeNovo = document.getElementById("btnJogarDeNovo");

    if (estadoJogo.faseAtual < imagensFase.length - 1) {
      btnProximo.textContent = "Próxima Fase";
      btnProximo.style.display = "inline-block";
      btnProximo.onclick = () => {
        estadoJogo.faseAtual++;
        popup.classList.remove("mostrar");
        resetarFase();
      };
    } else {
      btnProximo.textContent = "Finalizar";
      btnProximo.style.display = "inline-block";
      btnProximo.onclick = () => {
        popup.classList.remove("mostrar");
        enviarPontuacaoParaServidor(estadoJogo.pontuacaoAcumulada, "português");
        criarPopupFIM();
      };
    }

    btnJogarDeNovo.onclick = () => {
      popup.classList.remove("mostrar");
      resetarFase();
    };
  }

  function criarPopupGameOver() {
    document.getElementById("popupGameOver").classList.add("mostrar");
    document.getElementById("btnGameOverJogarDeNovo").onclick = () => {
      document.getElementById("popupGameOver").classList.remove("mostrar");
      estadoJogo.faseAtual = 0;
      estadoJogo.vidas = 3;
      estadoJogo.pontuacaoAcumulada = 0;
      resetarFase();
    };
  }

  function criarPopupAlerta() {
    const popup = document.getElementById("popupAlerta");
    popup.classList.add("mostrar");
    setTimeout(() => {
      popup.classList.remove("mostrar");
    }, 2000);
}

  function criarPopupFIM() {
    const popup = document.getElementById("popupFim");
    popup.classList.add("mostrar");
    document.getElementById("pontuacaoAcumulada").textContent = estadoJogo.pontuacaoAcumulada;
    document.getElementById("btnFIM").onclick = () => {
      window.location.href = "/index.html";
    };
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

  document.getElementById("btnVerificar").onclick = verificarResposta;
requestAnimationFrame(() => {
   resetarFase();
    resizeCanvasStage();
  });

  requestAnimationFrame(() => {
    dialogoInstrucoes(() => {
      resetarFase();
      resizeCanvasStage();
    });
  });
};