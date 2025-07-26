// Espera carregar a página
window.onload = function () {

  const imagensFase = [
    { imagem: "../static/img/portugues/vassoura.png", palavra: "vassoura", silabas: ["vas", "sou", "ra"] },
    { imagem: "../static/img/portugues/cavalo.png", palavra: "cavalo", silabas: ["ca", "va", "lo"] },
    { imagem: "../static/img/portugues/pirulito.png", palavra: "pirulito", silabas: ["pi", "ru", "li", "to"] },
    // ... até 5 fases
  ];

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
  };

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

  function atualizarVidas() {
    document.getElementById("vidas").textContent = "❤️".repeat(estadoJogo.vidas);
  }

  function criarImagemFase() {
    const img = new createjs.Bitmap(imagensFase[estadoJogo.faseAtual].imagem);
    img.x = 450;
    img.y = 30;
    img.scaleX = img.scaleY = 0.5;
    stage.addChild(img);
  }

  function embaralhar(letras) {
    for (let i = letras.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letras[i], letras[j]] = [letras[j], letras[i]];
    }
    return letras;
  }

  // LETRAS EM BLOCOS
  function criarLetras() {
    const silabas = imagensFase[estadoJogo.faseAtual].silabas;
    const letrasSeparadas = silabas.join("").split("");
    const letras = embaralhar(letrasSeparadas);

    letras.forEach((letra, i) => {
      // Criar retângulo arredondado para o bloco da letra
      const bloco = new createjs.Shape();
      bloco.graphics.beginFill("#88c0d0").drawRoundRect(0, 0, 50, 50, 8);

      // Criar texto da letra, centralizado no bloco
      const txt = new createjs.Text(letra.toUpperCase(), "24px 'Press Start 2P'", "#000");
      txt.textAlign = "center";
      txt.textBaseline = "middle";
      txt.x = 25; // centro horizontal do bloco (largura/2)
      txt.y = 25; // centro vertical do bloco (altura/2)

      // Container para agrupar bloco + texto
      const container = new createjs.Container();
      container.x = 300 + i * 60;
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
      // Remove a letra da caixa onde ela estava (se estava)
      estadoJogo.silabasCaixas.forEach(caixa => {
        const index = caixa.letras.indexOf(this.letra);
        if (index !== -1) {
          caixa.letras.splice(index, 1);
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
        caixa.letras.length < caixa.maxLetras
      );
      if (alvo) {
        alvo.letras.push(this.letra);
        this.x = alvo.x + 10 + (alvo.letras.length - 1) * 55; // espaçamento maior para não sobrepor
        this.y = alvo.y + 10;
        estadoJogo.letrasUsadas.push(this);
      } else {
        this.x = this.originalX;
        this.y = this.originalY;
      }
    });
  }

function criarCaixasSilabas() {
  const silabas = imagensFase[estadoJogo.faseAtual].silabas;
  let posX = 100; // posição inicial X

  silabas.forEach((silaba, i) => {
    const larguraCaixa = silaba.length * 60 + 20; // largura proporcional à sílaba

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

    // Atualiza posX para próxima caixa, somando largura + espaço extra
    posX += larguraCaixa + 20;
  });
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

    if (!estadoJogo.pontuacao) estadoJogo.pontuacao = 0;
    estadoJogo.pontuacao += Math.floor(pontosPalavra);
  }

  function verificarResposta() {
    const silabasCorretas = imagensFase[estadoJogo.faseAtual].silabas;
    const silabasJogador = estadoJogo.silabasCaixas.map(caixa => caixa.letras.join(""));

    const acerto = JSON.stringify(silabasJogador) === JSON.stringify(silabasCorretas);

    if (acerto) {
      calcularPontuacaoSilabas();
      criarPopupFinal();
    } else {
      estadoJogo.vidas--;
      atualizarVidas();
      if (estadoJogo.vidas <= 0) {
        criarPopupGameOver();
      } else {
        alert("Ops! Separe as sílabas corretamente!");
      }
    }
  }

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

  function resetarFase() {
    stage.removeAllChildren();
    estadoJogo.letras = [];
    estadoJogo.silabasCaixas = [];
    estadoJogo.letrasUsadas = [];
    criarImagemFase();
    criarCaixasSilabas();
    criarLetras();
    stage.addChild(textoTimer);
    atualizarVidas();
    estadoJogo.pontuacao = 0;
    estadoJogo.tempo = 0;
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

  // Inicia o jogo
  resetarFase();
};




