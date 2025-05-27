const stage = new createjs.Stage("stage");

// Coordenadas dos níveis (fases) no mapa
const fases = [
  {x: 100, y: 300},
  {x: 200, y: 250},
  {x: 300, y: 300},
  {x: 400, y: 200},
  {x: 500, y: 250},
];

// Criar os nós das fases
fases.forEach((pos, i) => {
  const circle = new createjs.Shape();
  circle.graphics.beginFill("#fff").drawCircle(0, 0, 15);
  circle.x = pos.x;
  circle.y = pos.y;
  circle.cursor = "pointer";

  // Texto da fase
  const txt = new createjs.Text(i + 1, "16px Arial", "#000");
  txt.x = pos.x - 5;
  txt.y = pos.y - 10;

  stage.addChild(circle, txt);

  circle.on("click", () => {
    movePlayerTo(i);
  });
});

// Criar personagem (círculo vermelho)
const player = new createjs.Shape();
player.graphics.beginFill("red").drawCircle(0, 0, 10);
player.x = fases[0].x;
player.y = fases[0].y;
stage.addChild(player);

// Função que move o player para a fase clicada animado
function movePlayerTo(index) {
  createjs.Tween.get(player)
    .to({x: fases[index].x, y: fases[index].y}, 1000, createjs.Ease.getPowInOut(2));
}

createjs.Ticker.framerate = 60;
createjs.Ticker.addEventListener("tick", stage);