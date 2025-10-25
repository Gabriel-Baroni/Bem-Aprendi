
// ---- 1. PREPARAR OS ÁUDIOS QUE FUNCIONAM ----

const musicaDeFundo = new Audio('static/sound/musica2.mp3');
musicaDeFundo.loop = true; 
musicaDeFundo.volume = 0.5;
const clickSound = new Audio('static/sound/pluck_002.ogg'); 
clickSound.volume = 1.0;


// ---- 2. ESPERAR O DOCUMENTO CARREGAR ----
document.addEventListener('DOMContentLoaded', () => {
    
    // Pega os elementos da tela
    const telaEntrada = document.getElementById('tela-entrada-mapa');
    const btnIniciar = document.getElementById('btn-iniciar-mapa');
    const appPrincipal = document.getElementById('app');

    // ---- 3. O CLIQUE DE AUTORIZAÇÃO ----
    // Este é o clique que o navegador EXIGE na mapa.html
    btnIniciar.addEventListener('click', () => {
        
        // Toca a música de fundo
        console.log("Clique de entrada detectado. Tocando música de fundo...");
        musicaDeFundo.play().catch(e => console.error("Erro ao tocar música:", e));

        // Esconde a tela de entrada
        telaEntrada.style.display = 'none';
        
        // Mostra o jogo
        appPrincipal.style.visibility = 'visible';

        // AGORA SIM, iniciamos o CreateJS e o mapa
        iniciarMapaCreateJS();

    }, { once: true }); // 'once: true' faz o clique funcionar só uma vez
});


// ---- 4. TODO O SEU CÓDIGO DO MAPA VAI AQUI DENTRO ----
// Nós encapsulamos todo o seu código em uma função.
function iniciarMapaCreateJS() {

    // Cria o palco com o Createjs
    const stage = new createjs.Stage("stage");

    // Cria um array com as coordenadas das materias e seus nomes
    const fases = [
      { x: 356, y: 619, materia: "Matemática", img:"static/img/matematica/sala.png" },
      { x: 266, y: 289, materia: "Lógica",  img:"static/img/matematica/sala.png"},
      { x: 949, y: 822, materia: "Português", img:"static/img/portugues/sala.png" },
      { x: 919, y: 295, materia: "História", img:"static/img/obra/construct.png" },
      { x: 1151, y: 560, materia: "Ciências", img:"static/img/obra/construct.png" },
      { x: 1669, y: 830, materia: "Inglês", img:"static/img/obra/construct.png" }
    ];

    // Cria variaveis globais para o player, popup e fundoClick
    let player;
    let popup, titulo, botao;
    let fundoClick;
    let ultimoSelecionado = null; 
    
    // Pré-Carrega a imagem do player e a imagem do fundo
    const loader = new createjs.LoadQueue();
    // Não precisamos mais carregar áudio aqui
    loader.loadManifest([
      { id: "bg", src: "static/img/index_img/tela_fases.png" },
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
      
      // Cria o FundoClick...
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
      
      // Cria o player...
      player = new createjs.Bitmap(loader.getResult("player"));
      player.regX = player.image.width / 2;
      player.regY = player.image.height / 2;
      player.scaleX = player.scaleY = 0.15;
      player.x = 630;
      player.y = 850;
      stage.addChild(player);

    // Pré-carrega as imagens das salas
    const imagensPrecarregadas = {};
    fases.forEach(fase => {
      if (fase.img) {
        const img = new Image();
        img.src = fase.img;
        imagensPrecarregadas[fase.materia] = img;
      }
    });

    // Cria os círculos para cada fase...
    fases.forEach((pos, i) => {
      const circle = new createjs.Shape();
      const raio =12;
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

        // ---- ÁUDIO DO CLIQUE ----
        // A música de fundo JÁ ESTÁ TOCANDO.
        // Aqui só tocamos o som do clique (o arquivo BOM).
        clickSound.currentTime = 0; // Reinicia
        clickSound.play().catch(e => console.warn("Arquivo de som de clique com problema."));

        // ---- RESTO DO SEU CÓDIGO DE CLIQUE ----
        const popupImage = document.getElementById("popup-image");
        if (imagensPrecarregadas[pos.materia] && imagensPrecarregadas[pos.materia].complete) {
          popupImage.style.backgroundImage = `url('${imagensPrecarregadas[pos.materia].src}')`;
        } else {
          popupImage.style.backgroundImage = "";
        }

        // Restaura o último selecionado...
        if (ultimoSelecionado && ultimoSelecionado !== circle) {
          ultimoSelecionado.graphics.clear()
            .beginFill(corOriginal)
            .drawCircle(0, 0, raio);
        }

        // Muda a cor do círculo atual...
        circle.graphics.clear()
          .beginFill(corSelecionado)
          .drawCircle(0, 0, raio);

        ultimoSelecionado = circle; 

        movePlayerTo(i);
        // Mostra o popup HTML com a matéria...
        popup = document.getElementById("popup-materia");
        titulo = document.getElementById("titulo-popup");
        botao = document.getElementById("botao-popup");

          titulo.textContent = pos.materia;
        popup.style.position = "fixed";
        popup.style.left = "50%";
        popup.style.top = "50%";
        popup.style.transform = "translate(-50%, -50%)";
        popup.style.display = "block";

        fundoClick.visible = true;
        botao.onclick = () => acessarSala(pos.materia);
      });

      document.getElementById("close-popup").addEventListener("click", () => {
        popup.style.display = 'none';
        fundoClick.visible = false;
        stage.update();
      });

    }); // Fim do fases.forEach

      // Atualiza o stage...
      createjs.Ticker.framerate = 60;
      createjs.Ticker.addEventListener("tick", stage);
      stage.update();
    } // Fim da função init()

    // A função que move o player até a matéria correta 
    function movePlayerTo(index) {
      createjs.Tween.get(player)
        .to({ x: fases[index].x - 100, y: fases[index].y }, 1000, createjs.Ease.getPowInOut(2));
    }

    // A função que acessa a sala da matéria selecionada
    function acessarSala(materia) {
        const rotas = {
        "Matemática": "Matematica/sala.html",
        "Lógica": "logica/sala.html",
        "Português": "Portugues/sala.html",
        "História": "obra.html",
        "Ciências": "obra.html",
        "Inglês": "obra.html"
      };
        window.location.href = rotas[materia] || `sala.html?materia=${encodeURIComponent(materia)}`;
    }
    
} // Fim da função iniciarMapaCreateJS()