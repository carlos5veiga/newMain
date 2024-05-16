const titulo = document.title;
console.log(titulo);
const numero = titulo.replace("Treino ", "");
console.log(numero);

const cabecalho = document.getElementById("cabecalho");
if (cabecalho) {
    cabecalho.innerHTML = `
    <input type="checkbox" id="menu" class="cabecalho__botao">
    <label for="menu" class="rotulo">
        <span class="cabecalho__menu-hamburger"></span>
    </label>
    <ul class="lista-menu">
        <li class="lista-menu__titulo">Categorias</li>
        <li class="lista-menu__item"><a href="../../../tutoriais.html" class="lista-menu__link">Tutoriais</a></li>
        <li class="lista-menu__item"><a target="_blank" href="https://tutoriaisemmusica.com.br" class="lista-menu__link">Cursos</a></li>
        <li class="lista-menu__item"><a href="../../../ferramentas.html" class="lista-menu__link">Ferramentas</a></li>
        <li class="lista-menu__item"><a href="../../../livros.html" class="lista-menu__link">Livros</a></li>
        <li class="lista-menu__item"><a target="_blank" href="https://carlosveigafilho.com.br/repertorio/index.html" class="lista-menu__link">Corais</a></li>
    </ul>
    <a href=../../../index.html"><img src="https://carlosveigafilho.com.br/img/LogoTuts40.png" class="cabecalho__imagem" alt="Logo dos Tutoriais em Música"></a>
    <h1 class="titulo-principal">Carlos Veiga Filho</h1>

    <ul class="opcoes">
        <li class="opcoes__item"><a href="../../../tutoriais.html" class="opcoes__link">Tutoriais</a></li>
        <li class="opcoes__item"><a target="_blank" href="https://tutoriaisemmusica.com.br" class="opcoes__link">Cursos</a></li>
        <li class="opcoes__item"><a href="../../../ferramentas.html" class="opcoes__link">Ferramentas</a></li>
        <li class="opcoes__item"><a href="../../../livros.html" class="opcoes__link">Livros</a></li>
        <li class="opcoes__item"><a target="_blank" href="https://carlosveigafilho.com.br/repertorio/index.html" class="opcoes__link">Corais</a></li>
    </ul>
`;
}

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
