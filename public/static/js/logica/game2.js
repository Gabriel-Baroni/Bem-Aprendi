window.onload = function () {
    const fasesLogica = [
        {
            sequencia: [
                { id: 1, imagem: "../static/img/logica/maca_pequena.png" },
                { id: 2, imagem: "../static/img/logica/maca_media.png" },
                { id: 3, imagem: "../static/img/logica/maca_grande.png" }
            ]
        },
        {
            sequencia: [
                { id: 1, imagem: "../static/img/logica/pote_1_biscoito.png" },
                { id: 2, imagem: "../static/img/logica/pote_2_biscoitos.png" },
                { id: 3, imagem: "../static/img/logica/pote_3_biscoitos.png" },
            ]
        },
        {
            sequencia: [
                { id: 1, imagem: "../static/img/logica/ovo.png" },
                { id: 2, imagem: "../static/img/logica/pintinho_nascendo.png" },
                { id: 3, imagem: "../static/img/logica/pintinho.png" },
                { id: 4, imagem: "../static/img/logica/galinha.png" }
            ]
        },
        {
            sequencia: [
                { id: 1, imagem: "../static/img/logica/acordar.png" },
                { id: 2, imagem: "../static/img/logica/escovar_dentes.png" },
                { id: 3, imagem: "../static/img/logica/tomar_cafe.png" },
                { id: 4, imagem: "../static/img/logica/ir_escola.png" }
            ]
        },
        {
            sequencia: [
                { id: 1, imagem: "../static/img/logica/crianca_com_sorvete.png" },
                { id: 2, imagem: "../static/img/logica/sol_forte.png" },
                { id: 3, imagem: "../static/img/logica/sorvete_derretendo.png" },
                { id: 4, imagem: "../static/img/logica/crianca_triste.png" }
            ]
        }
    ];

    const estadoJogo = {
        faseAtual: 0, vidas: 3, tempo: 0, contandoTempo: true,
        figurasArrastaveis: [], caixasAlvo: [],
        pontuacaoAcumulada: 0, pontuacao: 0,
    };

    const sons = { erro: "../static/sound/error_008.ogg" };
    createjs.Sound.registerSound(sons.erro, "erro");
    
    const canvas = document.getElementById("gameCanvas");
    canvas.width = 800;
    canvas.height = 600;

    const stage = new createjs.Stage(canvas);
    createjs.Ticker.framerate = 60;
    createjs.Ticker.addEventListener("tick", stage);
    createjs.Touch.enable(stage);

    const textoTimer = new createjs.Text("Tempo: 0s", "15px 'Press Start 2P'", "#000");
    textoTimer.x = 10;
    textoTimer.y = 10;
    
    let textoInstrucao;

    function dialogoInstrucoes(callbackFimDialogo) {
        if (typeof mostrarDialogo !== 'function') {
            console.error("A função 'mostrarDialogo' não foi encontrada. Verifique se o arquivo dialogo.js está sendo carregado corretamente.");
            callbackFimDialogo();
            return;
        }

        document.getElementById("overlay-dialogo").style.display = "block";
        document.getElementById("caixa-dialogo").style.display = "flex";
        estadoJogo.contandoTempo = false;
        
        const nomePersonagem = "Prof. Duá";
        const imagemPersonagem = "static/img/portugues/prof.png";
        const falas = [
            "Bem-vindo ao Desafio da Lógica!",
            "Arraste as figuras para os quadrados na ordem correta.",
            "Quando terminar, clique em 'Verificar Resposta'. Boa sorte!"
        ];

        let falaIndex = 0;
        mostrarDialogo(nomePersonagem, imagemPersonagem, falas[falaIndex], () => {
            document.getElementById("caixa-dialogo").onclick = () => {
                if (!window.textoEmDigitacao) {
                    falaIndex++;
                    if (falaIndex < falas.length) {
                        mostrarDialogo(nomePersonagem, imagemPersonagem, falas[falaIndex]);
                    } else {
                        document.getElementById("caixa-dialogo").onclick = null;
                        document.getElementById("caixa-dialogo").style.display = "none";
                        document.getElementById("overlay-dialogo").style.display = "none";
                        estadoJogo.contandoTempo = true;
                        if (typeof callbackFimDialogo === "function") {
                            callbackFimDialogo();
                        }
                    }
                }
            };
        });
    }

    setInterval(() => {
        if (estadoJogo.contandoTempo) {
            estadoJogo.tempo++;
            textoTimer.text = `Tempo: ${estadoJogo.tempo}s`;
        }
    }, 1000);

    function enableDrag(item) {
        item.on("mousedown", function (evt) {
            estadoJogo.caixasAlvo.forEach(caixa => { if (caixa.figura === this) caixa.figura = null; });
            this.offset = { x: this.x - evt.stageX, y: this.y - evt.stageY };
            stage.setChildIndex(this, stage.numChildren - 1);
        });

        item.on("pressmove", function (evt) {
            this.x = evt.stageX + this.offset.x;
            this.y = evt.stageY + this.offset.y;
            stage.update();
        });

        item.on("pressup", function (evt) {
            const alvo = estadoJogo.caixasAlvo.find(caixa =>
                evt.stageX > caixa.x && evt.stageX < caixa.x + caixa.largura &&
                evt.stageY > caixa.y && evt.stageY < caixa.y + caixa.altura && !caixa.figura
            );

            if (alvo) {
                this.x = alvo.x + alvo.largura / 2;
                this.y = alvo.y + alvo.altura / 2;
                alvo.figura = this;
            } else { 
                this.x = this.originalX; 
                this.y = this.originalY;
            }
            stage.update();
        });
    }

    function verificarResposta() {
        const todasPreenchidas = estadoJogo.caixasAlvo.every(caixa => caixa.figura !== null);
        if (!todasPreenchidas) {
            criarPopupAlerta("Você precisa preencher todas as caixas!");
            return;
        }

        const respostaJogador = [];
        estadoJogo.caixasAlvo.forEach(caixa => {
            respostaJogador.push(caixa.figura.id_correto);
        });

        let acerto = true;
        for (let i = 0; i < respostaJogador.length; i++) {
            if (respostaJogador[i] !== i + 1) {
                acerto = false;
                break;
            }
        }

        if (acerto) {
            calcularPontuacao();
            criarPopupFinal();
        } else {
            estadoJogo.vidas--;
            atualizarVidas();
            createjs.Sound.play("erro");

            if (estadoJogo.vidas <= 0) {
                criarPopupGameOver();
            } else {
                criarPopupAlerta("Sequência incorreta! Tente de novo.");
                estadoJogo.figurasArrastaveis.forEach(figura => {
                    figura.x = figura.originalX;
                    figura.y = figura.originalY;
                });
                estadoJogo.caixasAlvo.forEach(caixa => caixa.figura = null);
                stage.update();
            }
        }
    }

    function resetarFase() {
        stage.removeAllChildren();
        estadoJogo.figurasArrastaveis = [];
        estadoJogo.caixasAlvo = [];
        criarTextoInstrucao();
        criarCaixasAlvo();
        criarFigurasArrastaveis();
        stage.addChild(textoTimer);
        atualizarVidas();
        estadoJogo.pontuacao = 0;
        estadoJogo.tempo = 0;
        stage.update();
    }

    function criarCaixasAlvo() {
        const fase = fasesLogica[estadoJogo.faseAtual];
        const { length: numeroDeCaixas } = fase.sequencia;
        const larguraCaixa = 120, alturaCaixa = 120, espacamento = 20;
        const larguraTotal = numeroDeCaixas * larguraCaixa + (numeroDeCaixas - 1) * espacamento;
        let posX = (stage.canvas.width - larguraTotal) / 2;
        estadoJogo.caixasAlvo = [];
        for (let i = 0; i < numeroDeCaixas; i++) {
            const caixa = new createjs.Shape();
            caixa.graphics.setStrokeStyle(2).beginStroke("#000").drawRoundRect(0, 0, larguraCaixa, alturaCaixa, 15);
            caixa.x = posX + i * (larguraCaixa + espacamento);
            caixa.y = 150;
            stage.addChild(caixa);
            estadoJogo.caixasAlvo.push({ x: caixa.x, y: caixa.y, largura: larguraCaixa, altura: alturaCaixa, figura: null, shape: caixa });
        }
    }

    function criarFigurasArrastaveis() {
        const fase = fasesLogica[estadoJogo.faseAtual];
        const figuras = embaralhar([...fase.sequencia]);
        const larguraFigura = 100, espacamento = 15;
        const totalLargura = figuras.length * larguraFigura + (figuras.length - 1) * espacamento;
        let posX = (stage.canvas.width - totalLargura) / 2;
        estadoJogo.figurasArrastaveis = [];
        figuras.forEach((figuraData, i) => {
            const container = new createjs.Container();
            const bitmap = new createjs.Bitmap(figuraData.imagem);
            bitmap.image.onload = () => {
                const escala = Math.min(larguraFigura / bitmap.image.width, 100 / bitmap.image.height);
                bitmap.scaleX = bitmap.scaleY = escala;
                bitmap.regX = bitmap.image.width / 2;
                bitmap.regY = bitmap.image.height / 2;
                stage.update();
            }
            container.addChild(bitmap);
            container.x = posX + i * (larguraFigura + espacamento) + larguraFigura / 2;
            container.y = 450;
            container.id_correto = figuraData.id;
            container.originalX = container.x;
            container.originalY = container.y;
            enableDrag(container);
            stage.addChild(container);
            estadoJogo.figurasArrastaveis.push(container);
        });
    }

    function embaralhar(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function criarTextoInstrucao() {
        if(textoInstrucao) stage.removeChild(textoInstrucao);
        const { instrucao } = fasesLogica[estadoJogo.faseAtual];
        textoInstrucao = new createjs.Text(instrucao, "15px 'Press Start 2P'", "#000");
        textoInstrucao.textAlign = "center";
        textoInstrucao.x = stage.canvas.width / 2;
        textoInstrucao.y = 40;
        stage.addChild(textoInstrucao);
    }
    
    function atualizarVidas() {
        document.getElementById("vidas").textContent = "❤️".repeat(Math.max(0, estadoJogo.vidas));
    }
    
    function calcularPontuacao() {
        const tempoMaxPontos = 30;
        const tempoMinPontos = 120;
        const pontuacaoMax = 200;
        const pontuacaoMin = 50;
        let pontosFase = 0;
        if (estadoJogo.tempo <= tempoMaxPontos) { pontosFase = pontuacaoMax; } 
        else if (estadoJogo.tempo >= tempoMinPontos) { pontosFase = pontuacaoMin; } 
        else {
            const fator = (estadoJogo.tempo - tempoMaxPontos) / (tempoMinPontos - tempoMaxPontos);
            pontosFase = (1 - fator) * pontuacaoMax + fator * pontuacaoMin;
        }
        estadoJogo.pontuacao = Math.floor(pontosFase);
    }

    function criarPopupFinal() {
        estadoJogo.pontuacaoAcumulada += estadoJogo.pontuacao;
        const popup = document.getElementById("popupFimFase");
        document.getElementById("pontuacaoFinal").textContent = estadoJogo.pontuacao;
        popup.classList.add("mostrar");

        const btnProximo = document.getElementById("btnProximo");
        const btnJogarDeNovo = document.getElementById("btnJogarDeNovo");

        if (estadoJogo.faseAtual < fasesLogica.length - 1) {
            btnProximo.textContent = "Próxima Fase";
            btnProximo.onclick = () => {
                estadoJogo.faseAtual++;
                popup.classList.remove("mostrar");
                resetarFase();
            };
        } else {
            btnProximo.textContent = "Finalizar";
            btnProximo.onclick = () => {
                popup.classList.remove("mostrar");
                enviarPontuacaoParaServidor(estadoJogo.pontuacaoAcumulada, "logica");
                criarPopupFIM();
            };
        }
        
        // Define a ação do botão "Jogar de Novo"
        btnJogarDeNovo.onclick = () => {
            popup.classList.remove("mostrar");
            // Apenas reinicia a fase atual, sem mudar de nível
            resetarFase();
        };

    }
    
    function criarPopupGameOver() {
        const popup = document.getElementById("popupGameOver");
        popup.classList.add("mostrar");
        document.getElementById("btnGameOverJogarDeNovo").onclick = () => {
            popup.classList.remove("mostrar");
            estadoJogo.faseAtual = 0;
            estadoJogo.vidas = 3;
            estadoJogo.pontuacaoAcumulada = 0;
            resetarFase();
        };
        const btnVoltarMenu = document.getElementById("btnGameOverMenu");
        btnVoltarMenu.onclick = () => { window.location.href = "/index.html"; };

    }
    
    function criarPopupAlerta(mensagem) {
        const popup = document.getElementById("popupAlerta");
        if (!popup) return;
        const textoPopup = document.getElementById("alertaTexto");
        if (textoPopup) textoPopup.textContent = mensagem;
        popup.classList.add("mostrar");
        setTimeout(() => { popup.classList.remove("mostrar"); }, 2000);
    }
    
    function criarPopupFIM() {
        const popup = document.getElementById("popupFim");
        popup.classList.add("mostrar");
        document.getElementById("pontuacaoAcumulada").textContent = estadoJogo.pontuacaoAcumulada;
        document.getElementById("btnFIM").onclick = () => { window.location.href = "/index.html"; };
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

    // --- INICIALIZAÇÃO DO JOGO ---
    document.getElementById("btnVerificar").onclick = verificarResposta;

    requestAnimationFrame(() => {
        dialogoInstrucoes(resetarFase);
    });
};