  window.onload = function () {
      const stage = new createjs.Stage("gameCanvas");
      createjs.Ticker.framerate = 60;
      createjs.Ticker.addEventListener("tick", stage);

      let colX = [50, 200, 350, 500];
      let colunas = [
        [15, 4, 20, 3],
        ['+', '-', 'X', '÷'],
        [5, 1, 10, 3],
        [20, 3, 30, 5]
      ];

      let blocos = [];
      let pontosSelecionados = [];
      let currentLine = null;
      let mouseDown = false;
      let ultimaPos = null;
      let linhasErradas = [];

      function criarBloco(texto, x, y, tipo) {
        const cont = new createjs.Container();
        const shape = new createjs.Shape();
        shape.graphics.beginFill("#ffffff").setStrokeStyle(2).beginStroke("#000000").drawRoundRect(0, 0, 60, 50, 10);
        
        const label = new createjs.Text(texto, "20px Arial", "#000");
        label.textAlign = "center";
        label.textBaseline = "middle";
        label.x = 30;
        label.y = 25;
        
        cont.addChild(shape, label);
        cont.x = x;
        cont.y = y;
        cont.valor = texto;
        cont.tipo = tipo;
        stage.addChild(cont);
        blocos.push(cont);
        return cont;
      }

      function criarColunas() {
        for (let i = 0; i < colunas.length; i++) {
          for (let j = 0; j < colunas[i].length; j++) {
            criarBloco(colunas[i][j], colX[i], 50 + j * 80, i);
          }
        }
      }

      function pegarBlocoEm(x, y) {
        return blocos.find(b => {
          const bx = b.x, by = b.y;
          return x >= bx && x <= bx + 60 && y >= by && y <= by + 50;
        });
      }

      window.resetLinha = function () {
        for (let l of linhasErradas) {
          stage.removeChild(l);
        }
        linhasErradas = [];
        stage.update();
      }

      stage.on("stagemousedown", (evt) => {
        const bloco = pegarBlocoEm(evt.stageX, evt.stageY);
        mouseDown = true;
        ultimaPos = { x: evt.stageX, y: evt.stageY };
        pontosSelecionados = bloco ? [bloco] : [];

        currentLine = new createjs.Shape();
        currentLine.graphics.setStrokeStyle(3).beginStroke("blue").moveTo(evt.stageX, evt.stageY);
        stage.addChild(currentLine);
      });

      stage.on("stagemousemove", (evt) => {
        if (mouseDown && currentLine) {
          currentLine.graphics.lineTo(evt.stageX, evt.stageY);

          const bloco = pegarBlocoEm(evt.stageX, evt.stageY);
          if (bloco && !pontosSelecionados.includes(bloco)) {
            pontosSelecionados.push(bloco);
          }

          ultimaPos = { x: evt.stageX, y: evt.stageY };
          stage.update();
        }
      });

      stage.on("stagemouseup", () => {
        mouseDown = false;

        if (!currentLine || pontosSelecionados.length < 4) {
          stage.removeChild(currentLine);
          currentLine = null;
          pontosSelecionados = [];
          return;
        }

        const [b1, b2, b3, b4] = pontosSelecionados;
        const n1 = Number(b1.valor);
        const op = b2.valor;
        const n2 = Number(b3.valor);
        const resultado = Number(b4.valor);

        let calc = null;
        if (op === '+') calc = n1 + n2;
        else if (op === '-') calc = n1 - n2;
        else if (op === '*') calc = n1 * n2;
        else if (op === '/') calc = n2 !== 0 ? n1 / n2 : NaN;

        const correta = calc === resultado;

        currentLine.graphics.clear();
        currentLine.graphics.setStrokeStyle(3).beginStroke(correta ? "green" : "red")
          .moveTo(b1.x + 30, b1.y + 25)
          .lineTo(b2.x + 30, b2.y + 25)
          .lineTo(b3.x + 30, b3.y + 25)
          .lineTo(b4.x + 30, b4.y + 25);

        if (!correta) {
          linhasErradas.push(currentLine);
        }

        pontosSelecionados = [];
        currentLine = null;
      });

      criarColunas();
    };