window.onload = function () {
 const stage = new createjs.Stage("gameCanvas");
  createjs.Ticker.framerate = 60;
  createjs.Ticker.addEventListener("tick", stage);

  // Fundo com imagem ajustada ao canvas
  const fundo = new createjs.Bitmap("/static/img/matematica/sala.png");
  fundo.image.onload = () => {
    fundo.scaleX = stage.canvas.width / fundo.image.width;
    fundo.scaleY = stage.canvas.height / fundo.image.height;
    stage.update();
  };
  stage.addChild(fundo);

  // Personagem
  const personagem = new createjs.Bitmap("/static/img/matematica/prof.png"); // substitua pelo caminho da sua imagem
  personagem.x = 400;
  personagem.y = 90;
  personagem.cursor = "pointer";
  
  // Ajuste a escala da imagem para um tamanho aproximado da bola (opcional)
  personagem.image.onload = () => {
    const desiredRadius = 40;
    // Assume que a imagem é quadrada ou usar largura
    const scale = (desiredRadius * 3.5) / personagem.image.width;
    personagem.scaleX = personagem.scaleY = scale;
    stage.update();
  };

  stage.addChild(personagem);


  const nomePersonagem = "Prof. Leo";
  const imagemPersonagem = "/static/img/matematica/prof.png";
  const falas = [
    "Olá, aluno!",
    "Você está pronto para começar o desafio de hoje?",
    "Vamos aprender brincando. Clique no botão ao lado para começar!"
  ];

  let falaIndex = 0;

  personagem.on("click", () => {
    falaIndex = 0;
    mostrarDialogo(nomePersonagem, imagemPersonagem, falas[falaIndex], () => {
      document.getElementById("caixa-dialogo").onclick = () => {
        if (!textoEmDigitacao) {
          proximaFala();
        }
      };
    });
  });

  function proximaFala() {
    falaIndex++;
    if (falaIndex < falas.length) {
      mostrarDialogo(nomePersonagem, imagemPersonagem, falas[falaIndex]);
    } else {
      mostrarDialogo(nomePersonagem, imagemPersonagem, falas[falaIndex - 1]);
      document.getElementById("caixa-dialogo").onclick = null;
      mostrarBotaoIniciar();
    }
  }

  function mostrarBotaoIniciar() {
    const antigo = document.querySelector(".botao-iniciar");
    if (antigo) antigo.remove();

    const botao = document.createElement("button");
    botao.textContent = "Iniciar Minigame";
    botao.className = "botao-iniciar";
    botao.onclick = iniciarMinigame;
    document.getElementById("caixa-dialogo").appendChild(botao);
  }

  function iniciarMinigame() {
    window.location.href = "game1.html";
  }
};
