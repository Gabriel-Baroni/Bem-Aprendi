// Cria o palco com o Createjs
const stage = new createjs.Stage("stage");

// Cria um array com as coordenadas das materias e seus nomes
const fases = [
  { x: 350, y: 620, materia: "Matemática" },
  { x: 260, y: 290, materia: "Lógica" },
  { x: 950, y: 825, materia: "Português" },
  { x: 935, y: 300, materia: "História" },
  { x: 1160, y: 560, materia: "Ciências" },
  { x: 1670, y: 825, materia: "Inglês" }
];

// Cria variaveis globais para o player, popup e fundoClick
let player;
let popup, titulo, botao;
let fundoClick;
let ultimoSelecionado = null; // Variável para guardar o último círculo clicado

// Pré-Carrega a imagem do player e a imagem do fundo
const loader = new createjs.LoadQueue();
loader.loadManifest([
  { id: "bg", src: "static/img/index_img/fundo_pixel.jpeg" },
  { id: "player", src: "static/img/index_img/bem_te_vi.png" }
]);
loader.on("complete", init);

// Função que ira criar cada elemento com o createjs e adicionar ao palco
function init() {
  // Carrerga a imagem do fundo e adiciona ao palco
  const bg = new createjs.Bitmap(loader.getResult("bg"));
  bg.set({
    scaleX: stage.canvas.width / bg.image.width,
    scaleY: stage.canvas.height / bg.image.height
  });
stage.addChild(bg);
  // Cria o FundoClick, que é um fundo invisível que detecta cliques fora do popup 
  fundoClick = new createjs.Shape();
  fundoClick.graphics.beginFill("rgba(0,0,0,0.01)").drawRect(0, 0, 1920, 1080 );
  fundoClick.visible = false;
  fundoClick.cursor = "default";
  fundoClick.on("click", () => {
    popup.style.display = "none";
    fundoClick.visible = false;
    stage.update();
  });
  stage.addChild(fundoClick);

  // Cria o player e suas características
  player = new createjs.Bitmap(loader.getResult("player"));
  player.regX = player.image.width / 2;
  player.regY = player.image.height / 2;
  player.scaleX = player.scaleY = 0.3;
  player.x = 620;
  player.y = 900;
  stage.addChild(player);

// Cria os círculos para cada fase e suas características
fases.forEach((pos, i) => {
  const circle = new createjs.Shape();
  const raio = 35;
  const corOriginal = "#ffffff";
  const corSelecionado = "#FFFF00"; 

  circle.graphics.beginFill(corOriginal).drawCircle(0, 0, raio);
  circle.x = pos.x;
  circle.y = pos.y;
  circle.cursor = "pointer";
  stage.addChild(circle);

  // Adiciona um evento de clique ao círculo
  circle.on("click", (event) => {
    event.stopPropagation();

    // Restaura o último selecionado, se não for o mesmo
    if (ultimoSelecionado && ultimoSelecionado !== circle) {
      ultimoSelecionado.graphics.clear()
        .beginFill(corOriginal)
        .drawCircle(0, 0, raio);
    }

    // Muda a cor do círculo atual
    circle.graphics.clear()
      .beginFill(corSelecionado)
      .drawCircle(0, 0, raio);

    ultimoSelecionado = circle; // Atualiza o último selecionado

    // Mostra o popup HTML com a matéria
    popup = document.getElementById("popup-materia");
    titulo = document.getElementById("titulo-popup");
    botao = document.getElementById("botao-popup");

    titulo.textContent = pos.materia;

    // Posiciona o pop-up próximo à matéria clicada
    popup.style.position = "fixed";
    popup.style.left = "50%";
    popup.style.top = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.display = "block";

    fundoClick.visible = true;
    botao.onclick = () => acessarSala(pos.materia);

    movePlayerTo(i);
  });
});

  // Atualiza o stage a cada tick e define o framerate da tela em 60 fps
  createjs.Ticker.framerate = 60;
  createjs.Ticker.addEventListener("tick", stage);
}

// A função que move o player até a matéria correta 
function movePlayerTo(index) {
  createjs.Tween.get(player)
    .to({ x: fases[index].x - 100, y: fases[index].y }, 1000, createjs.Ease.getPowInOut(2));
}

// A função que acessa a sala da matéria selecionada
function acessarSala(materia) {
  alert("Indo para a sala de " + materia);
  // window.location.href = `sala.html?materia=${encodeURIComponent(materia)}`;
}
