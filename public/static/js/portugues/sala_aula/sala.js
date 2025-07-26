window.onload = function () {
  // CANVAS
 const stage = new createjs.Stage("gameCanvas");
  createjs.Ticker.framerate = 60;
  createjs.Ticker.addEventListener("tick", stage);

  // FUNDO
  const fundo = new createjs.Bitmap("/static/img/matematica/sala.png");
  fundo.image.onload = () => {
    fundo.scaleX = stage.canvas.width / fundo.image.width;
    fundo.scaleY = stage.canvas.height / fundo.image.height;
    stage.update();
  };
  stage.addChild(fundo);

  // PERSONAGEM
  const personagem = new createjs.Bitmap("/static/img/matematica/prof.png"); // substitua pelo caminho da sua imagem
  personagem.x = 800;
  personagem.y = 200;
  personagem.cursor = "pointer";
  personagem.image.onload = () => {
    const desiredRadius = 40;
    const scale = (desiredRadius * 3.5) / personagem.image.width;
    personagem.scaleX = personagem.scaleY = scale;
    stage.update();
  };
  stage.addChild(personagem);

// DIÁLOGO DO PROFESSOR
  const nomePersonagem = "Prof. Leo";
  const imagemPersonagem = "/static/img/matematica/prof.png";
  const falas = [
    "Olá, aluno como vai?",
    "Eu sou o Professor João, um Tucano",
    "Você está pronto para começar nosso super legal DESAFIO DE PORTUGUÊS?!",
    "Vamos aprender JOGANDO!",
    "Clique no botão ao lado para começar!"
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

  //PERCORRER A LISTA DE FALAS
  function proximaFala() {
    falaIndex++;
    if (falaIndex < 4) {
      mostrarDialogo(nomePersonagem, imagemPersonagem, falas[falaIndex]);
    } else {
      mostrarDialogo(nomePersonagem, imagemPersonagem, falas[4]);
      document.getElementById("caixa-dialogo").onclick = null;
      mostrarBotaoIniciar();
    }
  }

  // CRIAR O BOTÃO
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
    window.location.href = "game3.html";
  }
};
