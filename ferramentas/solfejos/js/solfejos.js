(function () {
  "use strict";
  var audio = document.getElementById("audio1");
  var status = document.getElementById("playback-status");
  var buttons = Array.from(document.querySelectorAll(".audio-mode"));
  var selected = "Tonalidade";
  var request = 0;
  var stop = document.getElementById("stop-audio");
  var zoom = document.getElementById("zoom-score");
  var score = document.getElementById("score-scroll");
  var image = document.getElementById("imagem_solfejo");
  document.getElementById("year").textContent = new Date().getFullYear();
  stop.hidden = false;
  zoom.hidden = false;
  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      var thisRequest = ++request;
      selected = button.dataset.label;
      audio.pause();
      audio.src = button.dataset.audioSrc;
      buttons.forEach(function (item) { item.setAttribute("aria-pressed", String(item === button)); });
      audio.setAttribute("aria-label", selected + " — solfejo " + document.getElementById("conteudo").dataset.exercise);
      status.textContent = "Carregando: " + selected + "…";
      var promise = audio.play();
      if (promise && promise.catch) promise.catch(function (error) {
        if (thisRequest !== request || error.name === "AbortError") return;
        status.textContent = error.name === "NotAllowedError"
          ? "Pressione reproduzir no player para ouvir: " + selected + "."
          : "Não foi possível reproduzir este áudio. Tente novamente ou escolha outro apoio.";
      });
    });
  });
  audio.addEventListener("playing", function () { status.textContent = "Ouvindo: " + selected + "."; });
  audio.addEventListener("pause", function () {
    if (!audio.ended) status.textContent = "Pausado: " + selected + ".";
  });
  audio.addEventListener("ended", function () { status.textContent = "Áudio concluído: " + selected + "."; });
  audio.addEventListener("error", function () {
    status.textContent = "Não foi possível carregar este áudio. Verifique sua conexão ou escolha outro apoio.";
  });
  stop.addEventListener("click", function () {
    request++;
    audio.pause();
    if (audio.readyState > 0) audio.currentTime = 0;
    status.textContent = "Pronto para ouvir: " + selected + ".";
  });
  zoom.addEventListener("click", function () {
    var expanded = zoom.getAttribute("aria-pressed") !== "true";
    zoom.setAttribute("aria-pressed", String(expanded));
    score.classList.toggle("is-expanded", expanded);
    zoom.textContent = expanded ? "Ajustar à tela" : "Ampliar partitura";
  });
  image.addEventListener("error", function () {
    document.querySelector(".score-caption").prepend("A imagem não carregou. Tente abrir a partitura pelo link abaixo. ");
  });
}());
