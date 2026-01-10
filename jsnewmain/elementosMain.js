const cabecalho = document.getElementById("cabecalho");
if (cabecalho) {
    cabecalho.innerHTML = `
    <input type="checkbox" id="menu" class="cabecalho__botao">
    <label for="menu" class="rotulo">
        <span class="cabecalho__menu-hamburger"></span>
    </label>
    <ul class="lista-menu">
        <li class="lista-menu__titulo">Categorias</li>
        <li class="lista-menu__item"><a href="../tutoriais.html" class="lista-menu__link">Tutoriais</a></li>
        <li class="lista-menu__item"><a target="_blank" href="https://tutoriaisemmusica.com.br" class="lista-menu__link">Cursos</a></li>
        <li class="lista-menu__item"><a href="../ferramentas.html" class="lista-menu__link">Ferramentas</a></li>
        <li class="lista-menu__item"><a href="../livros.html" class="lista-menu__link">Livros</a></li>
        <li class="lista-menu__item"><a target="_blank" href="https://carlosveigafilho.com.br/repertorio/index.html" class="lista-menu__link">Corais</a></li>
    </ul>
    <a href="/index.html"><img src="https://carlosveigafilho.com.br/img/LogoTuts40.png" class="cabecalho__imagem" alt="Logo dos Tutoriais em Música"></a>
    <h1 class="titulo-principal">Carlos Veiga Filho</h1>

    <ul class="opcoes">
        <li class="opcoes__item"><a href="../tutoriais.html" class="opcoes__link">Tutoriais</a></li>
        <li class="opcoes__item"><a target="_blank" href="https://tutoriaisemmusica.com.br" class="opcoes__link">Cursos</a></li>
        <li class="opcoes__item"><a href="../ferramentas.html" class="opcoes__link">Ferramentas</a></li>
        <li class="opcoes__item"><a href="../livros.html" class="opcoes__link">Livros</a></li>
        <li class="opcoes__item"><a target="_blank" href="https://carlosveigafilho.com.br/repertorio/index.html" class="opcoes__link">Corais</a></li>
    </ul>
`;
}

const cursos = document.getElementById("secao-cursos");
if (cursos) {
    cursos.innerHTML = `
    <h2 class="topicos__titulo">Cursos</h2>
    <ul class="topicos__lista">
        <li class="topicos__item">
            <a class="topicos__link" href="https://tutoriaisemmusica.com.br/scoreplay" target="_blank">Scoreplay</a>
        </li>
        <li class="topicos__item">
            <a class="topicos__link" href="https://tutoriaisemmusica.com.br/15melodiasparatocar" target="_blank">15 Melodias</a>
        </li>
        <li class="topicos__item">
            <a class="topicos__link" href="https://tutoriaisemmusica.com.br/teoriamusical" target="_blank">Teoria</a>
        </li>
        <li class="topicos__item">
            <a class="topicos__link" href="https://tutoriaisemmusica.com.br/intervalosmusicais" target="_blank">Intervalos</a>
        </li>
        <li class="topicos__item">
            <a class="topicos__link" href="https://tutoriaisemmusica.com.br/finaledescomplicado" target="_blank">Finale</a>
        </li>
    </ul>
`;
}


const playlists = document.getElementById("secao-playlists");
if (playlists) {
    playlists.innerHTML = `
    <h2 class="topicos__titulo">Playlists do youtube</h2>
    <ul class="topicos__lista">
        <li class="topicos__item">
            <a class="topicos__link" href="https://www.youtube.com/playlist?list=PLPPAfvKjYPk2k7d1KcoGJxPVotCPQuCYb" target="_blank">Minicurso Solfejo</a>
        </li>
        <li class="topicos__item">
            <a class="topicos__link" href="https://www.youtube.com/playlist?list=PLPPAfvKjYPk0sxktVnfbIcs2LPiFBTQFw" target="_blank">Estudando Música</a>
        </li>
        <li class="topicos__item">
            <a class="topicos__link" href="https://www.youtube.com/playlist?list=PLPPAfvKjYPk2XlppJArrQSWMf2cenDLxi" target="_blank">Música e Metrônomo</a>
        </li>
        <li class="topicos__item">
            <a class="topicos__link" href="https://www.youtube.com/playlist?list=PLPPAfvKjYPk0s3tSiLsMydzLy-lrBqzIh" target="_blank">Harmonia na Prática</a>
        </li>
    </ul>
`;
}

