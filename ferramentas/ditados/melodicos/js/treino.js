const titulo = document.title;
console.log(titulo);
const numero = titulo.replace("Treino ", "");
console.log(numero);

document.getElementById("imagem_ditado").src = "./images/Mel" + numero + " Branco.jpg";

document.getElementById("play").onclick = function () {
    const audio1 = document.getElementById("audio1");
    audio1.src = "./sounds/Mel" + numero + ".mp3";
    audio1.play();
}

document.getElementById("resposta").onclick = function () {
    const imagem1 = document.getElementById("imagem_ditado");
    imagem1.src = "./images/Mel" + numero + " Resposta.jpg";
}

document.getElementById("branco").onclick = function () {
    const imagem1 = document.getElementById("imagem_ditado");
    imagem1.src = "./images/Mel" + numero + " Branco.jpg";
}
