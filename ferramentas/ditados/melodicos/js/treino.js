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

const divCardScoreplay = document.getElementById("div-card-scoreplay");
if (divCardScoreplay) {
    divCardScoreplay.innerHTML = `
        <div class="card__imagem-solo">
            <a target="_blank" href="https://tutoriaisemmusica.com.br/scoreplay">
                <img src="../../../img/Scoreplay.jpg" alt="Imagem do curso scoreplay" class="descricao__imagem" height="160px">
            </a>
        </div>
        <div class="card__botao-solo">
            <a target="_blank" href="https://tutoriaisemmusica.com.br/scoreplay" class="botao-conhecer">Conheça</a>
        </div>
`;
}

const divCardTeoria = document.getElementById("div-card-teoria");
if (divCardTeoria) {
    divCardTeoria.innerHTML = `
        <div class="card__imagem-solo">
            <a target="_blank" href="https://tutoriaisemmusica.com.br/teoriamusical">
                <img src="../../../img/Teoria Musical.jpg" alt="Imagem do curso teoria musical" class="descricao__imagem" height="160px">
            </a>
        </div>
        <div class="card__botao-solo">
            <a target="_blank" href="https://tutoriaisemmusica.com.br/teoriamusical" class="botao-conhecer">Conheça</a>
        </div>
`;
}

const divCardIntervalos = document.getElementById("div-card-intervalos");
if (divCardIntervalos) {
    divCardIntervalos.innerHTML = `
        <div class="card__imagem-solo">
            <a target="_blank" href="https://tutoriaisemmusica.com.br/intervalosmusicais">
                <img src="../../../img/Intervalos Musicais.jpg" alt="Imagem do curso intervalos musicais" class="descricao__imagem" height="160px">
            </a>
        </div>
        <div class="card__botao-solo">
            <a target="_blank" href="https://tutoriaisemmusica.com.br/intervalosmusicais" class="botao-conhecer">Conheça</a>
        </div>
`;
}

const divCardFinale = document.getElementById("div-card-finale");
if (divCardFinale) {
    divCardFinale.innerHTML = `
        <div class="card__imagem-solo">
            <a target="_blank" href="https://tutoriaisemmusica.com.br/finaledescomplicado">
                <img src="../../../img/Finale Descomplicado.jpg" alt="Imagem do curso finale" class="descricao__imagem" height="160px">
            </a>
        </div>
        <div class="card__botao-solo">
            <a target="_blank" href="https://tutoriaisemmusica.com.br/finaledescomplicado" class="botao-conhecer">Conheça</a>
        </div>
`;
}

const divCardMelodias = document.getElementById("div-card-melodias");
if (divCardMelodias) {
    divCardMelodias.innerHTML = `
        <div class="card__imagem-solo">
            <a target="_blank" href="https://tutoriaisemmusica.com.br/15melodiasparatocar">
                <img src="../../../img/15 Melodias Para Tocar.jpg" alt="Imagem do curso 15 melodias para tocar" class="descricao__imagem" height="160px">
            </a>
        </div>
        <div class="card__botao-solo">
            <a target="_blank" href="https://tutoriaisemmusica.com.br/15melodiasparatocar" class="botao-conhecer">Conheça</a>
        </div>
`;
}