const centralIntervalos = document.getElementById("div-card-centralIntervalos");
if (centralIntervalos) {
    centralIntervalos.innerHTML = `
        <div class="card__descricao">
            <div class="descricao">
                <h2 class="descricao__titulo">Central dos Intervalos</h2>
                <h3 class="descricao__categoria">Ferramentas</h3>
                <p class="descricao__texto">Conheça esta maravilhosa central com vídeos, exercícios e games.</p>
            </div>
            <a target="_blank" href="https://carlosveigafilho.com.br/intervalosmusicais/index.html">
                <img src="/img/imagemCentralIntervalos.png" alt="Capa da Central dos Intervalos" class="descricao__imagem">
            </a>
        </div>
        <div class="card__botoes">
            <a target="_blank" href="https://carlosveigafilho.com.br/intervalosmusicais/index.html" class="botao-conhecer">Página de estudos</a>
            <a target="_blank" href="https://carlosveigafilho.com.br/intervalosmusicais/centralInterv.html" class="botao-comprar">Central dos Intervalos</a>
        </div>
`;
}

const solfParaPraticar = document.getElementById("div-card-solfParaPraticar");
if (solfParaPraticar) {
    solfParaPraticar.innerHTML = `
        <div class="card__descricao">
            <div class="descricao">
                <h2 class="descricao__titulo">Solfejos para praticar - A série completa</h2>
                <h3 class="descricao__categoria">E-Book</h3>
                <p class="descricao__texto">Aprimore o seu solfejo nas videoaulas ou apenas cante os solfejos nos shorts. Clique na imagem para baixar o e-book gratis.</p>
            </div>
            <a target="_blank" href="https://carlosveigafilho.com.br/Solfejos/SolfejosParaPraticar.pdf">
                <img src="/img/CapaSolfejosParaPraticar.png" alt="Capa do e-book" class="descricao__imagem">
            </a>
        </div>
        <div class="card__botoes">
            <a target="_blank" href="https://carlosveigafilho.com.br/VideoaulasSolfejosParaPraticar/" class="botao-conhecer">Videoaulas</a>
            <a target="_blank" href="https://carlosveigafilho.com.br/ShortsSolfejosParaPraticar/" class="botao-comprar">Shorts</a>
        </div>
`;
}

const tutoriaisSolfejo = document.getElementById("div-card-tutoriaisSolfejo");
if (tutoriaisSolfejo) {
    tutoriaisSolfejo.innerHTML = `
        <div class="card__imagem-texto">
            <a target="_blank" href="./IntroducaoSolfejo/index.html">
                <img src="https://img.youtube.com/vi/qqw3War57BQ/hqdefault.jpg" alt="Imagem do vídeo solfejo 01 Introducao" class="descricao__imagem" height="160px">
            </a>
            <p class="texto-card__imagem-texto">Esta é a primeira série que gravei, iniciada em dezembro de 2010.<br>Comece aqui a sua jornada.</p>
        </div>
        <div class="card__botao-solo">
            <a target="_blank" href="./IntroducaoSolfejo/index.html" class="botao-conhecer">Assista</a>
        </div>
`;
}

const semanaMiMaior = document.getElementById("div-card-semana-mi-maior");
if (semanaMiMaior) {
    semanaMiMaior.innerHTML = `
        <div class="card__imagem-texto">
            <a target="_blank" href="./IntroducaoSolfejo/index.html">
                <img src="https://img.youtube.com/vi/mWAzHYehl8s/hqdefault.jpg" alt="Imagem do vídeo Mi Maior" class="descricao__imagem" height="160px">
            </a>
            <p class="texto-card__imagem-texto">Esta é a Semana em Mi Maior. Criada em janeiro de 2026.<br>Pratique muito esta tonalidade.</p>
        </div>
        <div class="card__botao-solo">
            <a target="_blank" href="./SemanaMiMaior/index.html" class="botao-conhecer">Semana em Mi Maior</a>
        </div>
`;
}


