// Aguarda o carregamento da página
window.onload = function () {
  // Cria um novo palco no CreateJS e delimita o framerate em 60 fps
  const stage = new createjs.Stage("gameCanvas");
  createjs.Ticker.framerate = 60;
  createjs.Ticker.addEventListener("tick", stage);

  // Variável para armazenar o tempo em segundos
  let tempo = 0;

  // Cria um texto para exibir o tempo na tela
  const textoTimer = new createjs.Text("Tempo: 0s", "20px Arial", "#000");
  textoTimer.x = 10;
  textoTimer.y = 10;
  stage.addChild(textoTimer);

  // Atualiza o tempo a cada segundo
  setInterval(() => {
    tempo++;
    textoTimer.text = "Tempo: " + tempo + "s";
  }, 1000);

  // Array com a coordenada X de cada coluna
  let colX = [50, 200, 350, 500];
  // Array de arrays com o conteúdo de cada coluna
  let colunas = [
    [10, 9, 20, 3],
    ['+', '-', '×', '÷'],
    [5, 1, 6, 2],
    [15, 10, 18, 5]
  ];
  // Array para armazenar todos os blocos (caixas com os números)
  let blocos = [];
  // Array para armazenar todos os blocos selecionados 
  let pontosSelecionados = [];
  // Array para armazenar todos as linhas de respostas erradas
  let linhasErradas = [];
  // Índice para pegar um cor diferente a cada resposta correta
  let corIndex = 0;
  // Array com possíveis cores para linhas de respostas corretas
  const coresLinhas = ["blue", "purple", "orange", "brown", "deeppink", "green", "teal"];
  // Cor original dos blocos 
  const corOriginal = "#fff7db";
  // Cor dos blocos selecionados
  const corSelecionado = "#a8d8ea";
  // Imagens dos ícones de certo ou errado
  const iconeCerto = new Image();
  iconeCerto.src = "https://img.icons8.com/emoji/48/000000/check-mark-emoji.png";
  const iconeErrado = new Image();
  iconeErrado.src = "https://img.icons8.com/emoji/48/000000/cross-mark-emoji.png";

  // Variável para pontuação do usuário, começa em 0
  let pontuacao = 0;
  // Pontuação total da fase, fixada em 200 pontos
  const pontuacaoTotal = 200;
  // Contador de respostas corretas para controlar quando acabar as possibilidades
  let respostasCorretas = 0;
  // Total de respostas possíveis (exemplo, pode ser ajustado conforme o jogo)
  const totalRespostasPossiveis = 5; // Ajuste esse número de acordo com as combinações corretas possíveis no seu jogo

  // Função que cria cada bloco, tem como parâmetros um texto para o bloco, suas coordenadas e o tipo 
  function criarBloco(texto, x, y, tipo) {
    const cont = new createjs.Container(); //Cria um container 
    const shape = new createjs.Shape();  // Dentro do container, cria uma forma
    shape.graphics.beginFill(corOriginal).setStrokeStyle(3).beginStroke("#ffa500").drawRoundRect(0, 0, 60, 50, 12); // Define a forma como um retângulo e atribui suas características 

    const label = new createjs.Text(texto, "20px Comic Sans MS", "#000"); //Cria um texto com o texto passado pelo parâmetro
    // Define a posição do texto dentro do container
    label.textAlign = "center";
    label.textBaseline = "middle";
    label.x = 30;
    label.y = 25;
    cont.addChild(shape, label);  // Adiciona o retângulo e o texto como filhos do container
    // Define as coordenadas do container a partir das passadas por parâmetro
    cont.x = x;
    cont.y = y;
    cont.valor = texto;// Cria uma nova propriedade do container e armazena o valor do texto passado (String ou número)
    cont.tipo = tipo;  // Cria uma propriedade, que recebe o valor passado pelo parâmetro, ajuda na classificação do bloco entre as colunas (String)
    // Cria propriedades que referenciam o retângulo e o texto (Objeto do CreateJS)
    cont.shape = shape; 
    cont.label = label;
    cont.linhasConectadas = []; // Inicializa uma propriedade para armazenar as linhas conectadas no bloco 
    blocos.push(cont);  // Adiciona o container criado à lista de blocos
    return cont; // Retorna o bloco criado
  }

  // Função para criar as colunas 
  function criarColunas() {
    for (let i = 0; i < colunas.length; i++) { //Laço for externo, que percorre cada coluna
      for (let j = 0; j < colunas[i].length; j++) { //Laço for interno, que percorre cada elemento da coluna
        const bloco = criarBloco(colunas[i][j], colX[i], 50 + j * 80, i); //Chama a função criarBloco e passa os parâmetros
        stage.addChild(bloco); //Adiciona esse novo bloco ao palco 
      }
    }
  }

  // Função para identificar qual bloco foi clicado, tem como parâmetro a coordenada do clique
  function pegarBlocoEm(x, y) {
    return blocos.find(b => { //Usa o método find() para procurar dentro do array blocos
      const bx = b.x, by = b.y; //Cria variáveis com as coordenadas x e y do bloco
      return x >= bx && x <= bx + 60 && y >= by && y <= by + 50; //Vai retornar blocos que estiverem dentro da coordenada do clique. 
    });
  }

  // Função global que reseta todas as linhas vermelhas e blocos selecionados
  window.resetLinha = function () {
    // Perocorre o array de linhas erradas e remove elas do palco
    for (let l of linhasErradas) {
      stage.removeChild(l);
    }
    // Retorna a os atributos originais em cada bloco em todos os blocos
    blocos.forEach(b => {
      b.shape.graphics.clear().beginFill(corOriginal).setStrokeStyle(3).beginStroke("#ffa500").drawRoundRect(0, 0, 60, 50, 12);
    });
    // Limpa os arrays de linhasErradas e pontosSelecionados
    linhasErradas = [];
    pontosSelecionados = [];
    stage.update(); //Força a atualização da tela
  }

  // Função para criar o pop-up de fim de fase com a pontuação e opções
  function criarPopupFinal() {
    // Container para o pop-up
    const popup = new createjs.Container();

    // Fundo semi-transparente para o pop-up
    const fundo = new createjs.Shape();
    fundo.graphics.beginFill("rgba(0,0,0,0.7)").drawRect(0, 0, stage.canvas.width, stage.canvas.height);
    popup.addChild(fundo);

    // Caixa do pop-up branca
    const caixa = new createjs.Shape();
    caixa.graphics.beginFill("#fff").drawRoundRect(0, 0, 400, 250, 20);
    caixa.x = stage.canvas.width / 2 - 200;
    caixa.y = stage.canvas.height / 2 - 125;
    popup.addChild(caixa);

    // Texto Parabéns
    const textoParabens = new createjs.Text("Parabéns!", "30px Comic Sans MS", "#333");
    textoParabens.x = stage.canvas.width / 2;
    textoParabens.y = stage.canvas.height / 2 - 100;
    textoParabens.textAlign = "center";
    popup.addChild(textoParabens);

    // Texto da pontuação do usuário
    const textoPontuacao = new createjs.Text(
      `Sua pontuação: ${pontuacao} / ${pontuacaoTotal}`,
      "24px Comic Sans MS",
      "#333"
    );
    textoPontuacao.x = stage.canvas.width / 2;
    textoPontuacao.y = stage.canvas.height / 2 - 40;
    textoPontuacao.textAlign = "center";
    popup.addChild(textoPontuacao);

    // Botão "Próximo"
    const botaoProximo = new createjs.Container();
    const botaoProximoBg = new createjs.Shape();
    botaoProximoBg.graphics.beginFill("#4CAF50").drawRoundRect(0, 0, 150, 50, 12);
    botaoProximo.addChild(botaoProximoBg);
    botaoProximo.x = stage.canvas.width / 2 - 175;
    botaoProximo.y = stage.canvas.height / 2 + 70;

    const textoBotaoProximo = new createjs.Text("Próximo", "22px Comic Sans MS", "#fff");
    textoBotaoProximo.textAlign = "center";
    textoBotaoProximo.textBaseline = "middle";
    textoBotaoProximo.x = 75;
    textoBotaoProximo.y = 25;
    botaoProximo.addChild(textoBotaoProximo);
    popup.addChild(botaoProximo);

    botaoProximo.cursor = "pointer";
    botaoProximo.on("click", () => {
      // Aqui você pode colocar a lógica para ir para a próxima fase
      // Por enquanto, só remove o pop-up e reseta o jogo
      stage.removeChild(popup);
      resetJogo();
    });

    // Botão "Jogar de novo"
    const botaoJogarDeNovo = new createjs.Container();
    const botaoJogarDeNovoBg = new createjs.Shape();
    botaoJogarDeNovoBg.graphics.beginFill("#2196F3").drawRoundRect(0, 0, 150, 50, 12);
    botaoJogarDeNovo.addChild(botaoJogarDeNovoBg);
    botaoJogarDeNovo.x = stage.canvas.width / 2 + 25;
    botaoJogarDeNovo.y = stage.canvas.height / 2 + 70;

    const textoBotaoJogarDeNovo = new createjs.Text("Jogar de novo", "22px Comic Sans MS", "#fff");
    textoBotaoJogarDeNovo.textAlign = "center";
    textoBotaoJogarDeNovo.textBaseline = "middle";
    textoBotaoJogarDeNovo.x = 75;
    textoBotaoJogarDeNovo.y = 25;
    botaoJogarDeNovo.addChild(textoBotaoJogarDeNovo);
    popup.addChild(botaoJogarDeNovo);

    botaoJogarDeNovo.cursor = "pointer";
    botaoJogarDeNovo.on("click", () => {
      stage.removeChild(popup);
      resetJogo();
    });

    stage.addChild(popup);
  }

  // Função para resetar o jogo (resetar variáveis, limpar linhas, etc)
  function resetJogo() {
    pontuacao = 0;
    respostasCorretas = 0;
    corIndex = 0;
    linhasErradas.forEach(l => stage.removeChild(l));
    linhasErradas = [];
    pontosSelecionados = [];
    blocos.forEach(b => {
      b.shape.graphics.clear().beginFill(corOriginal).setStrokeStyle(3).beginStroke("#ffa500").drawRoundRect(0, 0, 60, 50, 12);
      b.linhasConectadas = [];
    });
    stage.update();
  }

  stage.on("stagemousedown", (evt) => { //Adiciona um listener de click no palco 
    const bloco = pegarBlocoEm(evt.stageX, evt.stageY); // Chama a função e passa as coordenadas do click como parâmetro
    if (!bloco || pontosSelecionados.includes(bloco)) return; // Verifica se o tem algum bloco ou se o bloco ja foi selecionado

    if (!pontosSelecionados.find(b => b.tipo === bloco.tipo)) { //Verifica se não existe um bloco selecionado com o mesmo tipo 
      pontosSelecionados.push(bloco); //Adiciona o bloco ao array dos blocos selecionados 
      bloco.shape.graphics.clear().beginFill(corSelecionado).setStrokeStyle(3).beginStroke("#ffa500").drawRoundRect(0, 0, 60, 50, 12); 

      if (pontosSelecionados.length === 4) { //Verifica se foram selecionados 4 blocos
        verificarResposta();
      }
    }
  });

  // Cria uma função para mostrar o icone de certo ou errado 
  function mostrarIcone(resultado, x, y) {
    const bitmap = new createjs.Bitmap(resultado ? iconeCerto : iconeErrado); //Cria uma nova imagem que vai variar de valor dependendo se resultado for TRUE ou FALSE 
    bitmap.x = x;
    bitmap.y = y;
    bitmap.scaleX = bitmap.scaleY = 0.6;
    stage.addChild(bitmap);
    createjs.Tween.get(bitmap) // Animação para retirar o ícone da tela
      .to({ alpha: 0, y: y - 20 }, 1500)
      .call(() => stage.removeChild(bitmap));
  }

  // Cria a função que verifica se a operação matemática feita está correta
  function verificarResposta() {
    const [b1, b2, b3, b4] = pontosSelecionados; //Armazenas os blocos selecionados em 4 variáveis 
    //Converte os valores numéricos em numeros e armazena o operador 
    const n1 = Number(b1.valor);
    const op = b2.valor;
    const n2 = Number(b3.valor);
    const resultado = Number(b4.valor);

    let calc = null; // Variável que vai armazenar o resultado da conta
    if (op === '+') calc = n1 + n2;
    else if (op === '-') calc = n1 - n2;
    else if (op === '×') calc = n1 * n2;
    else if (op === '÷') calc = n2 !== 0 ? n1 / n2 : NaN;

    const correta = calc === resultado; //Verifica se o resultado é o esperado

    const line = new createjs.Shape(); //Cria a linha que vai ligar os blocos
    const corLinha = correta ? coresLinhas[corIndex % coresLinhas.length] : "red"; // Se for correta, uma das cores do arry coresLinhas, se não é vermelho
    corIndex++;

    const offset = corIndex * 2; //Deslocamento verticall da linha para não ficar uma sobre a outra

    //Desenha a linha pasando pelo o caminho certo
    line.graphics.setStrokeStyle(4).beginStroke(corLinha)
      .moveTo(b1.x + 30, b1.y + 25 + offset)
      .lineTo(b2.x + 30, b2.y + 25 + offset)
      .lineTo(b3.x + 30, b3.y + 25 + offset)
      .lineTo(b4.x + 30, b4.y + 25 + offset);

    stage.addChildAt(line, 0); //Adiciona a linha atrás de todos os outros elementos 

    if (!correta) {
      linhasErradas.push(line);
    } else {
      [b1, b2, b3, b4].forEach(b => b.linhasConectadas.push(line));
      // Incrementa a pontuação proporcionalmente, para totalizar 200 pontos após todas as respostas corretas
      pontuacao += Math.floor(pontuacaoTotal / totalRespostasPossiveis);
      respostasCorretas++;

      // Se já encontrou todas as respostas corretas possíveis, exibe o pop-up final
      if (respostasCorretas >= totalRespostasPossiveis) {
        criarPopupFinal();
      }
    }

    mostrarIcone(correta, b4.x + 70, b4.y);

    pontosSelecionados.forEach(b => { //Limpa o visual dos blocos selecionados
      b.shape.graphics.clear().beginFill(corOriginal).setStrokeStyle(3).beginStroke("#ffa500").drawRoundRect(0, 0, 60, 50, 12);
    });

    pontosSelecionados = []; 
  }

  // Chama a função para desenhar as colunas e blocos
  criarColunas();
};
