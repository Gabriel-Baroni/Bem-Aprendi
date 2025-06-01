// Cria o palco com o Createjs
const stage = new createjs.Stage("stage");

// Cria um array com as coordenadas das materias e seus nomes
const fases = [
  { x: 100, y: 300, materia: "Matemática" },
  { x: 150, y: 350, materia: "Lógica" },
  { x: 200, y: 250, materia: "Português" },
  { x: 300, y: 300, materia: "História" },
  { x: 400, y: 200, materia: "Ciências" },
  { x: 500, y: 250, materia: "Inglês" }
];

// Cria variaveis globais para o player, popup, titulo, botao e fundoClick
let player;
let popup, titulo, botao;
let fundoClick;

// Pré-Carrega a imagem do player
const loader = new createjs.LoadQueue();
loader.loadManifest([
  { id: "bg", src: "static/img/index_img/fundo_pixel.png" },
  { id: "player", src: "static/img/index_img/bem_te_vi.png" }
]);
loader.on("complete", init);

function init() {
  const bg = new createjs.Bitmap(loader.getResult("bg"));
  stage.addChild(bg);

  // Cria o FundoClick, que é um fundo invisível que detecta cliques fora do popup 
  fundoClick = new createjs.Shape();
  fundoClick.graphics.beginFill("rgba(0,0,0,0.01)").drawRect(0, 0, 800, 600);
  fundoClick.visible = false;
  fundoClick.cursor = "default";
  fundoClick.on("click", () => {
    popup.visible = false;
    fundoClick.visible = false;
    stage.update();
  });
  stage.addChild(fundoClick);

  // Cria o player e suas características
  player = new createjs.Bitmap(loader.getResult("player"));
  player.regX = player.image.width / 2;
  player.regY = player.image.height / 2;
  player.scaleX = player.scaleY = 0.1;
  player.x = fases[0].x - 50;
  player.y = fases[0].y - 50;
  stage.addChild(player);

  // Cria os círculos para cada fase e suas características
  fases.forEach((pos, i) => {
    const circle = new createjs.Shape();
    circle.graphics.beginFill("#fff").drawCircle(0, 0, 15);
    circle.x = pos.x;
    circle.y = pos.y;
    circle.cursor = "pointer";
    stage.addChild(circle);

    // Adiciona um evento de clique ao circulo
    circle.on("click", (event) => {
      event.stopPropagation();
      titulo.text = pos.materia;

      // Ajusta posição do popup para cima da fase, com tamanho menor
      popup.x = pos.x + 15;
      popup.y = pos.y - 110;
      popup.visible = true;
      fundoClick.visible = true;
      stage.update();

      botao.removeAllEventListeners("click");
      botao.on("click", () => acessarSala(pos.materia));
      movePlayerTo(i);
    });
  });

  // Cria o pop-up que aparece ao clicar em uma matéria
  popup = new createjs.Container();
  popup.visible = false;

  // Fundo menor do popup
  const fundo = new createjs.Shape();
  fundo.graphics.beginFill("#fff").drawRoundRect(0, 0, 150, 100, 10);
  fundo.shadow = new createjs.Shadow("#000", 2, 2, 5);

  // Título menor e centralizado
  titulo = new createjs.Text("", "12px 'Press Start 2P'", "#000");
  titulo.textAlign = "center";
  titulo.x = 75;  // metade da largura do fundo
  titulo.y = 10;

  // Botão menor e posicionado dentro do popup
  botao = new createjs.Shape();
  botao.graphics.beginFill("#4CAF50").drawRoundRect(0, 0, 140, 25, 5);
  botao.x = 5;
  botao.y = 50;
  botao.cursor = "pointer";

  const botaoTexto = new createjs.Text("Acessar Sala", "10px 'Press Start 2P'", "#fff");
  botaoTexto.x = 15; 
  botaoTexto.y = 56;

  popup.addChild(fundo, titulo, botao, botaoTexto);
  popup.on("click", (e) => e.stopPropagation()); // clique dentro do popup não fecha
  stage.addChild(popup);

  // Atualiza o stage a cada tick e define o framrate da tela em 60 fps
  createjs.Ticker.framerate = 60;
  createjs.Ticker.addEventListener("tick", stage);
}

// A função que move o player até a matéria correta 
function movePlayerTo(index) {
  createjs.Tween.get(player)
    .to({ x: fases[index].x - 40, y: fases[index].y }, 1000, createjs.Ease.getPowInOut(2));
}

// A função que acessa a sala da matéria selecionada
function acessarSala(materia) {
  alert("Indo para a sala de " + materia);
  // window.location.href = `sala.html?materia=${encodeURIComponent(materia)}`;
}