const solfejoPraticar = document.getElementById("div-card-solfejo-praticar");
if (solfejoPraticar) {
    solfejoPraticar.innerHTML = `
        <div class="card__descricao">
            <div class="descricao">
                <h2 class="descricao__titulo">Desenvolvendo o Solfejo</h2>
                <h3 class="descricao__categoria">Site</h3>
                <p class="descricao__texto">Pratique o solfejo diariamente. Clique na imagem para ir para o site.</p>
            </div>
            <a target="_blank" href="https://carlosveigafilho.com.br/ferramentas/solfejos/treino01.html">
                <img src="/img/FerramentaSolfejo.jpg" alt="imagem da ferramenta solfejo" class="descricao__imagem imagem__reduzida">
            </a>
        </div>
        <div class="card__botoes">
        </div>
`;
}

const metronomoFa = document.getElementById("div-card-metronomo-fa");
if (metronomoFa) {
    metronomoFa.innerHTML = `
        <div class="card__descricao">
            <div class="descricao">
                <h2 class="descricao__titulo">Metrônomo Clave de Fá</h2>
                <h3 class="descricao__categoria">E-Book</h3>
                <p class="descricao__texto">Ganhe fluência na leitura da clave de fá. Clique na imagem para baixar o e-book gratuitamente.</p>
            </div>
            <a target="_blank" href="https://carlosveigafilho.com.br/EstMet/MetronomoClaveFa.pdf">
                <img src="/img/CapaMetronomoFa.jpg" alt="Capa do e-book" class="descricao__imagem">
            </a>
        </div>
        <div class="card__botoes">
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
                <img src="/img/CapaMetronomo.jpg" alt="Capa do e-book" class="descricao__imagem">
            </a>
        </div>
        <div class="card__botoes">
            <a target="_blank" href="./VideoaulasMetronomo/" class="botao-conhecer">Videoaulas</a>
            <a target="_blank" href="./ShortsMetronomo/" class="botao-comprar">Shorts</a>
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
                <img src="/img/LivroAnHarm.jpg" alt="Capa do livro Análise Harmônica para Estudantes de Música" class="descricao__imagem">
            </a>
        </div>
        <div class="card__botoes">
            <a target="_blank" href="https://carlosveigafilho.com.br/divulgacao/livros/DivulgLivro.html" class="botao-conhecer">Conheça</a>
            <a target="_blank" href="https://www.amazon.com.br/An%C3%A1lise-Harm%C3%B4nica-para-Estudantes-M%C3%BAsica-ebook/dp/B09CCMDD6Q/ref=sr_1_1?__mk_pt_BR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=2N6LPKLZMKXNO&keywords=an%C3%A1lise+harm%C3%B4nica+para+estudantes+de+m%C3%BAsica&qid=1692020657&sprefix=an%C3%A1lise+harm%C3%B4nica+para+estudantes+de+m%C3%BAsica%2Caps%2C201&sr=8-1" class="botao-comprar">Compre</a>
        </div>
`;
}

const divCardScoreplay = document.getElementById("div-card-scoreplay");
if (divCardScoreplay) {
    divCardScoreplay.innerHTML = `
        <div class="card__imagem-solo">
            <a target="_blank" href="https://tutoriaisemmusica.com.br/scoreplay">
                <img src="/img/Scoreplay.jpg" alt="Imagem do curso scoreplay" class="descricao__imagem" height="160px">
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
                <img src="/img/Teoria Musical.jpg" alt="Imagem do curso teoria musical" class="descricao__imagem" height="160px">
            </a>
        </div>
        <div class="card__botao-solo">
            <a target="_blank" href="https://tutoriaisemmusica.com.br/teoriamusical" class="botao-conhecer">Conheça</a>
        </div>
`;
}

const currentYear = new Date().getFullYear();

const conteudoRodape = '<h2 class="rodape__titulo">Carlos Veiga Filho</h2><h3 class="rodape__texto">Copyright &copy; 2010-'+currentYear+'</h3>';

const rodape = document.getElementById("rodape");
if (rodape) {
    rodape.innerHTML = conteudoRodape;
}
