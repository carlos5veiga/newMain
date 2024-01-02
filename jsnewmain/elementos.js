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
    <a href="../index.html"><img src="../img/LogoTuts40.png" class="cabecalho__imagem" alt="Logo dos Tutoriais em Música"></a>
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


const currentYear = new Date().getFullYear();

const conteudoRodape = '<h2 class="rodape__titulo">Carlos Veiga Filho</h2><h3 class="rodape__texto">Copyright &copy; 2010-'+currentYear+'</h3>';

const rodape = document.getElementById("rodape");
if (rodape) {
    rodape.innerHTML = conteudoRodape;
}


