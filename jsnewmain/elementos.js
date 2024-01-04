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


const dados = [
    {
        "tituloVideo":"Harmonia 01 - Tríades",
        "tituloCabecalho":"O que é tríade?",
        "codigoVideo":"GadkL8Pd5cg",
        "resumoVideo":"Conheça o elemento básico da harmonia."
    },
    {
        "tituloVideo":"Harmonia 02 - Maior, menor e diminuto",
        "tituloCabecalho":"Maior, Menor ou Diminuto?",
        "codigoVideo":"6CtFw23x5qo",
        "resumoVideo":"Aprenda a classificar intervalos e tríades."
    },
    {
        "tituloVideo":"Harmonia 03 - Acordes Maiores e menores",
        "tituloCabecalho":"Maior ou Menor?",
        "codigoVideo":"UAelunGDzgM",
        "resumoVideo":"Reconheça pelo som se o acorde é Maior ou Menor."
    }
]

for (let index = 0; index < 3; index++) {
    let newSection = document.createElement('section');
    newSection.setAttribute('class','carrossel');
    newSection.setAttribute('id','carrossel');

    let container = document.getElementById('conteiner3');

    container.appendChild(newSection);

    let newH2 = document.createElement('h2');
    newH2.setAttribute('class','carrossel__titulo');
    newH2.textContent = dados[index].tituloCabecalho;
    newSection.appendChild(newH2);

    let newDiv1 = document.createElement('div');
    newDiv1.setAttribute('class','card');
    newDiv1.setAttribute('id', 'div1');
    newSection.appendChild(newDiv1);

    let newDiv2 = document.createElement('div');
    newDiv2.setAttribute('class','card__imagem-texto');
    newDiv2.setAttribute('id', 'div2');
    newDiv1.appendChild(newDiv2);

    const linkVideo = 'https://youtu.be/' + dados[index].codigoVideo;

    let newA = document.createElement('a');
    newA.setAttribute('target','_blank');
    newA.setAttribute('href', linkVideo);
    newDiv2.appendChild(newA);

    const imagemVideo = 'https://img.youtube.com/vi/' + dados[index].codigoVideo + '/hqdefault.jpg';

    let newImg = document.createElement('img');
    newImg.setAttribute('src', imagemVideo);
    newImg.setAttribute('alt','Imagem do vídeo');
    newImg.setAttribute('class','descricao__imagem');
    newImg.setAttribute('height','160px');
    newA.appendChild(newImg);

    let newP = document.createElement('p');
    newP.setAttribute('class','texto-card__imagem-texto');
    newP.textContent = dados[index].resumoVideo;
    newDiv2.appendChild(newP);

    let newDiv3 = document.createElement('div');
    newDiv3.setAttribute('class','card__botao-solo');
    newDiv1.appendChild(newDiv3);

    let newA2 = document.createElement('a');
    newA2.setAttribute('target','_blank');
    newA2.setAttribute('href', linkVideo);
    newA2.setAttribute('class','botao-conhecer');
    newA2.textContent = 'Assista';
    newDiv3.appendChild(newA2);

}

for (let index = 4; index < 6; index++) {
    
    let newDiv0 = document.createElement('div');
    let nomeId = 'conteiner' + index;
    newDiv0.setAttribute('id', nomeId);

    let containerPrincipal = document.getElementById('conteiner-principal');

    containerPrincipal.appendChild(newDiv0);

    for (let index = 0; index < 3; index++) {
        let newSection = document.createElement('section');
        newSection.setAttribute('class','carrossel');
        newSection.setAttribute('id','carrossel');
    
        newDiv0.appendChild(newSection);
    
        let newH2 = document.createElement('h2');
        newH2.setAttribute('class','carrossel__titulo');
        newH2.textContent = dados[index].tituloCabecalho;
        newSection.appendChild(newH2);
    
        let newDiv1 = document.createElement('div');
        newDiv1.setAttribute('class','card');
        newDiv1.setAttribute('id', 'div1');
        newSection.appendChild(newDiv1);
    
        let newDiv2 = document.createElement('div');
        newDiv2.setAttribute('class','card__imagem-texto');
        newDiv2.setAttribute('id', 'div2');
        newDiv1.appendChild(newDiv2);

        const linkVideo = 'https://youtu.be/' + dados[index].codigoVideo;
    
        let newA = document.createElement('a');
        newA.setAttribute('target','_blank');
        newA.setAttribute('href', linkVideo);
        newDiv2.appendChild(newA);

        const imagemVideo = 'https://img.youtube.com/vi/' + dados[index].codigoVideo + '/hqdefault.jpg';
    
        let newImg = document.createElement('img');
        newImg.setAttribute('src', imagemVideo);
        newImg.setAttribute('alt','Imagem do vídeo Solfejo 03 Software');
        newImg.setAttribute('class','descricao__imagem');
        newImg.setAttribute('height','160px');
        newA.appendChild(newImg);
    
        let newP = document.createElement('p');
        newP.setAttribute('class','texto-card__imagem-texto');
        newP.textContent = dados[index].resumoVideo;;
        newDiv2.appendChild(newP);
    
        let newDiv3 = document.createElement('div');
        newDiv3.setAttribute('class','card__botao-solo');
        newDiv1.appendChild(newDiv3);
    
        let newA2 = document.createElement('a');
        newA2.setAttribute('target','_blank');
        newA2.setAttribute('href', linkVideo);
        newA2.setAttribute('class','botao-conhecer');
        newA2.textContent = 'Assista';
        newDiv3.appendChild(newA2);
    
    }
    
}