const livroAnHarm = document.getElementById("div-card-livroAnHarm");
if (livroAnHarm) {
    livroAnHarm.innerHTML = `
        <div class="card__descricao">
            <div class="descricao">
                <h2 class="descricao__titulo">Análise Harmônica para Estudantes de Música</h2>
                <h3 class="descricao__categoria">Livro</h3>
                <p class="descricao__texto">Aprenda a fazer uma análise harmônica completa.</p>
            </div>
            <a target="_blank" href="https://www.amazon.com.br/An%C3%A1lise-Harm%C3%B4nica-para-Estudantes-M%C3%BAsica-ebook/dp/B09CCMDD6Q/ref=sr_1_1?__mk_pt_BR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=2N6LPKLZMKXNO&keywords=an%C3%A1lise+harm%C3%B4nica+para+estudantes+de+m%C3%BAsica&qid=1692020657&sprefix=an%C3%A1lise+harm%C3%B4nica+para+estudantes+de+m%C3%BAsica%2Caps%2C201&sr=8-1">
                <img src="../../../img/LivroAnHarm.jpg" alt="Capa do livro Análise Harmônica para Estudantes de Música" class="descricao__imagem">
            </a>
        </div>
        <div class="card__botoes">
            <a target="_blank" href="https://carlosveigafilho.com.br/divulgacao/livros/DivulgLivro.html" class="botao-conhecer">Conheça</a>
            <a target="_blank" href="https://www.amazon.com.br/An%C3%A1lise-Harm%C3%B4nica-para-Estudantes-M%C3%BAsica-ebook/dp/B09CCMDD6Q/ref=sr_1_1?__mk_pt_BR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=2N6LPKLZMKXNO&keywords=an%C3%A1lise+harm%C3%B4nica+para+estudantes+de+m%C3%BAsica&qid=1692020657&sprefix=an%C3%A1lise+harm%C3%B4nica+para+estudantes+de+m%C3%BAsica%2Caps%2C201&sr=8-1" class="botao-comprar">Compre</a>
        </div>
`;
}

const solfParaPraticar = document.getElementById("div-card-solfParaPraticar");
if (solfParaPraticar) {
    solfParaPraticar.innerHTML = `
        <div class="card__descricao">
            <div class="descricao">
                <h2 class="descricao__titulo">Solfejos para praticar - A série completa</h2>
                <h3 class="descricao__categoria">Solfejo</h3>
                <p class="descricao__texto">Aprimore o seu solfejo nas videoaulas ou apenas cante os solfejos nos shorts. Clique na imagem para baixar o e-book gratis.</p>
            </div>
            <a target="_blank" href="https://carlosveigafilho.com.br/Solfejos/SolfejosParaPraticar.pdf">
                <img src="../../../img/CapaSolfejosParaPraticar.png" alt="Capa do e-book" class="descricao__imagem">
            </a>
        </div>
        <div class="card__botoes">
            <a target="_blank" href="https://carlosveigafilho.com.br/VideoaulasSolfejosParaPraticar/" class="botao-conhecer">Videoaulas</a>
            <a target="_blank" href="https://carlosveigafilho.com.br/ShortsSolfejosParaPraticar/" class="botao-comprar">Shorts</a>
        </div>
`;
}

const metronomo = document.getElementById("div-card-metronomo");
if (metronomo) {
    metronomo.innerHTML = `
        <div class="card__descricao">
            <div class="descricao">
                <h2 class="descricao__titulo">Estudando com o metrônomo</h2>
                <h3 class="descricao__categoria">Ritmo</h3>
                <p class="descricao__texto">Desenvolva a leitura rítmica com estes exercícios. Clique na imagem para baixar o e-book gratuitamente.</p>
            </div>
            <a target="_blank" href="https://carlosveigafilho.com.br/EstMet/EstudandoMetronomo.pdf">
                <img src="../../../img/CapaMetronomo.jpg" alt="Capa do e-book" class="descricao__imagem">
            </a>
        </div>
        <div class="card__botoes">
            <a target="_blank" href="./VideoaulasMetronomo/" class="botao-conhecer">Videoaulas</a>
            <a target="_blank" href="./ShortsMetronomo/" class="botao-comprar">Shorts</a>
        </div>
`;
}

const currentYear = new Date().getFullYear();

const conteudoRodape = '<h2 class="rodape__titulo">Carlos Veiga Filho</h2><h3 class="rodape__texto">Copyright &copy; 2010-'+currentYear+'</h3>';

const rodape = document.getElementById("rodape");
if (rodape) {
    rodape.innerHTML = conteudoRodape;
}
