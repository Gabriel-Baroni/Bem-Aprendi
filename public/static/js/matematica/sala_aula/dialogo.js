let textoEmDigitacao = false;

// MOSTRAR DIÁLOGO
function mostrarDialogo(nome, imagem, texto, callback) {
  const dialogo = document.getElementById("caixa-dialogo");
  const nomeEl = document.getElementById("dialogo-nome");
  const fotoEl = document.getElementById("dialogo-foto");
  const textoEl = document.getElementById("dialogo-texto");

  nomeEl.textContent = nome;
  fotoEl.src = imagem;
  textoEl.textContent = "";

  dialogo.style.display = "flex";
  textoEmDigitacao = true;

  let i = 0;
  const intervalo = setInterval(() => {
    textoEl.textContent += texto.charAt(i);
    i++;
    if (i >= texto.length) {
      clearInterval(intervalo);
      textoEmDigitacao = false; 
      if (callback) callback(); 
    }
  }, 25);
}
