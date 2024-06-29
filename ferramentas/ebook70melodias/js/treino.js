const titulo = document.title;
console.log(titulo);
const numero = titulo.replace("Ebook ", "");
console.log(numero);

document.getElementById("imagem_solfejo").src = "./img/ebook" + numero + ".jpg";

document.getElementById("60bpm").onclick = function () {
    const audio1 = document.getElementById("audio1");
    audio1.src = "./sounds/" + numero + "60bpm.mp3";
    audio1.play();
}

document.getElementById("70bpm").onclick = function () {
    const audio1 = document.getElementById("audio1");
    audio1.src = "./sounds/" + numero + "70bpm.mp3";
    audio1.play();
}

document.getElementById("80bpm").onclick = function () {
    const audio1 = document.getElementById("audio1");
    audio1.src = "./sounds/" + numero + "80bpm.mp3";
    audio1.play();
}

document.getElementById("90bpm").onclick = function () {
    const audio1 = document.getElementById("audio1");
    audio1.src = "./sounds/" + numero + "90bpm.mp3";
    audio1.play();
}

document.getElementById("100bpm").onclick = function () {
    const audio1 = document.getElementById("audio1");
    audio1.src = "./sounds/" + numero + "100bpm.mp3";
    audio1.play();
}
