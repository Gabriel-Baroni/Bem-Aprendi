window.onload = function () {
  const stage = new createjs.Stage("gameCanvas");
  createjs.Ticker.framerate = 60;
  createjs.Ticker.addEventListener("tick", stage);

  // Fundo da sala
  const fundo = new createjs.Shape();
  fundo.graphics.beginFill("#a3d2ca").drawRect(0, 0, 800, 600);
  stage.addChild(fundo);

  // Personagem
  const personagem = new createjs.Shape();
  personagem.graphics.beginFill("#6a5acd").drawCircle(0, 0, 40);
  personagem.x = 400;
  personagem.y = 300;
  personagem.cursor = "pointer";
  stage.addChild(personagem);

  const nomePersonagem = "Prof. Leo";
  const imagemPersonagem = "imagens/professor.png";
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
    // Remove qualquer botão antigo
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
