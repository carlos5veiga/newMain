import { dados } from './dadosVideoaulasPraticar.js'

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
    <a href="../index.html"><img src="https://carlosveigafilho.com.br/img/LogoTuts40.png" class="cabecalho__imagem" alt="Logo dos Tutoriais em Música"></a>
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
                <img src="./img/LivroAnHarm.jpg" alt="Capa do livro Análise Harmônica para Estudantes de Música" class="descricao__imagem">
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
                <img src="../../img/Scoreplay.jpg" alt="Imagem do curso scoreplay" class="descricao__imagem" height="160px">
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
                <img src="../../img/Teoria Musical.jpg" alt="Imagem do curso teoria musical" class="descricao__imagem" height="160px">
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



  
for (let index = 1; index < 2; index++) {
    
    let newDiv0 = document.createElement('div');
    let nomeId = 'conteiner' + index;
    newDiv0.setAttribute('id', nomeId);

    let containerPrincipal = document.getElementById('conteiner-principal');

    containerPrincipal.appendChild(newDiv0);

    for (let index = 0; index < dados.length; index++) {
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
