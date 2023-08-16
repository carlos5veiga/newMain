const titulo = document.title;
console.log(titulo);
const numero = titulo.replace("Treino ", "");
console.log(numero);

document.getElementById("imagem_solfejo").src = "https://carlosveigafilho.com.br/treinosolf/images/treino" + numero + ".jpg";

document.getElementById("acompanhamento").onclick = function () {
    const audio1 = document.getElementById("audio1");
    audio1.src = "https://www.carlosveigafilho.com.br/treinosolf/sounds/" + numero + "acomp.mp3";
    audio1.play();
}

document.getElementById("notas").onclick = function () {
    const audio1 = document.getElementById("audio1");
    audio1.src = "https://www.carlosveigafilho.com.br/treinosolf/sounds/" + numero + "notas.mp3";
    audio1.play();
}

document.getElementById("graus").onclick = function () {
    const audio1 = document.getElementById("audio1");
    audio1.src = "https://www.carlosveigafilho.com.br/treinosolf/sounds/" + numero + "graus.mp3";
    audio1.play();
}

document.getElementById("ritmo").onclick = function () {
    const audio1 = document.getElementById("audio1");
    audio1.src = "https://www.carlosveigafilho.com.br/treinosolf/sounds/" + numero + "ritmo.mp3";
    audio1.play();
}
